import music_information.audio_processing as audio
import music_information.extract_feature as extract
import music_information.similarity as sim
import os
import time
import pickle
from pathlib import Path


cache_dir = Path("cache")
cache_dir.mkdir(exist_ok=True)

# inisialisasi cache
_cache_file = cache_dir / "test_audio"

_database_cache = None

def clear_cache():
    global _database_cache
    _database_cache = None
    if os.path.exists(_cache_file):
        os.remove(_cache_file)
    print("Cache cleared")

def process_database():
    """Process all files in database and return the features list"""
    list = []
    database = "../public/dataset/test_audio"
    
    for root, dirs, files in os.walk(database):
        for filename in files:
            if not filename.lower().endswith(('.wav', '.mp3', '.mid', '.midi')):
                continue

            file_path = os.path.join(root, filename)  
            if os.path.isfile(file_path):
                try:
                    if file_path.endswith('.mid'):
                        windows = audio.midi_processing(file_path)
                    elif file_path.endswith('.wav'):
                        windows = audio.wav_processing(file_path)
                    temp2 = extract.extract_feature(windows)
                    list.append({'nama': filename, 'features': temp2})
                except Exception as e:
                    print(f"Error processing {root} {filename}: {str(e)}")
                    continue
    return list

def get_database_features():
    global _database_cache
    
    print(f"Cache file location: {_cache_file}") 
    print(f"Cache file exists: {os.path.exists(_cache_file)}") 
    print(f"Current _database_cache state: {'populated' if _database_cache is not None else 'None'}")  # Debu
    
    # kalau udah ada cache sebelumnya
    if _database_cache is not None:
        print("using cached database")
        return _database_cache
        
    # Try to load from cache file
    if os.path.exists(_cache_file):
        try:
            with open(_cache_file, 'rb') as f:
                _database_cache = pickle.load(f)
            print("Loaded database from cache")
            return _database_cache
        except Exception as e:
            print(f"Error loading cache: {e}")
    
    # kalau belum ada
    print("Processing database and creating cache...")
    _database_cache = process_database()
    
    # save cache file
    try:
        with open(_cache_file, 'wb') as f:
            pickle.dump(_database_cache, f)
        print("Saved database to cache")
    except Exception as e:
        print(f"Error saving cache: {e}")
    
    return _database_cache

def compare_file_with_database(uploadedName):

    start = time.time()
    
    # ngambil database
    list = get_database_features()
    lenlist = len(list)
    
    pathfile = os.path.join(".", "uploads", uploadedName)
    if pathfile.endswith('.mid'):
        windows = audio.midi_processing(pathfile)
    elif pathfile.endswith('.wav'): 
        windows = audio.wav_processing(pathfile)
    features = extract.extract_feature(windows)
    # compare
    result = sim.compare_features_with_database(features, list)
    end = time.time()
    return {"album": result, "time": end-start, "len": lenlist}