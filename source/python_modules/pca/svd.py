import os
import sys
import numpy as np
from PIL import Image

def pca_svd_direct(standardized, k):
    """
    Perform PCA using SVD directly on the data without covariance matrix to save memory.

    Args:
        standardized (numpy.ndarray): Standardized data matrix (N_samples x N_features).
        k (int): Number of principal components to retain.

    Returns:
        Z (numpy.ndarray): Projected data in the principal component space.
    """
    # Perform SVD directly on the standardized data
    standardized = np.array(standardized)
    covariance = np.matmul(standardized.T ,standardized) / standardized.shape[0]

    U, s, Vt = np.linalg.svd(covariance, full_matrices=False)

    # Retain the top-k components
    Uk = Vt[:k].T  # Top-k eigenvectors
    Z = np.dot(standardized, Uk)  # Project data onto the principal components

    return Z, Uk

def svd_single_image(image_vector,  Uk):
    q = np.dot(image_vector, Uk)
    return q