'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, File, CheckCircle2 } from "lucide-react";
import "../../styles/global.css"
import Header from 'src/components/header';

export default function UploadPage() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [mapperFile, setMapperFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    images: boolean,
    audio: boolean,
    mapper: boolean
  }>({
    images: false,
    audio: false,
    mapper: false
  });

  const handleFileUpload = async (file: File, endpoint: string, type: 'images' | 'audio' | 'mapper') => {
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
      console.log(`${type} file uploaded successfully:`, data);
      
      // Update upload status
      setUploadStatus(prev => ({
        ...prev,
        [type]: true
      }));
      
      return true;
    } catch (error) {
      console.error(`Error uploading ${type} file:`, error);
      return false;
    }
  };

  const handleSubmit = async () => {
    try {
      let imageUploadPromises: Promise<boolean>[] = [];
      let audioUploadPromises: Promise<boolean>[] = [];
      let mapperUploadPromise: Promise<boolean> | null = null;

      if (imageFiles.length > 0) {
        imageUploadPromises = imageFiles.map(file => 
          handleFileUpload(file, "http://localhost:8000/upload_image", 'images')
        );
      }

      if (audioFiles.length > 0) {
        audioUploadPromises = audioFiles.map(file => 
          handleFileUpload(file, "http://localhost:8000/upload_audio", 'audio')
        );
      }

      if (mapperFile) {
        mapperUploadPromise = handleFileUpload(mapperFile, "http://localhost:8000/upload_mapper", 'mapper');
      }

      // Wait for all uploads to complete
      await Promise.all([
        ...imageUploadPromises, 
        ...audioUploadPromises, 
        ...(mapperUploadPromise ? [mapperUploadPromise] : [])
      ]);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFiles: React.Dispatch<React.SetStateAction<File[]>>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const FileUploadSection = ({ 
    title, 
    accept, 
    multiple = false, 
    files, 
    setFiles,
    type 
  }: { 
    title: string, 
    accept: string, 
    multiple?: boolean, 
    files: File[], 
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    type: 'images' | 'audio' | 'mapper'
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col border-2 border-gray-500 bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-6 w-full max-w-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl text-white flex items-center">
            <Upload className="mr-4 text-white" />
            {title}
          </h2>
          {uploadStatus[type] && <CheckCircle2 className="text-green-500" />}
        </div>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileChange(e, setFiles)}
          className="block w-full text-sm text-gray-500 
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-white/20 file:text-white
            hover:file:bg-white/30"
        />
        {files.length > 0 && (
          <div className="mt-4 text-white">
            {files.map((file, index) => (
              <div key={index} className="flex items-center">
                <File className="mr-2 text-gray-400" />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center flex flex-col" 
      style={{ backgroundImage: "url('background.png')" }}
    >
      <div className="py-5">
        <Header />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow flex flex-col items-center justify-center px-4"
      >
        <h1 className="font-bold text-[50px] text-white mb-10 text-center">
          Upload Dataset
        </h1>

        <div className="w-full max-w-xl space-y-6">
          <FileUploadSection
            title="Upload Image"
            accept=".zip,.png,.jpg,.jpeg,.bmp,.gif,.tiff"
            multiple
            files={imageFiles}
            setFiles={setImageFiles}
            type="images"
          />

          <FileUploadSection
            title="Upload Audio"
            accept=".mid,.zip,.wav"
            multiple
            files={audioFiles}
            setFiles={setAudioFiles}
            type="audio"
          />

          <FileUploadSection
            title="Upload Mapper"
            accept=".json"
            files={mapperFile ? [mapperFile] : []}
            setFiles={(files) => {
              const file = files[0];
              setMapperFile(file || null);
            }}
            type="mapper"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="w-full bg-black/30 backdrop-blur-sm border-2 border-gray-500 text-white rounded-2xl p-4 text-2xl transition-all duration-300 hover:bg-black/40"
          >
            Submit
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}