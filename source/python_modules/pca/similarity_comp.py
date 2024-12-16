import os
import numpy as np
from PIL import Image
from pca.image_processing import *

def get_latest_image_path(directory):
    files = os.listdir(directory)
    image_files = [file for file in files if file.endswith('.jpg') or file.endswith('.png')]
    if not image_files:
        return None
    latest_image = max(image_files, key=lambda x: os.path.getmtime(os.path.join(directory, x)))
    return os.path.join(directory, latest_image)

def euclidean_distance_batch(query_vector, dataset_vectors):
    differences = dataset_vectors - query_vector
    distances = np.sqrt(np.sum(differences**2, axis=1)) 

    return distances

def get_image_path(directory, index):
    files = os.listdir(directory)
    image_files = [file for file in files if file.endswith('.jpg') or file.endswith('.png') or file.endswith('.jpeg')]
    if index < 0 or index >= len(image_files):
        return None
    filename = image_files[index]
    return filename