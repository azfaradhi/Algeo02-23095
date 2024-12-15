import music_information.audio_processing as audio
import music_information.extract_feature as extract
import music_information.similarity as sim
import os

def compare_file_with_database(uploadedName):
    list = []
    database = "../public/dataset/test_midi_dataset"
    for filename in os.listdir(database):
        file = os.path.join(database,filename)
        try:
            temp = audio.midi_processing(file)
            temp2 = extract.extract_feature(temp)
            list.append({'nama': filename, 'features': temp2})
        except Exception as e:
            print(f"Error processing file {filename}: {e}")
            continue
    windows = audio.midi_processing(uploadedName)
    features = extract.extract_feature(windows)
    result = sim.compare_features_with_database(features,list)
    return result