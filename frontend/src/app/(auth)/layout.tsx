import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-screen font-sans bg-[#f8f9fb] items-center justify-center p-5">
      {/* Absolute Logo */}
      <div className="absolute top-5 right-5 md:top-10 md:right-16 flex items-center gap-1.5 font-extrabold text-2xl">
        <span className="text-black">IT</span>
        <span className="bg-[#4a86f7] text-white px-2 py-0.5 rounded-md text-base font-bold">LIVE</span>
      </div>
      
      {/* Centered Modal Card */}
      <div className="w-full max-w-[440px] bg-white rounded-3xl p-10 shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
        {children}
      </div>
    </div>
  );
}
