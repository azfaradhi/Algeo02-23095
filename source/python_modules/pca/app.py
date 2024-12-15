from flask import Flask, request, render_template, redirect, url_for
from werkzeug.utils import secure_filename
import os
import time
import numpy as np
from PIL import Image
from image_processing import process_single_image
from data_centering import standardize_data, standardized_single_image
from svd import pca_svd_direct, svd_single_image
from similarity_comp import euclidean_distance_batch

# Flask app initialization
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['DATASET_FOLDER'] = 'static/datasets'

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def load_dataset_vectors():
    """
    Load and process dataset images into 1D vectors.
    """
    dataset_folder = app.config['DATASET_FOLDER']
    file_names = sorted([
        filename for filename in os.listdir(dataset_folder)
        if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff'))
    ])

    dataset_vectors = []
    for filename in file_names:
        file_path = os.path.join(dataset_folder, filename)
        vector = process_single_image(file_path, target_size=(224, 224))
        dataset_vectors.append(vector)

    return np.array(dataset_vectors), file_names

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Handle image upload
        if 'query_image' not in request.files:
            return "No file part"
        
        file = request.files['query_image']
        if file.filename == '':
            return "No selected file"
        
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            return redirect(url_for('results', query_image=filename))
    return '''
        <!doctype html>
        <title>Image Similarity Search</title>
        <h1>Upload an Image</h1>
        <form method=post enctype=multipart/form-data>
            <input type=file name=query_image>
            <input type=submit value=Upload>
        </form>
    '''

@app.route('/results/<query_image>')
def results(query_image):
    # Load dataset vectors (without the query image yet)
    dataset_vectors, dataset_files = load_dataset_vectors()

    # Path to query image
    query_path = os.path.join(app.config['UPLOAD_FOLDER'], query_image)

    # Process query image (not part of the dataset yet)
    query_vector = process_single_image(query_path, target_size=(224, 224))

    # Standardize dataset and query
    standardized_dataset, mean_vector = standardize_data(dataset_vectors)
    standardized_query = standardized_single_image(query_vector, mean_vector)

    # Perform PCA using SVD
    start_time = time.time()
    k = 50  # Number of principal components
    reduced_dataset, Uk = pca_svd_direct(standardized_dataset, k)
    reduced_query = svd_single_image(standardized_query, Uk)

    # Compute similarities
    distances = euclidean_distance_batch(reduced_query, reduced_dataset)
    similarity_percentages = 100 * (1 - distances / np.max(distances))

    # Sort results by similarity
    sorted_indices = np.argsort(similarity_percentages)[::-1]
    sorted_files = [dataset_files[i] for i in sorted_indices]
    sorted_similarities = similarity_percentages[sorted_indices]

    # Calculate processing time
    end_time = time.time()
    processing_time = end_time - start_time

    # Add query image to dataset after processing
    query_dataset_path = os.path.join(app.config['DATASET_FOLDER'], query_image)
    if not os.path.exists(query_dataset_path):  # Avoid duplication
        os.rename(query_path, query_dataset_path)  # Move the query image to dataset folder

    # Prepare results
    results = [
        {'filename': sorted_files[i], 'similarity': sorted_similarities[i]}
        for i in range(len(sorted_files))
    ]

    return render_template('results.html', query_image=query_image, results=results, processing_time=processing_time)

if __name__ == '__main__':
    app.run(debug=True)
