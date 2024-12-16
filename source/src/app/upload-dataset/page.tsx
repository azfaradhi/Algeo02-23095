'use client';
import { useState } from "react";
import "../../styles/global.css"
import Header from 'src/components/header';

export default function UploadPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [mapperFile, setMapperFile] = useState<File | null>(null);


  const handleFileUpload = async (file: File, endpoint: string) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const data = await response.json();
      console.log("File uploaded successfully:", data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSubmit = async () => {
    try {
        if (imageFile) {
            await handleFileUpload(imageFile, "http://localhost:8000/upload_image");
        }
        if (audioFile) {
            await handleFileUpload(audioFile, "http://localhost:8000/upload_audio");
        }
        if (mapperFile) {
            await handleFileUpload(mapperFile, "http://localhost:8000/upload_mapper");
        }
    } catch (error) {
        console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="h-screen bg-cover bg-fixed bg-center" style={{ backgroundImage: "url('background.png')" }}>
        <div className="py-5">
            <Header/>
        </div>
      <div className="flex flex-col w-full justify-between gap-5 text-center items-center">
        <h1 className="font-bold text-[50px] justify-center">Uploader</h1>
        <div className="flex flex-col border-2 border-black rounded-xl p-5">
        <h2 className="text-3xl pb-5">Upload Image</h2>
          <input
            type="file"
            accept=".zip,.rar,.7z,.tar,.gz"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setImageFile(e.target.files[0]);
              }
            }}
          />
        </div>
        <div className="flex flex-col border-2 border-black rounded-xl p-5">
        <h2 className="text-3xl pb-5">Upload Audio</h2>
          <input
            type="file"
            accept=".mid,.zip,.rar,.7z,.tar,.gz,.wav"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setAudioFile(e.target.files[0]);
              }
            }}
          />
        </div>
        <div className="flex flex-col border-2 border-black rounded-xl p-5">
        <h2 className="text-3xl pb-5">Upload Mapper</h2>
          <input
            type="file"
            accept=".json"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setMapperFile(e.target.files[0]);
              }
            }}
          />
        </div>
        <button
            onClick={handleSubmit}
            className="bg-black text-white rounded-xl p-2 w-1/4"
        >
            Submit
        </button>
      </div>
    </div>
  );
}