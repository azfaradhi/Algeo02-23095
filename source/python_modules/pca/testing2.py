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

    # Reduksi dimensi
    after_pca, Uk_return = pca_svd_direct(standardized, k=7)

    # Debugging hasil PCA
    print("\nDebugging hasil PCA:")
    for i, filename in enumerate(file_names):
        print(f"File: {filename} | PCA vector: {after_pca[i]}")

    # Debugging: tampilkan hasil vektor proyeksi dataset
    print("\n=== Vektor Proyeksi Dataset ===")
    for i, vector in enumerate(after_pca):
        print(f"File: {file_names[i]} | Proyeksi: {vector}")

    # Ambil gambar terakhir (query image)
    img_last = get_latest_image_path(input_dir)
    index_of_query_image = len(array_of_1d) - 1
    print("\nGambar terakhir (query image):", img_last)

    # Proses gambar query
    uji_pict = process_single_image(img_last, target_size=(224, 224))
    standardized_single = standardized_single_image(uji_pict, total)
    final = svd_single_image(standardized_single, Uk_return)

    # Debugging: tampilkan vektor proyeksi gambar query
    print("\n=== Vektor Proyeksi Gambar Query ===")
    print(f"Gambar Query: {img_last} | Proyeksi: {final}")

    # Hitung jarak Euclidean antara query image dan semua dataset
    distances = euclidean_distance_batch(final, after_pca)

    # Debugging: tampilkan jarak Euclidean
    print("\n=== Jarak Euclidean (Query vs Dataset) ===")
    for i, distance in enumerate(distances):
        print(f"File: {file_names[i]} | Jarak: {distance}")

    # Buat pasangan (jarak, indeks gambar)
    distance_with_index = list(enumerate(distances))

    # Urutkan berdasarkan jarak terkecil
    sorted_distances = sorted(distance_with_index, key=lambda x: x[1])

    # Ambil indeks dan jarak terurut
    sorted_indices = [item[0] for item in sorted_distances]
    sorted_distances_values = [item[1] for item in sorted_distances]

    # Debugging: hasil pengurutan
    print("\n=== Hasil Pengurutan Berdasarkan Jarak ===")
    for i, dist in zip(sorted_indices, sorted_distances_values):
        img_path = file_names[i]
        print(f"Gambar: {img_path} | Jarak Euclidean: {dist}")

if __name__ == '__main__':
    main()
