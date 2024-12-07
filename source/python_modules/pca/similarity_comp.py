import os
import sys
import numpy as np
from PIL import Image
from image_processing import *

def get_latest_image_path(directory):
    files = os.listdir(directory)
    image_files = [file for file in files if file.endswith('.jpg') or file.endswith('.png')]
    if not image_files:
        return None
    latest_image = max(image_files, key=lambda x: os.path.getmtime(os.path.join(directory, x)))
    return os.path.join(directory, latest_image)

import numpy as np

def euclidean_distance_batch(query_vector, dataset_vectors):
    """
    Compute Euclidean distance between a query vector and all vectors in the dataset.

    Args:
        query_vector (numpy.ndarray): Query vector (1D array, shape `(k,)`).
        dataset_vectors (numpy.ndarray): Dataset vectors (2D array, shape `(N, k)`).

    Returns:
        numpy.ndarray: Array of Euclidean distances (1D array, shape `(N,)`).
    """
    # Hitung perbedaan antara query_vector dan setiap vektor di dataset
    differences = dataset_vectors - query_vector  # Shape: (N, k)

    # Hitung kuadrat perbedaan, jumlahkan di setiap baris, lalu akar kuadrat
    distances = np.sqrt(np.sum(differences**2, axis=1))  # Shape: (N,)

    return distances

def get_image_path(directory, index):
    """
    Get the image path based on the directory and index.

    Args:
        directory (str): Directory path where the images are located.
        index (int): Index of the image.

    Returns:
        str: Image path.
    """
    files = os.listdir(directory)
    image_files = [file for file in files if file.endswith('.jpg') or file.endswith('.png')]
    if index < 0 or index >= len(image_files):
        return None
    filename = image_files[index]
    return filename