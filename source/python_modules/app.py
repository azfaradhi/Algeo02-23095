import os
import time
import uuid
import numpy as np
import logging
from fastapi import FastAPI,File,UploadFile,HTTPException
from fastapi.responses import JSONResponse
import shutil
from pydantic import BaseModel
from music_information.final_audio import compare_file_with_database
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pca.final_image import compare_image_with_dataset
from fastapi import Body
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles



app = FastAPI()
# Mounting the folder where images are stored so they can be accessed via HTTP
app.mount("/image_dataset", StaticFiles(directory="image_dataset"), name="image_dataset")

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
        # Save the uploaded file
        file_location = f"./{file.filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

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

@app.post("/upload/image/")
async def upload_image(file: UploadFile = File(...)):
    """
    Mengunggah file gambar dan menyimpannya di folder dataset.
    """
    try:
        dataset_folder = os.path.join(os.getcwd(), "image_dataset")
        os.makedirs(dataset_folder, exist_ok=True)

        file_path = os.path.join(dataset_folder, file.filename)
        with open(file_path, "wb") as buffer:
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
    uploaded_image_name = request.features
    dataset_folder = os.path.join(os.getcwd(), "image_dataset")
    dataset_path = os.path.join(dataset_folder, uploaded_image_name)

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

        return {"message": "Perbandingan selesai.", "results": results}
    
    except Exception as e:
        # Log error secara rinci
        logging.error(f"Error dalam /compare/image/: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Kesalahan saat membandingkan gambar: {e}")