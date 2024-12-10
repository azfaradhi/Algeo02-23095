from fastapi import FastAPI,File,UploadFile, HTTPException
from fastapi.responses import JSONResponse
import shutil
from pydantic import BaseModel
from music_information.final_audio import compare_file_with_database
from fastapi.middleware.cors import CORSMiddleware
import os, json


app = FastAPI()

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
    
@app.get("/mapper")
async def get_mapper():
    try:
        # Define the path to the mapper.json file
        current_dir = os.path.dirname(os.getcwdb().decode('utf-8'))  # Decode bytes to string
        json_path = os.path.join(current_dir, 'dataset', 'mapper.json')
        # Read the JSON file
        with open(json_path, 'r') as f:
            data = json.load(f)
        return JSONResponse(content=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read mapper.json: {str(e)}")
