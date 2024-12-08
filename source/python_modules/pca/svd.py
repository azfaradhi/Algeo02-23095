import os
import sys
import numpy as np
from PIL import Image

def pca_svd_direct(standardized, k):
    standardized = np.array(standardized)
    # covariance = np.matmul(standardized.T ,standardized) / standardized.shape[0]
    U, s, Vt = np.linalg.svd(standardized, full_matrices=False)
    Uk = Vt[:k].T  
    Z = np.dot(standardized, Uk) 

    return Z, Uk

def svd_single_image(image_vector,  Uk):
    q = np.dot(image_vector, Uk)
    return q