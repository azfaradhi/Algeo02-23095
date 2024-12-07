from data_centering import *
from image_processing import *
from svd import *
from similarity_comp import *
import os
import numpy as np
from PIL import Image

def main():
    # Tentukan direktori script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_dir = os.path.join(script_dir, 'static', 'datasets')

    # Urutkan file secara konsisten
    file_names = sorted([
        filename for filename in os.listdir(input_dir)
        if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff'))
    ])

    print("Nama file dalam dataset (diurutkan):", file_names)

    # Proses gambar
    file_vectors = {}
    for filename in file_names:
        file_path = os.path.join(input_dir, filename)
        processed_image = process_single_image(file_path, target_size=(224, 224))
        file_vectors[filename] = processed_image.flatten()

    # Cetak hasil proses
    print("\nDebugging hasil file dan vektor 1D:")
    for filename, vector in file_vectors.items():
        print(f"File: {filename} | 1d: {vector}")

    # Standarisasi data
    array_of_1d = np.array(list(file_vectors.values()))
    standardized, total = standardize_data(array_of_1d)

    # covariance = incremental_pca(standardized, 7, batch_size=100)
    # Reduksi dimensi
    after_pca, Uk_return = pca_svd_direct(standardized, k=7)

    # Debugging hasil PCA
    print("\nDebugging hasil PCA:")
    for i, filename in enumerate(file_names):
        print(f"File: {filename} | PCA vector: {after_pca[i]}")

if __name__ == '__main__':
    main()
