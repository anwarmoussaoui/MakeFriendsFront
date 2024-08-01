'use client';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../components/navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;

}>) {const router = useRouter();
    useEffect(() => {
      
      if(localStorage.getItem('role')!=='User'){
        router.push('/login');
      }
    })
        return (  
          <>
          <Navbar />
          <div style={{fontFamily: inter.style.fontFamily}}>
          <main>{children}</main></div>
          </>
    )}
            
    

  

