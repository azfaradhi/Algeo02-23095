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

export type AlbumResultData = {
    namafile: string;
    score: number;
};

export type ResultData = {
    album: AlbumResultData[];
    time: number;
    len: number;
};