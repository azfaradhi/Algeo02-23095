import os
import sys
import numpy as np
from PIL import Image

def rgb_to_grayscale(image):
    if image.mode != 'RGB':
        image = image.convert('RGB')
    img_array = np.array(image)

    r_channel = img_array[:,:,0]
    g_channel = img_array[:,:,1]
    b_channel = img_array[:,:,2]
    
    grayscale_array = (
        0.2989 * r_channel + 
        0.5870 * g_channel + 
        0.1140 * b_channel
    ).astype(np.uint8)
    
    return Image.fromarray(grayscale_array)

def resize_image(grayscale_img, target_size=(64, 64)):
    return grayscale_img.resize(target_size, Image.LANCZOS)

def image_to_1d_vector(resized_grayscale_img):

    image_array = np.array(resized_grayscale_img)
    return image_array.flatten()

def process_images(input_dir, target_size=(64, 64)):
    image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff']
    
    if not os.path.exists(input_dir):
        print(f"ERROR: Input directory {input_dir} does not exist!")
        return
    
    input_files = os.listdir(input_dir)
    
    image_vectors = []
    
    for filename in input_files:
        if any(filename.lower().endswith(ext) for ext in image_extensions):
            input_path = os.path.join(input_dir, filename)
            
            try:
                with Image.open(input_path) as img:

                    grayscale_img = rgb_to_grayscale(img)
                    
                    resized_grayscale_img = resize_image(grayscale_img, target_size)
                    
                    grayscale_array = np.array(resized_grayscale_img)
                    image_vector = image_to_1d_vector(grayscale_array)
                    
                    image_vectors.append(image_vector)
            
            except Exception as e:
                print(f"Error processing {filename}: {e}")
    
    image_vectors = np.array(image_vectors)
    
    return image_vectors

def process_single_image(image_path, target_size=(64, 64)):
    with Image.open(image_path) as img:
        grayscale_img = rgb_to_grayscale(img)
        resized_grayscale_img = resize_image(grayscale_img, target_size)
        image_vector = image_to_1d_vector(resized_grayscale_img)
        return image_vector