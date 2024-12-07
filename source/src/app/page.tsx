'use client';

import "../styles/global.css"
import { useEffect, useState } from 'react';
import { fetchGreeting } from '../services/api';
import { useRouter } from 'next/navigation';
 
import Header from 'src/components/header';

export default function HomePage() {
  const [greeting, setGreeting] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getGreeting = async () => {
      const data = await fetchGreeting();
      setGreeting(data.Hello);
    };
    getGreeting();
  }, []);

  const handleRedirect = (path: string) => {
    router.push(path);
  }

  return (
    <div
      className="h-screen bg-cover bg-fixed bg-center"
      style={{backgroundImage: "url('background.png')"
      }}
      >
      <div className="py-10"> <Header /></div>
      <div className="my-[200px] flex justify-center items-center text-center text-black font-bold text-[48px]">FOTO KELAS</div>

      <div className="flex justify-center">
        <button onClick={() =>handleRedirect('/imagePage')} className="mx-10 bg-white bg-opacity-55 border-2 border-black px-4 py-2 rounded-2xl shadow-xl "> Image Processing</button>
        <button onClick={() =>handleRedirect('/audioPage')} className="mx-10 bg-white bg-opacity-55 border-2 border-black px-4 py-2 rounded-2xl shadow-xl "> Audio Processing</button>
      </div>
    </div>
  );
}