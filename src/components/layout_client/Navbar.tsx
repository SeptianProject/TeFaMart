import Link from "next/link";
import { ShoppingCart, Search, User } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href={"/"} className="flex items-center gap-2">
          <Image src={"/logo-nav-client.png"} width={50} height={50} alt="" />
          <span className="text-2xl font-bold text-gray-800">T-Mart</span>
        </Link>
        <div className="hidden md:flex flex-1 mx-12 max-w-2xl relative">
          <Input
            type="text"
            placeholder="Cari di TeFaMart"
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <div className="flex items-center gap-6">
          <Button className="w-10 h-10 bg-white rounded-full overflow-hidden border border-gray-200">
            <ShoppingCart className="w-6 h-6 text-gray-900" />
          </Button>
          <Button className="w-10 h-10 bg-white rounded-full overflow-hidden border border-gray-200">
            <User className="w-6 h-6 text-gray-900" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
