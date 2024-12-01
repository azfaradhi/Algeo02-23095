import os
import json
import mido
import numpy as np
from scipy.spatial.distance import cosine
import audio_processing
import extract_feature

# Fungsi untuk mengonversi ndarray ke list secara rekursif
def convert_ndarray_to_list(obj):
    if isinstance(obj, np.ndarray):
        return obj.tolist()  # Ubah ndarray menjadi list
    elif isinstance(obj, dict):
        return {key: convert_ndarray_to_list(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_ndarray_to_list(item) for item in obj]
    else:
        return obj  # Jika bukan ndarray, kembalikan objek seperti biasa

def change_file_to_json(folderpath):
    midi_files = [f for f in os.listdir(folderpath) if f.endswith('.mid')]
    all_features = {}

    for file in midi_files:
        midi_file_path = os.path.join(folderpath, file)
        windows = audio_processing.midi_processing(midi_file_path)
        features = extract_feature.extract_feature(windows)
        
        # Ubah semua ndarray dalam features menjadi list
        features = convert_ndarray_to_list(features)
        
        # Menyimpan fitur dalam dictionary berdasarkan nama file
        all_features[file] = features
        print(f"Fitur dari {file} telah diekstrak.")
    
    return all_features

# Path folder tempat file MIDI disimpan
folder_path = "testmidi"

# Proses semua file MIDI dalam folder
features = change_file_to_json(folder_path)

# Simpan hasil ekstraksi fitur dalam format JSON
with open('midi_features.json', 'w') as json_file:
    json.dump(features, json_file, indent=4)

print("Fitur MIDI telah disimpan dalam format JSON.")
