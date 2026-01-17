import Link from "next/link";
import { CardFooter } from "../ui/card";

export default function Footer() {
  return (
    <CardFooter className="bg-gray-50 pt-16 pb-8 mt-20 border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                T
              </div>
              <span className="text-xl font-bold text-gray-800">T-Mart</span>
            </div>
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
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
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
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-400 pt-8 text-center md:text-left">
          <p className="text-gray-400 text-sm">
            © 2026 TeFaMart. All Rights Reserved.
          </p>
        </div>
      </div>
    </CardFooter>
  );
}
