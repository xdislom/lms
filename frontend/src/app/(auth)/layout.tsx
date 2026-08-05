import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-screen flex-col md:flex-row font-sans">
      <div className="hidden md:flex flex-1 bg-[#F5F7FA] justify-center items-center">
        <img 
          src="/Hero (1).png" 
          alt="IT Live Dashboard" 
          className="w-[85%] h-auto object-contain" 
        />
      </div>
      <div className="flex-1 bg-white flex flex-col relative items-center justify-center p-5 md:p-0">
        <div className="absolute top-5 right-5 md:top-10 md:right-16 flex items-center gap-1.5 font-extrabold text-2xl">
          <span className="text-black">IT</span>
          <span className="bg-[#4a86f7] text-white px-2 py-0.5 rounded-md text-base font-bold">LIVE</span>
        </div>
        
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
