import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ResultData = {
  namafile: string;
  score: number;
};

type ImageComparisonResultsProps = {
  results?: ResultData[] | null;
};

const ImageComparisonResults: React.FC<ImageComparisonResultsProps> = ({ 
  results = [] 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // 6 items per page

  // Prepare results (top 10 sorted by score)
  const processedResults = useMemo(() => {
    return (results || [])
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [results]);

  // Pagination calculations
  const paginationData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    const currentItems = processedResults.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(processedResults.length / itemsPerPage);

    return {
      currentItems,
      totalPages,
      totalResults: processedResults.length
    };
  }, [processedResults, currentPage]);

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < paginationData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // If no results at all
  if (!results || results.length === 0) {
    return (
      <div className="text-white text-center mb-4 bg-slate-600 bg-opacity-60 p-4 rounded-md">
        No matching images found.
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-white text-center mb-4 bg-slate-600 bg-opacity-60 p-4 rounded-md">
        Top {Math.min(processedResults.length, 10)} closest matches
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {paginationData.currentItems.map((result) => (
          <div
            key={result.namafile}
            className="bg-slate-600 bg-opacity-60 border-2 border-black text-white rounded-md p-4"
          >
            <div className="mb-2">
              <img
                src={`/dataset/image_datasets/${result.namafile}`}
                alt={result.namafile}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <div className="text-sm">
                <p className="truncate">
                  <span className="font-semibold">File:</span> {result.namafile}
                </p>
                <p>
                  <span className="font-semibold">Similarity:</span>{' '}
                  {(result.score * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {paginationData.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
            className="bg-slate-600 bg-opacity-60 p-2 rounded-md disabled:opacity-50"
          >
            <ChevronLeft className="text-white" />
          </button>
          <span className="text-white">
            Page {currentPage} of {paginationData.totalPages}
          </span>
          <button 
            onClick={nextPage} 
            disabled={currentPage === paginationData.totalPages}
            className="bg-slate-600 bg-opacity-60 p-2 rounded-md disabled:opacity-50"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageComparisonResults;