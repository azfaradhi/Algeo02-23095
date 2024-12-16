import os
import logging
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from pca.image_processing import process_single_image
from pca.data_centering import standardize_data, standardized_single_image
from pca.svd import pca_svd_direct, svd_single_image
from pca.similarity_comp import euclidean_distance_batch
import pickle
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO)

# Cache setup
cache_dir = Path("cache")
cache_dir.mkdir(exist_ok=True)
_image_cache_file = cache_dir / "image_features"
_image_database_cache = None

def clear_image_cache():
    """Clear the image features cache"""
    global _image_database_cache
    _image_database_cache = None
    if os.path.exists(_image_cache_file):
        os.remove(_image_cache_file)
    print("Image cache cleared")


def get_image_database():
    global _image_database_cache
    
    if _image_database_cache is not None:
        print("Using cached database")
        return _image_database_cache['files'], _image_database_cache['vectors']
    
    if os.path.exists(_image_cache_file):
        try:
            with open(_image_cache_file, 'rb') as f:
                _image_database_cache = pickle.load(f)
            print("Loaded database from cache")
            return _image_database_cache['files'], _image_database_cache['vectors']
        except Exception as e:
            print(f"Error loading cache: {e}")
    
    print("Processing database and creating cache...")
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_folder = os.path.abspath(os.path.join(current_dir, "..", "..", "public", "dataset", "test_image"))
    
    dataset_files = sorted([
        filename for filename in os.listdir(dataset_folder)
        if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff'))
    ])
    
    dataset_vectors = []
    for filename in dataset_files:
        file_path = os.path.join(dataset_folder, filename)
        try:
            vector = process_single_image(file_path, target_size=(64, 64))
            dataset_vectors.append(vector)
        except Exception as e:
            logging.error(f"Error processing {filename}: {e}")
            continue
    
    dataset_vectors = np.array(dataset_vectors)
    
    _image_database_cache = {
        'files': dataset_files,
        'vectors': dataset_vectors
    }
    
    try:
        with open(_image_cache_file, 'wb') as f:
            pickle.dump(_image_database_cache, f)
        print("Saved database to cache")
    except Exception as e:
        print(f"Error saving cache: {e}")
    
    return dataset_files, dataset_vectors



def compare_image_with_dataset(uploadedImageName):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_folder = os.path.abspath(os.path.join(current_dir, "..", "..", "public", "dataset","test_image"))
    k = 50

    # Step 1: Load dataset vectors
    dataset_files, dataset_vectors = get_image_database()

    # Step 2: Memproses uploaded image
    uploadedImagePath = os.path.join(dataset_folder, uploadedImageName)
    try:
        query_vector = process_single_image(uploadedImagePath, target_size=(64, 64))
    except Exception as e:
        logging.error(f"Error processing uploaded image {uploadedImageName}: {e}")
        raise HTTPException(status_code=500, detail="Error processing uploaded image")

    # Step 3: Standardize dataset dan query
    standardized_dataset, mean_vector = standardize_data(dataset_vectors)
    standardized_query = standardized_single_image(query_vector, mean_vector)

    # Step 4:  PCA dengan SVD
    reduced_dataset, Uk = pca_svd_direct(standardized_dataset, k)
    reduced_query = svd_single_image(standardized_query, Uk)

    # Step 5: Menghitung kemiripan
    distances = euclidean_distance_batch(reduced_query, reduced_dataset)
    similarity_percentages = 100 * (1 - distances / np.max(distances))

    # Step 6: Return all results
    results = [
        {'namafile': dataset_files[i], 'score': similarity_percentages[i] / 100}
        for i in range(len(dataset_files))
    ]

    sorted_results = sorted(results, key=lambda x: x['score'], reverse=True)
    return sorted_results


# def compare_image_with_dataset(uploadedImageName):
#     current_dir = os.path.dirname(os.path.abspath(__file__))
#     dataset_folder = os.path.abspath(os.path.join(current_dir, "..", "..", "public", "dataset","test_image"))
#     k = 50
#     dataset_files = sorted([
#         filename for filename in os.listdir(dataset_folder)
#         if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff'))
#     ])
    
#     dataset_vectors = []
#     for filename in dataset_files:
#         file_path = os.path.join(dataset_folder, filename)
#         try:
#             vector = process_single_image(file_path, target_size=(64, 64))
#             dataset_vectors.append(vector)
#         except Exception as e:
#             logging.error(f"Error processing {filename}: {e}")
#             continue  # Skip files that cause errors

#     dataset_vectors = np.array(dataset_vectors)

#     # Step 2: Process the uploaded image
#     uploadedImagePath = os.path.join(dataset_folder, uploadedImageName)
#     try:
#         query_vector = process_single_image(uploadedImagePath, target_size=(64, 64))
#     except Exception as e:
#         logging.error(f"Error processing uploaded image {uploadedImageName}: {e}")
#         raise HTTPException(status_code=500, detail="Error processing uploaded image")

#     # Step 3: Standardize dataset and query
#     standardized_dataset, mean_vector = standardize_data(dataset_vectors)
#     standardized_query = standardized_single_image(query_vector, mean_vector)

#     # Step 4: Perform PCA using SVD
#     reduced_dataset, Uk = pca_svd_direct(standardized_dataset, k)
#     reduced_query = svd_single_image(standardized_query, Uk)

#     # Step 5: Compute similarities
#     distances = euclidean_distance_batch(reduced_query, reduced_dataset)
#     similarity_percentages = 100 * (1 - distances / np.max(distances))

#     # Step 6: Return all results
#     results = [
#         {'namafile': dataset_files[i], 'score': similarity_percentages[i] / 100}  # Convert to [0, 1] range
#         for i in range(len(dataset_files))
#     ]

#     # Sort results by similarity score in descending order
#     sorted_results = sorted(results, key=lambda x: x['score'], reverse=True)

#     return sorted_results
