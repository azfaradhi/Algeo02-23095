'use client'

import React, { useEffect, useRef, useState } from 'react';
import MIDIPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';

const albumData = {
  audio: 'ACDC - Thunderstruck.mid',
  image: 'adele - skyfall.jpeg',
  songName: 'skyfall',
  artist: 'adele',
};

const instruments = [
  'acoustic_grand_piano',
  'electric_guitar_jazz',
  'violin',
  'trumpet',
  'flute',
  // Add more instruments as needed
];

const App = () => {
  const playerRef = useRef<MIDIPlayer.Player | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [loadedInstruments, setLoadedInstruments] = useState<any[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>(['acoustic_grand_piano']);

  useEffect(() => {
    // Initialize the MIDI player
    const player: MIDIPlayer.Player = new MIDIPlayer.Player(function (event: MIDIPlayer.Event) {
      if (event.name === 'Note on' && loadedInstruments.length > 0) {
        loadedInstruments.forEach((instrument) => {
          instrument.play(event.noteName, audioContext!.currentTime, { gain: (event.velocity ?? 100) / 100 });
        });
      }
    });

    playerRef.current = player;

    // Load the MIDI file
    fetch(`/dataset/test_midi_dataset/${albumData.audio}`)
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
      // Clean up the player when the component is unmounted
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
      <img src={`/dataset/test_midi_dataset/${albumData.image}`} alt={albumData.songName} className="mb-4" />
      <h1 className="text-2xl font-bold mb-2">{albumData.songName}</h1>
      <h2 className="text-xl mb-4">{albumData.artist}</h2>
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
        <button onClick={handlePlay} className="px-4 py-2 bg-blue-500 text-white rounded">Play</button>
        <button onClick={handlePause} className="px-4 py-2 bg-yellow-500 text-white rounded">Pause</button>
        <button onClick={handleStop} className="px-4 py-2 bg-red-500 text-white rounded">Stop</button>
      </div>
    </div>
  );
};

export default App;