import os
import shutil
import logging
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from pca.image_processing import process_single_image
from pca.data_centering import standardize_data, standardized_single_image
from pca.svd import pca_svd_direct, svd_single_image
from pca.similarity_comp import euclidean_distance_batch

# Setup logging
logging.basicConfig(level=logging.INFO)

def compare_image_with_dataset(uploadedImageName):
    """
    Compare the uploaded image against all dataset images and return all matches.

    Args:
        uploadedImageName (str): Name of the uploaded image.

    Returns:
        list: A list of results with filenames and their similarity scores.
    """
    dataset_folder = os.path.join(os.getcwd(), "image_dataset")
    k = 50

    # Step 1: Load dataset vectors
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
            continue  # Skip files that cause errors

    dataset_vectors = np.array(dataset_vectors)

    # Step 2: Process the uploaded image
    uploadedImagePath = os.path.join(dataset_folder, uploadedImageName)
    try:
        query_vector = process_single_image(uploadedImagePath, target_size=(64, 64))
    except Exception as e:
        logging.error(f"Error processing uploaded image {uploadedImageName}: {e}")
        raise HTTPException(status_code=500, detail="Error processing uploaded image")

    # Step 3: Standardize dataset and query
    standardized_dataset, mean_vector = standardize_data(dataset_vectors)
    standardized_query = standardized_single_image(query_vector, mean_vector)

    # Step 4: Perform PCA using SVD
    reduced_dataset, Uk = pca_svd_direct(standardized_dataset, k)
    reduced_query = svd_single_image(standardized_query, Uk)

    # Step 5: Compute similarities
    distances = euclidean_distance_batch(reduced_query, reduced_dataset)
    similarity_percentages = 100 * (1 - distances / np.max(distances))

    # Step 6: Return all results
    results = [
        {'namafile': dataset_files[i], 'score': similarity_percentages[i] / 100}  # Convert to [0, 1] range
        for i in range(len(dataset_files))
    ]

    # Sort results by similarity score in descending order
    sorted_results = sorted(results, key=lambda x: x['score'], reverse=True)

    return sorted_results
