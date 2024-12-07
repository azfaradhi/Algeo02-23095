from fastapi import FastAPI,File,UploadFile
from fastapi.responses import JSONResponse
import shutil
from pydantic import BaseModel
from music_information.final_audio import compare_file_with_database
from fastapi.middleware.cors import CORSMiddleware


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