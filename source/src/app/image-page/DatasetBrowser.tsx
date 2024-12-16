import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type DatasetImage = {
  filename: string;
};

const DatasetBrowser: React.FC = () => {
  const [datasetImages, setDatasetImages] = useState<DatasetImage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchDatasetImages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/dataset/images/');
        if (!response.ok) {
          throw new Error('Failed to fetch dataset images');
        }
        const data = await response.json();
        setDatasetImages(data);
      } catch (error) {
        console.error('Error fetching dataset images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatasetImages();
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = datasetImages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(datasetImages.length / itemsPerPage);

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="text-white text-center mb-4 bg-slate-600 bg-opacity-60 p-4 rounded-md">
        Loading dataset...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-white text-center mb-4 bg-slate-600 bg-opacity-60 p-4 rounded-md">
        Dataset Images ({datasetImages.length} total)
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {currentItems.map((image) => (
          <div
            key={image.filename}
            className="bg-slate-600 bg-opacity-60 border-2 border-black text-white rounded-md p-4"
          >
            <div className="mb-2">
              <img
                src={`/dataset/test_image/${image.filename}`}
                alt={image.filename}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <div className="text-sm">
                <p className="truncate">
                  <span className="font-semibold">File:</span> {image.filename}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
            className="bg-slate-600 bg-opacity-60 p-2 rounded-md disabled:opacity-50"
          >
            <ChevronLeft className="text-white" />
          </button>
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
            className="bg-slate-600 bg-opacity-60 p-2 rounded-md disabled:opacity-50"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DatasetBrowser;