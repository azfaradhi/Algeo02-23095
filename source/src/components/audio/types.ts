export type AlbumData = {
    audio: string;
    image: string;
    songName: string;
    artist: string;
};

export const instruments = [
    'acoustic_grand_piano',
    'electric_guitar_jazz',
    'violin',
    'trumpet',
    'flute',
];

export type ResultData = {
    namafile: string;
    score: number;
};