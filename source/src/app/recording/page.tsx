"use client";
import React, { useState, useRef } from "react";
import "../../styles/global.css";
import { ResultData, AlbumData } from "src/components/audio/types";
import AudioPlayCard from "src/components/audio/audioPlayCard";

const RecordingPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [result, setResult] = useState<ResultData>({ album: [], time: 0, len: 0, result: 0});
  const [albumData, setAlbumData] = useState<AlbumData[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioChunksRef = useRef<Float32Array[]>([]);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      console.log("Stream acquired:", stream);

      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
      
      processor.onaudioprocess = (e) => {
        const channelData = e.inputBuffer.getChannelData(0);
        audioChunksRef.current.push(new Float32Array(channelData));
      };

      console.log("Recording started");
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (audioContextRef.current && audioChunksRef.current.length > 0) {
      // Clean up audio processing
      if (processorRef.current) {
        processorRef.current.disconnect();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const sampleRate = audioContextRef.current.sampleRate;
      const numChannels = 1;
      
      // Concatenate all audio chunks
      const length = audioChunksRef.current.reduce((acc, curr) => acc + curr.length, 0);
      const audioData = new Float32Array(length);
      let offset = 0;
      audioChunksRef.current.forEach(chunk => {
        audioData.set(chunk, offset);
        offset += chunk.length;
      });

      // Create WAV file
      const buffer = new ArrayBuffer(44 + audioData.length * 2);
      const view = new DataView(buffer);

      // Write WAV header
      const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(view, 0, 'RIFF');
      view.setUint32(4, 36 + audioData.length * 2, true);
      writeString(view, 8, 'WAVE');
      writeString(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, numChannels * 2, true);
      view.setUint16(34, 16, true);
      writeString(view, 36, 'data');
      view.setUint32(40, audioData.length * 2, true);

      // Write audio data
      const volume = 0.8;
      for (let i = 0; i < audioData.length; i++) {
        const sample = Math.max(-1, Math.min(1, audioData[i]));
        view.setInt16(44 + i * 2, sample * 0x7FFF * volume, true);
      }

      const blob = new Blob([buffer], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);
      setAudioURL(audioUrl);
      
      // Reset recording state
      audioChunksRef.current = [];
      setIsRecording(false);
      console.log("Recording stopped and WAV file created");
    }
  };

  const downloadRecording = async () => {
    if (audioURL) {
      const audioBlob = await fetch(audioURL).then(response => response.blob());
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");

      try {
        const response = await fetch("http://localhost:8000/upload_file/", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("File upload failed");
        }

        const data = await response.json();
        console.log("Upload successful:", data);
      } catch (error) {
        console.error("Error uploading file:", error);
      }

      try {

        const namaFileRecord = "recording.wav";
        console.log("Sending file name:", namaFileRecord);

        const responseRecord = await fetch("http://localhost:8000/compare/audio/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ features: namaFileRecord }),
        });
    
        if (!responseRecord.ok) {
            const errorData = await responseRecord.text();
            throw new Error(`HTTP error! status: ${responseRecord.status}, message: ${errorData}`);
        }
    
        const dataRecord: ResultData = await responseRecord.json();
        console.log("Response data:", dataRecord);
        setResult(dataRecord);

      } catch (error) {
        console.error("Detailed error:", error);
      }



    } else {
      console.error("No audio to upload");
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-5">
    <div className="flex flex-col w-full gap-5 justify-center py-4 items-center border border-white rounded-xl">
      <h1 className="text-3xl font-bold mb-6">Recording Page</h1>
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
                            </li>
                        );
                    })}
                  </ul>
                </div>
            )}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-6 py-2 rounded-lg font-semibold text-white ${
          isRecording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioURL && (
        <div className="mt-6 flex flex-col items-center">
          <audio src={audioURL} controls className="mb-4" />
          <button
            onClick={downloadRecording}
            className="px-6 py-2 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600"
          >
            Upload Recording
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default RecordingPage;