import numpy as np
from PIL import Image

def standardize_data(array_vector1d):
    array_vector1d = np.array(array_vector1d)

    total = np.zeros(array_vector1d.shape[1])
    for i in range(len(array_vector1d)):
        for j in range(len(array_vector1d[i])):
            total[j] += array_vector1d[i][j]

    for j in range(len(total)):
        total[j] /= len(array_vector1d)

    total = np.array(total)
    result = array_vector1d - total
    return result, total

def standardized_single_image(image_vector, total):
    image_vector = np.array(image_vector)
    image_vector = image_vector - total
    return image_vector