"use client";

import React from "react";
import Navbar from "@/components/layout_client/Navbar";
import Footer from "@/components/layout_client/Footer";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center w-full px-20">
        {/* hero section */}
        <section className="flex items-center gap-20 w-full">
          <div className="w-1/2 bg-gray-400 h-96 rounded-lg">1</div>
          <div className="w-1/4 bg-gray-400 h-96 rounded-lg">2</div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
