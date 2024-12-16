'use client';
import { useState } from "react";
import "../../styles/global.css"
import Header from 'src/components/header';

export default function UploadPage() {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [audioFiles, setAudioFiles] = useState<File[]>([]);
    const [mapperFile, setMapperFile] = useState<File | null>(null);


    const handleFileUpload = async (files: File[], endpoint: string) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));


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
        if (imageFiles.length > 0) {
            await handleFileUpload(imageFiles, "http://localhost:8000/upload_image");
        }
        if (audioFiles.length > 0 ) {
            await handleFileUpload(audioFiles, "http://localhost:8000/upload_audio");
        }
        if (mapperFile) {
            await handleFileUpload([mapperFile], "http://localhost:8000/upload_mapper");
        }
    } catch (error) {
        console.error("Error uploading file:", error);
    }
  };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFiles: React.Dispatch<React.SetStateAction<File[]>>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(Array.from(e.target.files));
        }
    };

  return (
    <div className="h-screen bg-cover bg-fixed bg-center" style={{ backgroundImage: "url('background.png')" }}>
        <div className="py-5">
            <Header/>
        </div>
      <div className="flex flex-col w-full justify-between gap-5 text-center items-center">
        <h1 className="font-bold text-[50px] justify-center">Upload Dataset</h1>
        <div className="flex flex-col border-2 border-black rounded-xl p-5">
        <h2 className="text-3xl pb-5">Upload Image</h2>
          <input
            type="file"
            accept=".zip,.rar,.7z,.tar,.gz"
            multiple
            onChange={(e) => handleFileChange(e, setImageFiles)}
          />
        </div>
        <div className="flex flex-col border-2 border-black rounded-xl p-5">
        <h2 className="text-3xl pb-5">Upload Audio</h2>
          <input
            type="file"
            accept=".mid,.zip,.rar,.7z,.tar,.gz,.wav"
            multiple
            onChange={(e) => handleFileChange(e, setAudioFiles)}
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