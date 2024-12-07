import { useState } from "react";
import Link from "next/link";

export default function Header(){
    return (
        <div className="flex items-center justify-center">
        <div className="w-1/5 text-nowrap flex flex-row border-2 border-black px-4 py-4 justify-center bg-transparent shadow-lg rounded-xl">
            <div className="relative mx-10 text-black hover:underline transition duration-300">
                <Link href={"#"} >Homepage</Link>
            </div>
            <div className="relative mx-10 text-black hover:underline transition duration-300">
                <Link href={"/aboutus"} >About Us</Link>
            </div>
        </div>
        </div>
    );

}