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
from pca.final_image import compare_image_with_dataset
from fastapi import Body
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles



app = FastAPI()
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public/dataset')
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

@app.post("/upload_image")
async def upload_image(file: UploadFile = File(...)):
    return await save_zipfile(file, "image")

@app.post("/upload_audio")
async def upload_audio(file: UploadFile = File(...)):
    if file.filename.endswith('.mid'):
        return await save_file(file, "test_midi_dataset")
    return await save_zipfile(file, "test_midi_dataset")

@app.post("/upload_mapper")
async def upload_mapper(file: UploadFile = File(...)):
    return await save_file(file, "")


async def save_file(file: UploadFile, subdir: str):
    try:
        os.makedirs(os.path.join(UPLOAD_DIR, subdir), exist_ok=True)
        file_path = os.path.join(UPLOAD_DIR, subdir, file.filename)
        
        with open(file_path, "wb") as f:
            f.write(await file.read())
        return JSONResponse(content={"message": "File uploaded successfully", "filename": file.filename})
    except Exception as e:
        return JSONResponse(content={"message": str(e)}, status_code=500)


async def save_zipfile(file: UploadFile, subdir: str):
    try:
        temp_file_location = os.path.join(UPLOAD_DIR, file.filename)
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
    start_time = time.time()
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