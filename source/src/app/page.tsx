'use client';
import "../styles/global.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ImageIcon, AudioLines, Upload, ChevronRight } from "lucide-react";

// Feature Card Component
const FeatureCard = ({
  icon: Icon,
  title,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  onClick: () => void;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-black/30 backdrop-blur-sm border-2 border-gray-500 rounded-2xl p-6 m-4 w-64 cursor-pointer transition-all duration-300 hover:shadow-2xl"
    >
      <div className="flex items-center mb-4">
        <Icon className="text-white w-10 h-10 mr-4" />
        <h3 className="text-xl font-bold text-white">{title}</h3>
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
    document.body.style.overflowY = "auto"; // Enable scrolling
    return () => {
      document.body.style.overflowY = "auto"; // Cleanup on unmount
    };
  }, []);

  const handleRedirect = (path: string) => {
    router.push(path);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-fixed bg-center bg-[url('/background.png')] flex flex-col items-center justify-between py-10"
    >
      {/* Header */}
      <div className="w-full flex justify-end pr-20">
        <div className="text-lg font-bold hover:underline transition duration-300">
          <Link href={"/about-us"}>About Us</Link>
        </div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center text-[120px] tracking-widest mt-10"
      >
        Foto Kelas
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="flex flex-wrap justify-center mt-8 gap-4"
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

      {/* Upload Dataset Button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="mt-8"
      >
        <button
          onClick={() => handleRedirect('/upload-dataset')}
          className="flex items-center justify-center bg-black bg-opacity-30 border-2 border-gray-500 px-6 py-3 rounded-2xl shadow-xl hover:bg-opacity-40 transition-all duration-300"
        >
          <Upload className="mr-4" /> Upload Dataset
        </button>
      </motion.div>
    </div>
  );
}
