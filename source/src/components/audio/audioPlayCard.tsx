// 'use client'

// import React, { useEffect, useRef, useState } from 'react';
// import MIDIPlayer from 'midi-player-js';
// import Soundfont from 'soundfont-player';
// import { AlbumData } from './types'
// import { MIDIEvent } from './types'
// import { ExtendedPlayer } from './types'
// import '../../styles/global.css'

// type AudioPlayCardProps = {
//   album: AlbumData;
// };

// const AudioPlayCard: React.FC<AudioPlayCardProps> = ({ album }) => {
//   const playerRef = useRef<ExtendedPlayer | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
//   const [instrument, setInstrument] = useState<any>(null);
//   const [totalTicks, setTotalTicks] = useState(0);

//   useEffect(() => {
//     // Initialize the MIDI player
//     const player = new MIDIPlayer.Player((event: MIDIEvent) => {
//       if (event.name === 'Note on' && instrument) {
//         instrument.play(event.noteName, audioContext!.currentTime, { gain: event.velocity / 100 });
//       }
//     }) as ExtendedPlayer;

//     playerRef.current = player;

//     // Load the MIDI file
//     const fetchMIDIFile = async () => {
//       try {
//         const response = await fetch(`/dataset/test_midi_dataset/${album.audio}`);
//         if (!response.ok) {
//           throw new Error('Failed to load MIDI file');
//         }
//         const data = await response.arrayBuffer();
//         player.loadArrayBuffer(data);

//         // Calculate the total ticks
//         // let totalTicks = 0;
//         // player.tracks.forEach((track) => {
//         //   track.forEach((event) => {
//         //     totalTicks += event.deltaTime;
//         //   });
//         // });
//         setTotalTicks(20);
//         setProgress(0);
//       } catch (error) {
//         console.error('Error loading MIDI file:', error);
//       }
//     };

//     fetchMIDIFile();

//     // Initialize the AudioContext and load the instrument
//     const ac = new (window.AudioContext || (window as any).webkitAudioContext)();
//     setAudioContext(ac);
//     Soundfont.instrument(ac, 'acoustic_grand_piano').then((inst) => {
//       setInstrument(inst);
//     });

//     // Update progress
//     player.on('playing', () => {
//       const currentTime = player.getSongTime();
//       setProgress((currentTime / totalTicks) * 100);
//     });

//     player.on('endOfFile', () => {
//       setIsPlaying(false);
//       setProgress(100);
//     });

//     return () => {
//       // Clean up the player and AudioContext when the component is unmounted
//       player.stop();
//       ac.close();
//     };
//   }, [album.audio, instrument, totalTicks]);

//   const handlePlay = () => {
//     if (playerRef.current) {
//       playerRef.current.play();
//       setIsPlaying(true);
//     }
//   };

//   const handleStop = () => {
//     if (playerRef.current) {
//       playerRef.current.stop();
//       setIsPlaying(false);
//       setProgress(0);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-4 border rounded-lg shadow-md">
//       <img src={`/images/${album.image}`} alt={album.songName} width="100" className="mb-4 rounded-lg" />
//       <div className="text-center">
//         <p className="font-semibold">{album.songName}</p>
//         <p className="text-gray-600">{album.artist}</p>
//       </div>
//       <div className="w-full mt-4">
//         <div className="relative h-2 bg-gray-300 rounded">
//           <div className="absolute top-0 left-0 h-2 bg-blue-500 rounded" style={{ width: `${progress}%` }}></div>
//         </div>
//       </div>
//       <div className="mt-4">
//         <button onClick={handlePlay} disabled={isPlaying} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">
//           Play
//         </button>
//         <button onClick={handleStop} disabled={!isPlaying} className="px-4 py-2 bg-red-500 text-white rounded">
//           Stop
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AudioPlayCard;

// import MidiPlayer from 'react-midi-player';

