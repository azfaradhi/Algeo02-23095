import json
import extract_feature
import similarity
import audio_processing

def json_to_dict(json_file_path):
    # Membaca file JSON
    with open(json_file_path, 'r') as json_file:
        data = json.load(json_file)
    
    # Mengembalikan data yang dibaca dalam bentuk dictionary
    return data

filejson = "midi_features.json"
database = json_to_dict(filejson)

print(database)
filetest = "testmidi/alb_esp1.mid"

windows = audio_processing.midi_processing(filetest)
features = extract_feature.extract_feature(windows)
similariti = similarity.similarity_calculator(features,database)
best = similarity.find_max(similariti)
print(best)