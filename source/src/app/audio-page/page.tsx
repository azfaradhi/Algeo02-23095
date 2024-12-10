// pages/audioPage.tsx
'use client';
import { error } from "console";
import { useEffect, useState } from "react";
import Header from "src/components/header";
import "../../styles/global.css"
import AudioCard from "src/components/audio/audioCard";
import { fetchMapperData } from '../../services/api';

// Define the type for your result
type ResultData = {
  namafile: string;
  score: number;
};

type AlbumData = {
  audio: string;
  image: string;
  songName: string;
  artist: string;
};

export default function AudioPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [albumData, setAlbumData] = useState<AlbumData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = albumData.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages
  const totalPages = Math.ceil(albumData.length / itemsPerPage);

  return (
    <div
      className="h-screen bg-cover bg-fixed bg-center"
      style={{backgroundImage: "url('background.png')"}}
    >
      <div className="py-10"> 
        <Header />
      </div>
      
      <div className="flex flex-col items-center">
        <div className="flex flex-col justify-center items-center my-10">
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
          <h2 className="font-bold text-[32px]">Album List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map((album, index) => (
              <AudioCard key={index} album={album} />
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 mx-1">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
          </div>

        {/* Result Display */}
        {result && matchAlbum && (
          <div className="bg-slate-600 bg-opacity-60 border-2 border-black text-white rounded-md p-6 max-w-xs w-full">
            <div className="mb-4">
              <span className="font-semibold">Matched File: </span>
              <span>{matchAlbum.songName}</span>
            </div>
            <div>
              <img src={`/midi_dataset/${matchAlbum.image}`} alt={matchAlbum.songName} width="100" />
            </div>
            <div>
              <span className="font-semibold">Similarity Score: </span>
              <span>{(result.score * 100).toFixed(2)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}