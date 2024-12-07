import os
import sys
import numpy as np
from PIL import Image

def rgb_to_grayscale(image):
    """
    Convert RGB image to grayscale using the weighted method:
    I(x,y) = 0.2989 * R(x,y) + 0.5870 * G(x,y) + 0.1140 * B(x,y)
    
    Args:
    image (PIL.Image): Input RGB image
    
    Returns:
    PIL.Image: Grayscale image
    """
    # Ensure image is in RGB mode
    
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Convert image to numpy array
    img_array = np.array(image)
    
    # Extract RGB channels
    r_channel = img_array[:,:,0]
    g_channel = img_array[:,:,1]
    b_channel = img_array[:,:,2]
    
    # Apply weighted conversion formula
    grayscale_array = (
        0.2989 * r_channel + 
        0.5870 * g_channel + 
        0.1140 * b_channel
    ).astype(np.uint8)
    
    # Convert back to PIL Image
    return Image.fromarray(grayscale_array)

def resize_image(grayscale_img, target_size=(224, 224)):
    """
    Resize image to a consistent size using PIL
    
    Args:
    image (PIL.Image): Input image
    target_size (tuple): Desired (width, height)
    
    Returns:
    PIL.Image: Resized image
    """
    return grayscale_img.resize(target_size, Image.LANCZOS)

def image_to_1d_vector(resized_grayscale_img):
    """
    Convert 2D image array to 1D vector
    
    Args:
    image_array (numpy.ndarray): 2D grayscale image array
    
    Returns:
    numpy.ndarray: 1D vector representation of the image
    """
    # Flatten the 2D array to 1D
    image_array = np.array(resized_grayscale_img)
    return image_array.flatten()

def process_images(input_dir, target_size=(224, 224)):
    """
    Process images: convert to grayscale, resize, and convert to 1D vector
    
    Args:
    input_dir (str): Path to input image directory
    target_size (tuple): Desired image size
    
    Returns:
    numpy.ndarray: Array containing 1D vectors of each image
    """
    # Supported image extensions
    image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff']
    
    # Check if input directory exists
    if not os.path.exists(input_dir):
        print(f"ERROR: Input directory {input_dir} does not exist!")
        return
    
    # List all files in the input directory
    input_files = os.listdir(input_dir)
    
    # Array to store 1D vectors
    image_vectors = []
    
    # Process each file in the input directory
    for filename in input_files:
        # Check if file is an image
        if any(filename.lower().endswith(ext) for ext in image_extensions):
            # Full path to input image
            input_path = os.path.join(input_dir, filename)
            
            try:
                # Open the image
                with Image.open(input_path) as img:
                    # Convert to grayscale
                    grayscale_img = rgb_to_grayscale(img)
                    
                    # Resize image
                    resized_grayscale_img = resize_image(grayscale_img, target_size)
                    
                    # Convert to numpy array and then to 1D vector
                    grayscale_array = np.array(resized_grayscale_img)
                    image_vector = image_to_1d_vector(grayscale_array)
                    
                    # Append the image vector to the array
                    image_vectors.append(image_vector)
            
            except Exception as e:
                print(f"Error processing {filename}: {e}")
    
    # Convert the array to numpy array
    image_vectors = np.array(image_vectors)
    
    return image_vectors

def process_single_image(image_path, target_size=(224, 224)):
    with Image.open(image_path) as img:
        # Convert to grayscale
        grayscale_img = rgb_to_grayscale(img)
        resized_grayscale_img = resize_image(grayscale_img, target_size)
        # Convert to numpy array and then to 1D vector
        image_vector = image_to_1d_vector(resized_grayscale_img)
        return image_vector