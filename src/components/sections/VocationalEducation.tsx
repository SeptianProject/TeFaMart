import React from "react";
import Image from "next/image";
import LogoPens from "../../../public/assets/logo/logo-pens.png";
import LogoPoliwangi from "../../../public/assets/logo/logo-poliwangi.png";
import LogoPolinema from "../../../public/assets/logo/logo-polinema.png";
import LogoSmea from "../../../public/assets/logo/logo-smea.png";
import TitleLanding from "../ui/titleLanding";

const VocationalEducation = () => {
  const data = [
    {
      nickname: "Poliwangi",
      name: "Politeknik Negeri Banyuwangi",
      image: LogoPoliwangi,
    },
    {
      nickname: "Polinema",
      name: "Politeknik Negeri Malang",
      image: LogoPolinema,
    },
    {
      nickname: "PENS",
      name: "Politeknik Elektronika Negeri Surabaya",
      image: LogoPens,
    },
    {
      nickname: "SMEA",
      name: "SMK Negeri 1 Banyuwangi",
      image: LogoSmea,
    },
  ];

  return (
    <section className="space-y-10">
      <div className="px-25">
        <TitleLanding name="Pendidikan Vokasi Terdaftar" />
      </div>
      <div className="mb-40 w-full flex flex-col gap-10 overflow-hidden">
        <div className="flex gap-10 w-full translate-x-20">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2.5 justify-center w-full bg-gray-200 py-5 rounded-xl">
              <div className="size-14 overflow-hidden">
                <Image src={item.image} alt={item.name} />
              </div>
              <h3>{item.nickname}</h3>
              <p>({item.name})</p>
            </div>
          ))}
        </div>
        <div className="flex gap-10 w-full -translate-x-20">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2.5 justify-center w-full bg-gray-200 py-5 rounded-xl">
              <div className="size-14 overflow-hidden">
                <Image src={item.image} alt={item.name} />
              </div>
              <h3>{item.nickname}</h3>
              <p>({item.name})</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VocationalEducation;
