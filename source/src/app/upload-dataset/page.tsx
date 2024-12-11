'use client';
import { useState } from "react";
import "../../styles/global.css"

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

  return (
    <div className="h-screen bg-cover bg-fixed bg-center" style={{ backgroundImage: "url('background.png')" }}>
      <div className="flex flex-col w-full justify-between gap-5">
        <h1 className="font-bold text-[50px] justify-center">Uploader</h1>
        <div className="flex flex-col border-2 border-black rounded-xl">
          Upload Image
          <input
            type="file"
            accept=".zip,.rar,.7z,.tar,.gz"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setImageFile(e.target.files[0]);
                handleFileUpload(e.target.files[0], "http://localhost:8000/upload_image");
              }
            }}
          />
        </div>
        <div className="flex flex-col border-2 border-black rounded-xl">
          Upload Audio
          <input
            type="file"
            accept=".zip,.rar,.7z,.tar,.gz"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setAudioFile(e.target.files[0]);
                handleFileUpload(e.target.files[0], "http://localhost:8000/upload_audio");
              }
            }}
          />
        </div>
        <div className="flex flex-col border-2 border-black rounded-xl">
          Upload Mapper
          <input
            type="file"
            accept=".json"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setMapperFile(e.target.files[0]);
                handleFileUpload(e.target.files[0], "http://localhost:8000/upload_mapper");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}