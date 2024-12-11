import MIDIPlayer from 'midi-player-js';

export type AlbumData = {
    audio: string;
    image: string;
    songName: string;
    artist: string;
};

export type MIDIEvent = {
    name: string;
    [key: string]: any;
};

export interface ExtendedPlayer extends MIDIPlayer.Player {
  getSongLength: () => number;
  getSongTime: () => number;
}