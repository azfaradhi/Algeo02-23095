'use client';
import { useState } from "react";
import "../../styles/global.css"
import Header from 'src/components/header';

export default function UploadPage() {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [audioFiles, setAudioFiles] = useState<File[]>([]);
    const [mapperFile, setMapperFile] = useState<File | null>(null);


    const handleFileUpload = async (file: File, endpoint: string) => {
        const formData = new FormData();
        formData.append("file", file)


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

    const deleteDataset = async () => {
        try {
            const response = await fetch("http://localhost:8000/delete_dataset", {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete dataset files");
            }

            const data = await response.json();
            console.log("Dataset files deleted successfully:", data);
        } catch (error) {
            console.error("Error deleting dataset files:", error);
        }
    };

  const handleSubmit = async () => {
    console.log(audioFiles);
    try {
        if (imageFiles.length > 0) {
            await Promise.all(imageFiles.map(async (file) => {
                await handleFileUpload(file, "http://localhost:8000/upload_image");
            }));
        }
        if (audioFiles.length > 0 ) {
            await Promise.all(audioFiles.map(async (file) => {
                await handleFileUpload(file, "http://localhost:8000/upload_audio");
            }));
        }
        if (mapperFile) {
            await handleFileUpload(mapperFile, "http://localhost:8000/upload_mapper");
        }
        alert("Files uploaded successfully!");
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
            accept=".zip,.png,.jpg,.jpeg,.bmp,.gif,.tiff"
            multiple
            onChange={(e) => handleFileChange(e, setImageFiles)}
          />
        </div>
        <div className="flex flex-col border-2 border-black rounded-xl p-5">
        <h2 className="text-3xl pb-5">Upload Audio</h2>
          <input
            type="file"
            accept=".mid,.zip,.wav"
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
        <button
            onClick={deleteDataset}
            className="bg-red-600 text-white rounded-xl p-2 w-1/4"
        >
            Delete Dataset Files
        </button>
      </div>
    </div>
  );
}