from data_centering import *
from image_processing import *
from svd import *
from similarity_comp import *
import os
import sys
import numpy as np
from PIL import Image

def main():
    # Determine the script's directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Define directories relative to the script location
    input_dir = os.path.join(script_dir, 'static', 'datasets')

    # Buat daftar nama file
    file_names = [
        filename for filename in os.listdir(input_dir) 
        if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff'))
    ]

    # Sortir nama file untuk memastikan konsistensi urutan
    # file_names.sort()

    print("Nama file dalam dataset:", file_names)
    # Process images
    # Using default target size of 224x224 (common in deep learning)
    array_of_1d=process_images(input_dir, target_size=(224, 224))
    #print(array_of_1d)

    standardized, total = standardize_data(array_of_1d)
    #print("len total", len(total))
    after_pca, Uk_return = pca_svd_direct(standardized, k=7)

    #print(after_pca)
    img_last = get_latest_image_path(input_dir)
    index_of_query_image = len(array_of_1d) - 1
    print("Gambar terakhir:", img_last)
    uji_pict = process_single_image(img_last, target_size=(224, 224))
    

    standardized_single = standardized_single_image(uji_pict, total)
    #print(len(standardized_single))
    final = svd_single_image(standardized_single, Uk_return)
    print("Vektor proyeksi gambar query:", final)
    print("Vektor proyeksi gambar dataset:", after_pca[index_of_query_image])
    distances = euclidean_distance_batch(final, after_pca)

    # Buat pasangan (jarak, indeks gambar)
    distance_with_index = list(enumerate(distances))

    # Urutkan berdasarkan jarak terkecil
    sorted_distances = sorted(distance_with_index, key=lambda x: x[1])

    # Ambil indeks dan jarak terurut
    sorted_indices = [item[0] for item in sorted_distances]
    sorted_distances_values = [item[1] for item in sorted_distances]

    # Cetak hasil
    print("Gambar paling mirip diurutkan berdasarkan jarak Euclidean:")
    for i, dist in zip(sorted_indices, sorted_distances_values):
        img_path = get_image_path(input_dir, i)
        print(f"Gambar {img_path} memiliki jarak Euclidean: {dist}")
    # Test the script
if __name__ == '__main__':
    main()
