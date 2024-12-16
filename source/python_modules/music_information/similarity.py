import numpy as np

def cosine_simiilarity(v1,v2):
    if np.all(v1 == 0) and np.all(v2 == 0):
        return 1
    if np.all(v1 == 0) or np.all(v2 == 0):
        return 0.0
    dot = np.dot(v1,v2)
    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)

    if (norm1 == 0) or (norm2 == 0):
        return 0.0
    else:
        res = dot / (norm1 * norm2)
        if (1-res) < 1e-10:
            res = 1
        return res
    
def calculate_similarity(query,target, weights = {'atb':0.5, 'rtb':0.3, 'ftb':0.2}):
    similarities = {
        'atb': cosine_simiilarity(query['atb'], target['atb']),
        'rtb': cosine_simiilarity(query['rtb'], target['rtb']),
        'ftb': cosine_simiilarity(query['ftb'], target['ftb'])
    }

    final = sum(weights[type] * sim for type,sim in similarities.items())
    return final

def calculate_from_all_feature(features1, features2):
    similar = []

    length_ratio = min(len(features1),len(features2)) / max(len(features1),len(features2))

    if length_ratio < 0.05:
        return 0
    
    for i in range(min(len(features1),len(features2))):
        similar.append(calculate_similarity(features1[i],features2[i],{'atb':0.5, 'rtb':0.3, 'ftb':0.2}))
    if (len(similar) == 0):
        return 0
    
    avg = np.average(similar)
    # weighted_avg = avg * length_ratio

    return avg

def compare_features_with_database(features, database):
    res = []
    for i in range(len(database)):
        sim = calculate_from_all_feature(features,database[i]['features'])
        res.append((database[i]['nama'], sim))
    res.sort(key=lambda x: x[1], reverse=True)

    top = [item for item in res if item[1] > 0.7]
    print([{'namafile': item[0], 'score': item[1]} for item in top])
    return [{'namafile': item[0], 'score': item[1]} for item in top]