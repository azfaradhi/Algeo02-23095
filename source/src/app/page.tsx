'use client';

import "../styles/global.css"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";


export default function HomePage() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
        document.body.style.overflow = "auto";
    };
  }, []);

  const router = useRouter();

  const handleRedirect = (path: string) => {
    router.push(path);
  }

  return (
    <div
      className="h-screen bg-cover bg-fixed bg-center bg-[url('/background.png')]"
      >
      
      <div className="h-auto relative z-10 py-10"> 
        <div className="flex items-center text-[32px] font-bold justify-end">
          <div className=" relative mx-20 hover:underline transition duration-300">
            <Link href={"/about-us"} >About Us</Link>
          </div>
        </div>
      </div>
      <div className="my-[160px] flex justify-center items-center text-center text-[108px] tracking-widest">
        Foto Kelas
      </div>

      <div className="flex justify-center text-[32px]">
        <button onClick={() =>handleRedirect('/image-page')} className="mx-10 bg-black bg-opacity-30 border-2 border-gray-500 px-4 py-2 rounded-2xl shadow-xl ">Image Processing</button>
        <button onClick={() =>handleRedirect('/audio-page')} className="mx-10 bg-black bg-opacity-30 border-2 border-gray-500 px-4 py-2 rounded-2xl shadow-xl ">Audio Processing</button>
      </div>
      <div className="flex justify-center text-[32px] pt-10">
        <button onClick={() =>handleRedirect('/upload-dataset')} className="mx-10 bg-black bg-opacity-30 border-2 border-gray-500 px-4 py-2 rounded-2xl shadow-xl ">Upload Dataset</button>
      </div>
    </div>
  );
}