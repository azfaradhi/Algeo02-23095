'use client';

import { useEffect, useState } from "react";
import Header from "src/components/header";
import AudioSubmit from "src/components/audio/audioSubmit";
import "../../styles/global.css"
import AudioCard from "src/components/audio/audioCard";
import { fetchFilesFromDataset, fetchMapperData } from '../../services/api';
import RecordingPage from "../recording/page";


type AlbumData = {
  audio: string;
  image: string;
  songName: string;
  artist: string;
};

export default function AudioPage() {
  const [albumData, setAlbumData] = useState<AlbumData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = albumData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(albumData.length / itemsPerPage);

  return (
      <div
        className="flex flex-col bg-cover bg-fixed bg-center min-h-screen w-full"
        style={{backgroundImage: "url('background.png')"}}
      >
        <div className="py-10"> 
          <Header />
        </div>
        <div className="flex w-full  mx-2 justify-center pb-10">
          {/* handle submit and show match album */}
          <div className="w-5/12 text-center mt-12"> 
            <div className="mb-4">
              <AudioSubmit/>  
            </div>

            <div className="mt-10">
              <RecordingPage />
            </div>
          </div>

          {/* list of database */}
          <div className="text-center w-7/12 mx-5">
          <h2 className="font-bold text-[32px]">Album List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
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
          </div>
        </div>
  
  );
}