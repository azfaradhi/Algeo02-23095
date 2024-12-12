import { useState } from "react";
import Link from "next/link";

export default function Header(){
    return (
        <div className="flex items-center text-[32px] font-bold justify-between">
            <div className="relative mx-20 hover:underline transition duration-300">
                <Link href={"/"} >Homepage</Link>
            </div>
            <div className="relative mx-20 hover:underline transition duration-300">
                <Link href={"/about-us"} >About Us</Link>
            </div>
        </div>
    );

}