import React from 'react';
import { AlbumData } from './types';

type AudioCardProps = {
  album: AlbumData;
};

const AudioCard: React.FC<AudioCardProps> = ({ album }) => {
  return (
    <div className="flex items-center p-4 border rounded-lg shadow-md">
      <img src={`/dataset/test_image/${album.image}`} alt={album.songName} width="100" className="mr-4 rounded-lg" />
      <div>
        <p className="font-bold text-[32px]">{album.songName}</p>
        <p className="text-left">{album.artist}</p>
      </div>
    </div>
  );
};

export default AudioCard;