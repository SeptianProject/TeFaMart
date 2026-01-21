import Link from "next/link";
import { CardFooter } from "./ui/card";
import Image from "next/image";

export default function Footer() {
  const date = new Date().getFullYear();

  return (
    <CardFooter className="bg-background pt-16 pb-8 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link
              href={"/"}
              className="flex items-center gap-2 mb-4 shrink-0">
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
            <p className="text-gray-500 leading-relaxed mb-6 max-w-sm">
              Platform E-Commerce resmi hasil inovasi dan praktikum
              siswa/mahasiswa vokasi. Dari ruang kelas menuju pasar global.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Navigasi Cepat</h3>
            <ul className="space-y-3">
              {[
                "Beranda",
                "Produk Populer",
                "Kategori Populer",
                "Produk Lelang",
                "Pendidikan Terdaftar",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={"#"}
                    className="text-gray-500 hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Layanan</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-500 hover:text-primary transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-400 pt-8 text-center md:text-left">
          <p className="text-gray-400 text-sm">
            © {date} TeFaMart. All Rights Reserved.
          </p>
        </div>
      </div>
    </CardFooter>
  );
}
