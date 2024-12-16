"use client";
import React, { useState, useRef, useEffect } from "react";
import "../../styles/global.css";
import { ResultData } from "src/components/audio/types";

const RecordingPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [result, setResult] = useState<ResultData>({ album: [], time: 0, len: 0, result: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioChunksRef = useRef<Float32Array[]>([]);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const soundDetectedRef = useRef(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      audioSourceRef.current = source;
      source.connect(analyser);
      analyser.connect(processor);
      processor.connect(audioContextRef.current.destination);

      processor.onaudioprocess = (e) => {
        const channelData = e.inputBuffer.getChannelData(0);
        audioChunksRef.current.push(new Float32Array(channelData));

        // Sound detection logic
        const dataArray = new Uint8Array(analyser.fftSize);
        analyser.getByteFrequencyData(dataArray);

        const volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        if (volume > 10) {
          soundDetectedRef.current = true;
        }
      };

      setIsRecording(true);
      console.log("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (audioContextRef.current) {
      if (processorRef.current) {
        processorRef.current.disconnect();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const sampleRate = audioContextRef.current.sampleRate;
      const numChannels = 1;

      const length = audioChunksRef.current.reduce((acc, curr) => acc + curr.length, 0);
      const audioData = new Float32Array(length);
      let offset = 0;
      audioChunksRef.current.forEach((chunk) => {
        audioData.set(chunk, offset);
        offset += chunk.length;
      });

      const buffer = new ArrayBuffer(44 + audioData.length * 2);
      const view = new DataView(buffer);

      const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(view, 0, "RIFF");
      view.setUint32(4, 36 + audioData.length * 2, true);
      writeString(view, 8, "WAVE");
      writeString(view, 12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, numChannels * 2, true);
      view.setUint16(34, 16, true);
      writeString(view, 36, "data");
      view.setUint32(40, audioData.length * 2, true);

      const volume = 0.8;
      for (let i = 0; i < audioData.length; i++) {
        const sample = Math.max(-1, Math.min(1, audioData[i]));
        view.setInt16(44 + i * 2, sample * 0x7fff * volume, true);
      }

      const blob = new Blob([buffer], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(blob);
      setAudioURL(audioUrl);

      audioChunksRef.current = [];
      setIsRecording(false);
      console.log("Recording stopped and WAV file created");
      return blob;
    }
    return null;
  };

  const uploadRecording = async (audioBlob: Blob) => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");
      setIsLoading(true);

      try {
        // First upload the file
        const uploadResponse = await fetch("http://localhost:8000/upload_file/", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("File upload failed");
        }

        const uploadData = await uploadResponse.json();
        console.log("Upload successful:", uploadData);

        // Then compare the audio
        const compareResponse = await fetch("http://localhost:8000/compare/audio/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ features: "recording.wav" }),
        });

        if (!compareResponse.ok) {
          const errorData = await compareResponse.text();
          throw new Error(`HTTP error! status: ${compareResponse.status}, message: ${errorData}`);
        }

        const compareData: ResultData = await compareResponse.json();
        console.log("Comparison data:", compareData);
        setResult(compareData);
      } catch (error) {
        console.error("Error uploading or comparing file:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("No audio to upload");
    }
  };

  useEffect(() => {
    let soundDetectionInterval: NodeJS.Timeout | null = null;

    if (isRecording) {
      let soundDetectedTime = 0;

      soundDetectionInterval = setInterval(() => {
        if (soundDetectedRef.current) {
          soundDetectedTime += 1;
          if (soundDetectedTime >= 5) {
            const audioBlob = stopRecording();
            if (audioBlob) {
              uploadRecording(audioBlob);
            }
            if (soundDetectionInterval) {
              clearInterval(soundDetectionInterval);
            }
          }
        } else {
          soundDetectedTime = 0;
        }
      }, 1000);
    }

    return () => {
      if (soundDetectionInterval) clearInterval(soundDetectionInterval);
    };
  }, [isRecording]);

  return (
    <div className="flex flex-col items-center w-full px-5">
      <div className="flex flex-col w-full gap-5 justify-center py-4 items-center border border-white rounded-xl">
        <h1 className="text-3xl font-bold mb-6">Recording Page</h1>
        <button
          onClick={isRecording ? () => stopRecording() : startRecording}
          className={`px-6 py-2 rounded-lg font-semibold text-white ${
            isRecording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        {audioURL && (
          <div className="mt-6 flex flex-col items-center">
            <audio src={audioURL} controls autoPlay className="mb-4" />
          </div>
        )}
        {isLoading && <p>Processing...</p>}
        {result.len > 0 && (
          <div className="mt-4 text-center">
            <p>Processed {result.len} data in {result.time} seconds</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingPage;