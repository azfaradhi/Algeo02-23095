import os
import numpy as np
from image_processing import process_single_image
from data_centering import standardize_data, standardized_single_image
from svd import pca_svd_direct, svd_single_image
from similarity_comp import euclidean_distance_batch

def compare_image_with_dataset(uploadedImagePath, dataset_folder='static/datasets', k=50):
    """
    Compare the uploaded image against the dataset images and return the best match.

    Args:
        uploadedImagePath (str): Path to the uploaded image.
        dataset_folder (str): Path to the dataset folder (default: 'static/datasets').
        k (int): Number of principal components to retain during PCA (default: 50).

    Returns:
        dict: The result with the most similar file and its similarity score.
    """
    # Step 1: Load dataset vectors, excluding the uploaded image itself
    dataset_files = sorted([
        filename for filename in os.listdir(dataset_folder)
        if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff'))
    ])
    dataset_vectors = []
    for filename in dataset_files:
        file_path = os.path.join(dataset_folder, filename)
        vector = process_single_image(file_path, target_size=(224, 224))
        dataset_vectors.append(vector)

    dataset_vectors = np.array(dataset_vectors)

    # Step 2: Process the uploaded image
    query_vector = process_single_image(uploadedImagePath, target_size=(224, 224))

    # Step 3: Standardize dataset and query
    standardized_dataset, mean_vector = standardize_data(dataset_vectors)
    standardized_query = standardized_single_image(query_vector, mean_vector)

    # Step 4: Perform PCA using SVD
    reduced_dataset, Uk = pca_svd_direct(standardized_dataset, k)
    reduced_query = svd_single_image(standardized_query, Uk)

    # Step 5: Compute similarities
    distances = euclidean_distance_batch(reduced_query, reduced_dataset)
    similarity_percentages = 100 * (1 - distances / np.max(distances))

    # Step 6: Find the best match
    best_match_idx = np.argmax(similarity_percentages)
    best_match_file = dataset_files[best_match_idx]
    best_match_score = similarity_percentages[best_match_idx]

    return {
        'namafile': best_match_file,
        'score': best_match_score / 100  # Convert to [0, 1] range
    }
