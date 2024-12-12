import os
from final_image import compare_image_with_dataset

def main():
    """
    Program utama untuk menguji fungsi compare_image_with_dataset di terminal.
    """
    # Pastikan folder dataset tersedia
    dataset_folder = '../image_dataset'
    if not os.path.exists(dataset_folder):
        print(f"Folder dataset '{dataset_folder}' tidak ditemukan. Harap buat folder dan tambahkan gambar dataset.")
        return

    # Input nama file gambar dari pengguna
    uploaded_image = input("Masukkan nama file gambar yang ingin diuji (dalam folder 'image_dataset'): ")

    # Cek apakah file ada di folder dataset
    uploaded_image_path = os.path.join(dataset_folder, uploaded_image)
    if not os.path.exists(uploaded_image_path):
        print(f"File '{uploaded_image}' tidak ditemukan dalam folder '{dataset_folder}'.")
        return

    # Jalankan fungsi untuk membandingkan gambar
    try:
        results = compare_image_with_dataset(uploaded_image)
        print("\nHasil Pencocokan Gambar (diurutkan berdasarkan skor kemiripan):")
        for i, result in enumerate(results):
            print(f"{i + 1}. Gambar: {result['namafile']}, Skor Kemiripan: {result['score'] * 100:.2f}%")
    except Exception as e:
        print(f"Terjadi kesalahan saat memproses gambar: {e}")

if __name__ == "__main__":
    main()
