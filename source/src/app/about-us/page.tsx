'use client';
import { useEffect } from "react";
import Image from "next/image";
import Header from "src/components/header";
import Link from "next/link";

export default function AboutUsPage() {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="relative h-screen bg-cover bg-fixed">
            <Image
                src="/about-us-background.png"
                alt="About Us Background"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="absolute inset-0 z-0"
            />
            <div className="h-auto relative z-10 py-10"> 
                <div className="flex items-center text-[32px] font-bold justify-between">
                    <div className="relative mx-20 hover:underline transition duration-300">
                        <Link href={"/"} >Homepage</Link>
                    </div>
                </div>
            </div>

        </div>
    );
}