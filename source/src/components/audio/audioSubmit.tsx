'use client'

import '../../styles/global.css'
import { AlbumData, ResultData } from './types';
import AudioPlayCard from './audioPlayCard';
import React, { useEffect, useState } from 'react';
import { fetchMapperData } from 'src/services/api';

const AudioSubmit = () => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [result, setResult] = useState<ResultData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [albumData, setAlbumData] = useState<AlbumData[]>([]);

    useEffect(() => {
        const fetchAlbumData = async () => {
          try {
            const data = await fetchMapperData();
            setAlbumData(data);
          } catch (error) {
            console.error('Error fetching album data:', error);
          }
        };
    
        fetchAlbumData();
      }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          setAudioFile(e.target.files[0]);
        }
      };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
    
        if (!audioFile) {
          alert("Please select a file.");
          return;
        }
    
        const formData = new FormData();
        formData.append("file", audioFile);
    
        try {
          const response = await fetch("http://localhost:8000/upload_file/", {
            method: "POST",
            body: formData,
          });
    
          const data = await response.json();
          setResult(data);
        } catch (error) {
          console.error("Error:", error);
        }
    
        try {
          const nameFile = audioFile.name;
          console.log("Sending file name:", nameFile);
        
          const response2 = await fetch("http://localhost:8000/compare/audio/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ features: nameFile }),
          });
        
          if (!response2.ok) {
            const errorData = await response2.text();
            throw new Error(`HTTP error! status: ${response2.status}, message: ${errorData}`);
          }
        
          const data2 = await response2.json();
          console.log("Response data:", data2);
          setResult(data2);
        } catch (error) {
          console.error("Detailed error:", error);
        } finally {
          setIsLoading(false);
        }
      }; 

    const matchAlbum = result
        ? albumData.find((album) => album.audio === result.namafile)
        : null;

    return (
        <div className="flex flex-col items-center">
        <div className="flex flex-col justify-center items-center my-10">
            {result && matchAlbum && (
                <div className="bg-slate-600 bg-opacity-60 border-2 border-black text-white rounded-md p-6 max-w-xs w-full">
                    <AudioPlayCard album={matchAlbum} score={result.score}/>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-center">
                    <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="border border-gray-300 rounded-md p-6 w-full max-w-xs"
                    />
                </div>
                <div className="flex justify-center">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-slate-600 bg-opacity-60 border-2 my-10 border-black text-white font-semibold py-2 px-4 rounded-md w-full max-w-xs hover:bg-transparent hover:border-2 transition duration-200 disabled:opacity-50"
                    >
                    {isLoading ? 'Processing...' : 'Upload File'}
                    </button>
                </div>
            </form>
            
        </div>
    </div>
    );
};

export default AudioSubmit;