import React from 'react';

type AlbumData = {
  audio: string;
  image: string;
  songName: string;
  artist: string;
};

type AudioCardProps = {
  album: AlbumData;
};

const AudioCard: React.FC<AudioCardProps> = ({ album }) => {
  return (
    <div className="flex items-center p-4 border rounded-lg shadow-md">
      <img src={`/dataset/image/${album.image}`} alt={album.songName} width="100" className="mr-4 rounded-lg" />
      <div>
        <p className="font-bold text-[32px]">{album.songName}</p>
        <p className="">{album.artist}</p>
        
      </div>
      {/* <script src='http://www.midijs.net/lib/midi.js'></script> */}
    </div>
  );
};

export default AudioCard;