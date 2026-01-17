import Navbar from "@/components/layout_client/Navbar";
import Footer from "@/components/layout_client/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="grow">
          {children}
        </main>
        <Footer />
    </div>
  );
}
