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
    print(f" pertama: {len(features1)}",end="")
    print(f" kedua: {len(features2)}")
    for i in range(min(len(features1),len(features2))):
        similar.append(calculate_similarity(features1[i],features2[i],{'atb':0.5, 'rtb':0.3, 'ftb':0.2}))
    avg = np.average(similar)
    return avg

def compare_features_with_database(features, database):
    res = []
    for i in range(len(database)):
        print(f"{i}",end="")
        sim = calculate_from_all_feature(features,database[i]['features'])
        res.append(sim)
    maxidx = np.argmax(res)
    score = max(res)
    return {'namafile': database[i]['nama'], 'score':score}
    
# na1 = "alb_esp1.mid"
# window1 = audio_processing.midi_processing(na1)
# all1 = extract_feature.extract_feature(window1)

# na2 = "alb_esp2.mid"
# window2 = audio_processing.midi_processing(na2)
# all2 = extract_feature.extract_feature(window2)

# # for i in range(len(all1)):
# #     print(i,end=" ")
# #     print(calculate_similarity(all1[i],all2[i],  {'atb':0.5, 'rtb':0.3, 'ftb':0.2}))


# print(calculate_from_all_feature(all1,all2))
# list = []
# folderpath = "./midi_dataset/"
# for filename in os.listdir(folderpath):
#     file = os.path.join(folderpath,filename)
#     temp = audio_processing.midi_processing(file)
#     temp2 = extract_feature.extract_feature(temp)
#     list.append({'nama':filename,'features':temp2})

# na1 = "x (26).mid"
# b = os.path.join(folderpath,na1)
# window1 = audio_processing.midi_processing(b)
# all1 = extract_feature.extract_feature(window1)

# a = compare_features_with_database(all1,list)