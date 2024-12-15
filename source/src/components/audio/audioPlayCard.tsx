'use client'

import '../../styles/global.css'


import React, { useEffect, useRef, useState } from 'react';
import MIDIPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';
import { AlbumData } from './types';
import { instruments } from './types';

type AudioPlayCardProps = {
  album: AlbumData;
};


const AudioPlayCard: React.FC<AudioPlayCardProps> = ({album}) => {
  const playerRef = useRef<MIDIPlayer.Player | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [loadedInstruments, setLoadedInstruments] = useState<any[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>(['acoustic_grand_piano']);

  useEffect(() => {
    const player: MIDIPlayer.Player = new MIDIPlayer.Player(function (event: MIDIPlayer.Event) {
      if (event.name === 'Note on' && loadedInstruments.length > 0) {
        loadedInstruments.forEach((instrument) => {
          instrument.play(event.noteName, audioContext!.currentTime, { gain: (event.velocity ?? 100) / 100 });
        });
      }
    });

    playerRef.current = player;

    fetch(`/dataset/test_midi_dataset/${album.audio}`)
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
  }, [loadedInstruments]);

  const handlePlay = async () => {
    if (!audioContext) {
      const ac = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ac);
      const instrumentsPromises = selectedInstruments.map((inst) => Soundfont.instrument(ac, inst as Soundfont.InstrumentName));
      const instruments = await Promise.all(instrumentsPromises);
      setLoadedInstruments(instruments);
    } else if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    playerRef.current?.play();
  };

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  };

  const handleStop = () => {
    if (playerRef.current) {
      playerRef.current.stop();
    }
  };

  const handleInstrumentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedInstruments(selectedOptions);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <img src={`/dataset/test_midi_dataset/${album.image}`} alt={album.songName} className="mb-4" />
      <h1 className="text-2xl font-bold mb-2">{album.songName}</h1>
      <h2 className="text-xl mb-4">{album.artist}</h2>
      <div className="mb-4">
        <label htmlFor="instruments" className="mr-2">Select Instruments:</label>
        <select
          id="instruments"
          multiple
          value={selectedInstruments}
          onChange={handleInstrumentChange}
          className="px-2 py-1 border rounded"
        >
          {instruments.map((inst) => (
            <option key={inst} value={inst}>{inst}</option>
          ))}
        </select>
      </div>
      <div className="flex space-x-4">
        <button onClick={handlePlay} className="px-4 py-2 text-white rounded">Play</button>
        <button onClick={handlePause} className="px-4 py-2  text-white rounded">Pause</button>
        <button onClick={handleStop} className="px-4 py-2  text-white rounded">Stop</button>
      </div>
    </div>
  );
};

export default AudioPlayCard;