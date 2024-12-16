'use client';

import '../../styles/global.css';

import React, { useEffect, useRef, useState } from 'react';
import MIDIPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';
import { AlbumData } from './types';

type AudioPlayCardProps = {
  album: AlbumData;
  score: number;
};

const AudioPlayCard: React.FC<AudioPlayCardProps> = ({ album, score }) => {
  const playerRef = useRef<MIDIPlayer.Player | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [loadedInstruments, setLoadedInstruments] = useState<any[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>(['acoustic_grand_piano']);
  const [isWAV, setIsWAV] = useState<boolean>(false);

  useEffect(() => {
    const fileExtension = album.audio.split('.').pop()?.toLowerCase();

    if (fileExtension === 'wav') {
      setIsWAV(true);
    } else {
      const player: MIDIPlayer.Player = new MIDIPlayer.Player((event: MIDIPlayer.Event) => {
        if (event.name === 'Note on' && loadedInstruments.length > 0) {
          loadedInstruments.forEach((instrument) => {
            instrument.play(event.noteName, audioContext!.currentTime, {
              gain: (event.velocity ?? 100) / 100,
            });
          });
        }
      });

      playerRef.current = player;

      fetch(`/dataset/test_audio/${album.audio}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to load MIDI file');
          }
          return response.arrayBuffer();
        })
        .then((data) => {
          player.loadArrayBuffer(data);
        })
        .catch((error) => {
          console.error('Error loading MIDI file:', error);
        });

      return () => {
        player.stop();
      };
    }
  }, [album.audio, loadedInstruments]);

  const handlePlay = async () => {
    if (isWAV) {
      audioRef.current?.play();
    } else {
      if (!audioContext) {
        const ac = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ac);
        const instrumentsPromises = selectedInstruments.map((instrument) =>
          Soundfont.instrument(ac, instrument as Soundfont.InstrumentName)
        );
        const instruments = await Promise.all(instrumentsPromises);
        setLoadedInstruments(instruments);
      } else if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      playerRef.current?.play();
    }
  };

  const handlePause = () => {
    if (isWAV) {
      audioRef.current?.pause();
    } else {
      playerRef.current?.pause();
    }
  };

  const handleStop = () => {
    if (isWAV) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } else {
      playerRef.current?.stop();
    }
  };

  return (
    <div className="flex gap-4 p-5 justify-between text-left items-center border bg-white bg-opacity-15 border-white rounded-xl">
      <div className="flex items-center gap-4">
        <img
          src={`/dataset/test_image/${album.image}`}
          alt={album.image}
          className="w-32 h-32 rounded-xl"
        />
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{album.songName}</h1>
          <h2 className="text-xl">{album.artist}</h2>
          <h2 className="text-xl mb-4">Similarity score: {(score * 100).toFixed(2)}%</h2>
        </div>
      </div>
      <div className="flex flex-col space-x-4 justify-center text-center items-center">
        <button onClick={handlePlay} className="px-4 py-2 w-full text-white rounded">
          Play
        </button>
        <button onClick={handlePause} className="px-4 py-2 w-full text-white rounded">
          Pause
        </button>
        <button onClick={handleStop} className="px-4 py-2 w-full text-white rounded">
          Stop
        </button>
      </div>
      {isWAV && (
        <audio ref={audioRef} src={`/dataset/test_audio/${album.audio}`} className="hidden" />
      )}
    </div>
  );
};

export default AudioPlayCard;
