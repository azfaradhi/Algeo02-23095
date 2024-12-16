'use client';
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import "../../styles/global.css";

// Team member type definition
type TeamMember = {
  name: string;
  role: string;
  image: string;
  description: string;
};

export default function AboutUsPage() {
  // Sample team members data
const teamMembers: TeamMember[] = [
    {
        name: "Azfa Radhiyya Hakim",
        role: "13523115",
        image: "/radhi.jpg",
        description: "One Shot One Kill (Nada Franco)"
    },
    {
        name: "Rafif Farras",
        role: "13523095",
        image: "/rafiff.jpg",
        description: "ez pz"
    },
    {
        name: "Barru Adi Utomo",
        role: "13523101",
        image: "/barru.jpg",
        description: "Nanti aku tulis sendiri"
    }
];

  // State to manage selected team member
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className="relative min-h-screen">
      {/* Full Background Image */}
      <Image
        src="/background.png"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="absolute inset-0 z-0"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-black/40 z-1"></div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <Link 
          href="/" 
          className="text-3xl font-bold text-center text-white mb-12"
        >
          ← Back to Homepage
        </Link>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-center text-white mb-12"
        >
          Meet Our Team
        </motion.h1>

        {/* Team Members Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-white/20"
              onClick={() => setSelectedMember(member)}
            >
              <div className="relative h-72 w-auto group">
                <Image 
                  src={member.image} 
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">CLICK!!</span>
                </div>
              </div>
              <div className="p-6 text-center text-white">
                <h3 className="text-3xl font-bold">{member.name}</h3>
                <p className="text-gray-200 text-2xxl">{member.role}</p>
              </div>
            </motion.div>

            
          ))}
        </div>
      </div>

      {/* Modal for Member Details */}
      {selectedMember && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedMember(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl max-w-2xl w-full p-8 relative border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
            <div className="flex items-center space-x-8">
              <div className="w-1/3 relative h-96">
                <Image 
                  src={selectedMember.image} 
                  alt={selectedMember.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="w-2/3 text-white">
                <h2 className="text-3xl font-bold mb-2">{selectedMember.name}</h2>
                <p className="text-3xl text-gray-200 mb-4">{selectedMember.role}</p>
                <p className="text-gray-300">{selectedMember.description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}