"use client";

import Link from "next/link";
import {  Search, User, Menu, X, Heart } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useState } from "react";
import SearchModal from "./ui/SearchModal";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <nav className="w-full bg-background border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-5 h-16 sm:h-20 lg:h-24 flex items-center justify-between w-full">
        <Link
          href={"/"}
          className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Image
            src={"/assets/logo-nav-client.png"}
            width={40}
            height={40}
            alt="Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
          />
          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
            <span className="text-primary">TeFa</span>Mart
          </span>
        </Link>

        {/* Desktop Search */}
        <div
          className="hidden md:flex flex-1 mx-6 lg:mx-12 max-w-2xl relative cursor-pointer"
          onClick={() => setIsSearchModalOpen(true)}>
          <div className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 lg:py-3 px-6 pl-10 lg:pl-12 text-sm lg:text-base text-gray-500 flex items-center">
            Cari di TeFaMart
          </div>
          <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
        </div>

        {/* Desktop Icons */}
        <div className="hidden sm:flex items-center gap-3 lg:gap-6">
          <Button className="w-9 h-9 lg:w-10 lg:h-10 bg-white rounded-full overflow-hidden border border-gray-200 p-0 flex items-center justify-center group">
            <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-foreground group-hover:text-primary-foreground transition duration-300" />
          </Button>
          <Button className="w-9 h-9 lg:w-10 lg:h-10 bg-white rounded-full overflow-hidden border border-gray-200 p-0 flex items-center justify-center group">
            <User className="w-5 h-5 lg:w-6 lg:h-6 text-foreground group-hover:text-primary-foreground transition duration-300" />
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-background">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div
              className="relative cursor-pointer"
              onClick={() => setIsSearchModalOpen(true)}>
              <div className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 px-6 pl-10 text-sm text-gray-500 flex items-center">
                Cari di TeFaMart
              </div>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            {/* Mobile Icons */}
            <div className="flex items-center justify-between gap-3">
              <Button className="flex-1 h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <span className="text-sm text-primary">Wishlist</span>
              </Button>
              <Button className="flex-1 h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <span className="text-sm text-primary">Profil</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </nav>
  );
}
