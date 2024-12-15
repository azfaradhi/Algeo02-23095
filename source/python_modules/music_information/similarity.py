import numpy as np
# import audio_processing
# import extract_feature
# import os
# import mido

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

    top_5 = res[:5]
    print([{'namafile': item[0], 'score': item[1]} for item in top_5])
    return [{'namafile': item[0], 'score': item[1]} for item in top_5]
    
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

# na1 = "coldplaycover.wav"
# starttime = time.time()
# na2 = "Faded_Love.mid"
# window1 = audio_processing.wav_processing(na1)
# feature = extract_feature.extract_feature(window1)
# print(feature)
# window2 = audio_processing.midi_processing(na2)  
# feature2 = extract_feature.extract_feature(window2)

# a = calculate_from_all_feature(feature,feature2)
# print(a)

# list = []
# database = "../wav_dataset"

# for root, dirs, files in os.walk(database):
#     for filename in files:
#         # Check if file has .mid or .midi extension
#         if not filename.lower().endswith(('.wav', '.mp3', '.mid', '.midi')):
#             continue
#         file_path = os.path.join(root, filename)  # Get the full file path
#         if os.path.isfile(file_path):  # Check if it is a valid file
#             try:
#                 temp = audio_processing.wav_processing(file_path)  # Process the file
#                 temp2 = extract_feature.extract_feature(temp)  # Extract features
#                 list.append({'nama': filename, 'features': temp2})
#             except Exception as e:
#                 print(f"Error processing {root} {filename}: {str(e)}")
#                 continue

# a = compare_features_with_database(feature, list)
# endtime = time.time()
# print(a)
# print(endtime-starttime)