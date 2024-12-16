import os
import time
import uuid
import numpy as np
import logging
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import shutil
from pydantic import BaseModel
from music_information.final_audio import compare_file_with_database
from music_information.final_audio import clear_cache
from fastapi.middleware.cors import CORSMiddleware
import os, json, zipfile, rarfile
from fastapi.staticfiles import StaticFiles
from pca.final_image import compare_image_with_dataset, clear_image_cache
from fastapi import Body
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles



app = FastAPI()
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public/dataset')
# Mounting the folder where images are stored so they can be accessed via HTTP

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)




@app.post("/upload_file/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Ensure the 'uploads' folder exists
        file_location = f"./uploads/{file.filename}"
        os.makedirs(os.path.dirname(file_location), exist_ok=True)

        # Open the file in binary mode and save
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Log the size and confirm the file is saved correctly
        file_size = os.path.getsize(file_location)
        print(f"File {file.filename} uploaded with size {file_size} bytes.")
        
        return JSONResponse(content={"message": "File uploaded successfully", "filename": file.filename})
    
    except Exception as e:
        return JSONResponse(content={"message": str(e)}, status_code=500)


class AudioFeatures(BaseModel):
    features: str

@app.post("/compare/audio/")
async def compare_audio(audio: AudioFeatures):
    try:
        result = compare_file_with_database(audio.features)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(content={"message": str(e)}, status_code=500)
    
@app.get("/mapper")
async def get_mapper():
    try:
        json_path = os.path.join(UPLOAD_DIR, 'mapper.json')

        with open(json_path, 'r') as f:
            data = json.load(f)
        return JSONResponse(content=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read mapper.json: {str(e)}")

@app.get("/dataset")
async def get_files():
    try:
        files = os.listdir(os.path.join(UPLOAD_DIR, 'test_audio'))
        album_data = [{'audio': file, 'image': 'No Image', 'songName': file, 'artist': 'unknown'} for file in files]
        return JSONResponse(content=album_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read dataset: {str(e)}")

@app.post("/upload_image")
async def upload_image(file: UploadFile = File(...)):
    if file.filename.endswith('.png') or file.filename.endswith('.jpg') or file.filename.endswith('.jpeg'):
        return await save_file(file, "test_image")
    return await save_zipfile(file, "test_image")

@app.post("/upload_audio")
async def upload_audio(file: UploadFile = File(...)):
    if file.filename.endswith('.mid') or file.filename.endswith('.wav'):
        return await save_file(file, "test_audio")
    return await save_zipfile(file, "test_audio")

@app.post("/upload_mapper")
async def upload_mapper(file: UploadFile = File(...)):
    return await save_file(file, "")


async def save_file(file: UploadFile, subdir: str):
    try:
        os.makedirs(os.path.join(UPLOAD_DIR, subdir), exist_ok=True)
        file_path = os.path.join(UPLOAD_DIR, subdir, file.filename)
        
        with open(file_path, "wb") as f:
            f.write(await file.read())
        clear_cache()
        return JSONResponse(content={"message": "File uploaded successfully", "filename": file.filename})
    except Exception as e:
        return JSONResponse(content={"message": str(e)}, status_code=500)


async def save_zipfile(file: UploadFile, subdir: str):
    try:
        temp_file_location = os.path.join(UPLOAD_DIR,file.filename)
        with open(temp_file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        if file.filename.endswith('.zip'):
            with zipfile.ZipFile(temp_file_location, 'r') as zip_ref:
                for member in zip_ref.namelist():
                    if not member.startswith('__MACOSX/'):
                        zip_ref.extract(member, os.path.join(UPLOAD_DIR, subdir))

        elif file.filename.endswith('.rar'):
            with rarfile.RarFile(temp_file_location, 'r') as rar_ref:
                for member in rar_ref.namelist():
                    if not member.startswith('__MACOSX/'):
                        rar_ref.extract(member, os.path.join(UPLOAD_DIR, subdir))
                        
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        os.remove(temp_file_location)
        clear_cache()
        return JSONResponse(content={"message": "File uploaded successfully", "filename": file.filename})
    except Exception as e:
        return JSONResponse(content={"message": str(e)}, status_code=500)


@app.post("/upload/image/")
async def upload_image(file: UploadFile = File(...)):
    """
    Mengunggah file gambar dan menyimpannya di folder dataset.
    """
    print("Uploading image...")
    try:
        file_location = f"../public/dataset/test_image/{file.filename}"
        os.makedirs(os.path.dirname(file_location), exist_ok=True)
        print(f"File path: {file.filename}")

        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {"message": f"File {file.filename} berhasil diunggah ke dataset."}
    except Exception as e:
        logging.error(f"Error uploading image: {e}")
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat mengunggah gambar: {e}")

class CompareImageRequest(BaseModel):
    features: str  # expects the image filename to compare

@app.post("/compare/image/")
async def compare_image(request: CompareImageRequest):
    """
    Membandingkan gambar yang diunggah dengan dataset yang ada.
    """
    start_time = time.time()
    print("Comparing image...TIME STARTED")
    uploaded_image_name = request.features
    
    # Gunakan path yang konsisten dengan upload_image
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_folder = os.path.abspath(os.path.join(current_dir, "..", "..", "source", "public", "dataset","test_image"))
    dataset_path = os.path.join(dataset_folder, uploaded_image_name)
    
    logging.info(f"Current Directory: {current_dir}")
    logging.info(f"Dataset Folder: {dataset_folder}")
    logging.info(f"Dataset Path: {dataset_path}")

    # Validasi keberadaan file di folder dataset
    if not os.path.exists(dataset_path):
        logging.error(f"Gambar {uploaded_image_name} tidak ditemukan di dataset.")
        raise HTTPException(status_code=404, detail=f"Gambar {uploaded_image_name} tidak ditemukan di dataset.")

    try:
        # Pastikan path yang digunakan valid dan sesuai
        logging.info(f"Membandingkan gambar {uploaded_image_name} dengan dataset...")

        # Cek file yang ditemukan
        logging.info(f"Dataset folder: {dataset_folder}")
        logging.info(f"Path gambar: {dataset_path}")
        
        results = compare_image_with_dataset(uploaded_image_name)
        logging.info(f"Hasil perbandingan: {results}")

        # Hitung waktu eksekusi
        execution_time = time.time() - start_time

        return {
            "message": "Perbandingan selesai.", 
            "results": results,
            "execution_time": round(execution_time, 4)  # Rounded to 4 decimal places
        }
    
    except Exception as e:
        # Log error secara rinci
        logging.error(f"Error dalam /compare/image/: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Kesalahan saat membandingkan gambar: {e}")

@app.get("/dataset/images/")
async def get_dataset_images():
    dataset_path = "../public/dataset/test_image"
    image_files = [f for f in os.listdir(dataset_path) if f.endswith(('.png', '.jpg', '.jpeg'))]
    return [{"filename": filename} for filename in image_files]

@app.delete("/delete_dataset")
async def delete_dataset():
    try:
        audio_path = os.path.join(UPLOAD_DIR, "test_audio")
        image_path = os.path.join(UPLOAD_DIR, "test_image")
        mapper_path = os.path.join(UPLOAD_DIR, "mapper.json")
        
        if os.path.exists(audio_path):
            shutil.rmtree(audio_path)
        if os.path.exists(image_path):
            shutil.rmtree(image_path)
        if os.path.exists(mapper_path):
            os.remove(mapper_path)
            
        os.makedirs(audio_path, exist_ok=True)
        os.makedirs(image_path, exist_ok=True)
        
        clear_cache()
        clear_image_cache()

        return {"message": "Dataset berhasil dihapus."}
    except Exception as e:
        return JSONResponse(content={"message": str(e)}, status_code=500)