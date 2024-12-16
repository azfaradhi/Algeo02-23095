'use client';
import "../styles/global.css"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ImageIcon, 
  AudioLines, 
  Upload, 
  ChevronRight 
} from "lucide-react";

// Feature Card Component
const FeatureCard = ({ 
  icon: Icon, 
  title,
  onClick 
}: { 
  icon: React.ComponentType<{className?: string}>, 
  title: string,
  onClick: () => void 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-black/30 backdrop-blur-sm border-2 border-gray-500 rounded-2xl p-6 m-4 w-72 cursor-pointer transition-all duration-300 hover:shadow-2xl"
    >
      <div className="flex items-center mb-4">
        <Icon className="text-white w-12 h-12 mr-4" />
        <h3 className="text-2xl font-bold text-white">{title}</h3>
      </div>
      <div className="flex items-center text-white hover:text-gray-200">
        <span>Get Started</span>
        <ChevronRight className="ml-2" />
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleRedirect = (path: string) => {
    router.push(path);
  }

  return (
    <div
      className="h-screen bg-cover bg-fixed bg-center bg-[url('/background.png')]"
    >
      <div className="h-auto relative z-10 py-10">
        <div className="flex items-center text-[32px] font-bold justify-end">
          <div className="relative mx-20 hover:underline transition duration-300">
            <Link href={"/about-us"}>About Us</Link>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="my-[100px] flex justify-center items-center text-center text-[108px] tracking-widest"
        >
          Foto Kelas
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex justify-center text-[32px] mb-10"
        >
          <FeatureCard
            icon={ImageIcon}
            title="Image Processing"
            onClick={() => handleRedirect('/image-page')}
          />
          <FeatureCard
            icon={AudioLines}
            title="Audio Processing"
            onClick={() => handleRedirect('/audio-page')}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex justify-center text-[32px] pt-10"
        >
          <button 
            onClick={() => handleRedirect('/upload-dataset')}
            className="flex items-center justify-center mx-10 bg-black bg-opacity-30 border-2 border-gray-500 px-4 py-2 rounded-2xl shadow-xl hover:bg-opacity-40 transition-all duration-300"
          >
            <Upload className="mr-4" /> Upload Dataset
          </button>
        </motion.div>
      </div>
    </div>
  );
}