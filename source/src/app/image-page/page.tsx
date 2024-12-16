'use client';
import { useState } from "react";
import Header from "src/components/header";
import ImageComparisonResults from "./ImageComparisonResults";
import DatasetBrowser from "./DatasetBrowser"; // Import the new component
import "../../styles/global.css";

type ResultData = {
  namafile: string;
  score: number;
};

type ImageComparisonResponse = {
  results: ResultData[];
  execution_time?: number;
};

export default function ImagePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [queryImageUrl, setQueryImageUrl] = useState<string | null>(null);
  const [results, setResults] = useState<ResultData[] | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImageFile(file);
      setQueryImageUrl(URL.createObjectURL(file)); // Preview URL
      setShowResults(false); // Reset results view
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setExecutionTime(null);

    if (!imageFile) {
      alert("Please select a file.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await fetch("http://localhost:8000/upload/image/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload success:", data);
    } catch (error) {
      console.error("Error:", error);
    }

    try {
      const nameFile = imageFile.name;
      console.log("Sending file name:", nameFile);

      const response2 = await fetch("http://localhost:8000/compare/image/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ features: nameFile }),
      });

      if (!response2.ok) {
        const errorData = await response2.text();
        throw new Error(
          `HTTP error! status: ${response2.status}, message: ${errorData}`
        );
      }

      const data2: ImageComparisonResponse = await response2.json();
      console.log("Response data:", data2);

      const filteredResults = data2.results
        .filter((result: ResultData) => result.namafile !== nameFile && result.score > 0)
        .sort((a: ResultData, b: ResultData) => b.score - a.score)
        .slice(0, 10);

      setResults(filteredResults);
      setShowResults(true);

      if (data2.execution_time) {
        setExecutionTime(data2.execution_time);
      }
    } catch (error) {
      console.error("Detailed error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-fixed bg-center"
      style={{ backgroundImage: "url('background.png')" }}
    >
      <div className="py-10">
        <Header />
      </div>

      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center my-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Upload Container */}
            <div className="flex flex-col items-center space-y-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="border border-gray-300 rounded-md p-6 w-full max-w-xs"
              />

              {/* Display Query Image */}
              {queryImageUrl && (
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-2">Query Image:</h3>
                  <img
                    src={queryImageUrl}
                    alt="Query Image"
                    className="border-2 border-gray-300 rounded-md max-w-sm mx-auto"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-slate-600 bg-opacity-60 border-2 my-10 border-black text-white font-semibold py-2 px-4 rounded-md w-full max-w-xs hover:bg-transparent hover:border-2 transition duration-200 disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Upload & Compare"}
              </button>
            </div>
          </form>
        </div>

        {/* Execution Time Display */}
        {executionTime !== null && showResults && (
          <div className="text-white text-center mb-4 bg-slate-600 bg-opacity-60 p-4 rounded-md">
            Execution Time: {executionTime} seconds
          </div>
        )}

        {/* Conditional Rendering: Dataset Browser or Results */}
        {showResults ? (
          results && (
            <div className="w-full max-w-4xl">
              <h3 className="text-white font-semibold mb-4 text-center">
                Comparison Results
              </h3>
              <ImageComparisonResults results={results} />
            </div>
          )
        ) : (
          <DatasetBrowser />
        )}
      </div>
    </div>
  );
}