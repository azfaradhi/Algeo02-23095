'use client'

import '../../styles/global.css'
import { AlbumData, ResultData } from './types';
import AudioPlayCard from './audioPlayCard';
import React, { useEffect, useState } from 'react';
import { fetchMapperData, fetchFilesFromDataset } from 'src/services/api';

const AudioSubmit = () => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [result, setResult] = useState<ResultData>({ album: [], time: 0, len: 0, result: 0});
    const [isLoading, setIsLoading] = useState(false);
    const [albumData, setAlbumData] = useState<AlbumData[]>([]);

    useEffect(() => {
        const fetchAlbumData = async () => {
          try {
            const data = await fetchMapperData();
            setAlbumData(data);
          } catch (error) {
            console.error('Error fetching album data:', error);
            try {
              const fallbackData = await fetchFilesFromDataset();
              setAlbumData(fallbackData);
            } catch (fallbackError) {
              console.error('Error fetching fallback album data:', fallbackError);
            }
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
        
          const data2: ResultData = await response2.json();
          console.log("Response data:", data2);
          console.log("Response data:", data2.len);
          setResult(data2);
        } catch (error) {
          console.error("Detailed error:", error);
        } finally {
          setIsLoading(false);
        }
      }; 

    // const matchAlbum = result
    //     ? albumData.find((album) => album.audio === result[0]?.namafile)
    //     : null;

    return (
        <div className="flex flex-col items-center w-full px-5">
        <div className="flex flex-col w-full gap-5 justify-center items-center border border-white rounded-xl">
            {result.len > 0 && (
              <div className='w-full px-5'>
                <h1 className='text-3xl pt-5'>Memproses {result.len} data dalam waktu {result.time.toFixed(2)} detik</h1>
                  <ul>
                    {result.album.map((item, index) => {
                        const matchAlbum = albumData.find((album) => album.audio === item.namafile);
                        return (
                            <li key={index}>
                                {matchAlbum && (
                                    <div className="mt-4">
                                        <AudioPlayCard album={matchAlbum} score={item.score} />
                                    </div>
                                )}
                                {!matchAlbum && (
                                    <div className="mt-4 flex w-full justify-between">
                                      <h2 className="text-xl">{item.namafile}</h2>
                                      <h2 className="text-xl">{(item.score * 100 ).toFixed(2)}%</h2>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                  </ul>
                </div>
            )}
            <form onSubmit={handleSubmit} className="">
                <div className="flex justify-center">
                    <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="border border-gray-300 rounded-md p-6 mt-5 w-full max-w-xs"
                    />
                </div>
                <div className="flex justify-center">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-slate-600 bg-opacity-60 border-2 my-5 border-black text-white font-semibold py-2 px-4 rounded-md w-full max-w-xs hover:bg-transparent hover:border-2 transition duration-200 disabled:opacity-50"
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