'use client';
import { error } from "console";
import { useEffect, useState } from "react";
import Header from "src/components/header";
import AudioSubmit from "src/components/audio/audioSubmit";
import "../../styles/global.css"
import AudioCard from "src/components/audio/audioCard";
import { fetchMapperData } from '../../services/api';

type AlbumData = {
  audio: string;
  image: string;
  songName: string;
  artist: string;
};

export default function AudioPage() {
  const [albumData, setAlbumData] = useState<AlbumData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = albumData.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages
  const totalPages = Math.ceil(albumData.length / itemsPerPage);

  return (
    <div
      className="flex flex-col h-screen bg-cover bg-fixed bg-center w-full"
      style={{backgroundImage: "url('background.png')"}}
    >
      <div className="py-10"> 
        <Header />
      </div>
      <div className="flex w-full">
        {/* handle submit and show match album */}
        <div className="w-2/5 text-center">
          <AudioSubmit/>
        </div>

        {/* list of database */}
        <div className="text-center w-3/5 mx-5">
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