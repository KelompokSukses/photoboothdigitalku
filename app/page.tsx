"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main
  className="relative h-screen min-h-[500px] overflow-hidden bg-cover bg-center bg-no-repeat text-[#242322]"
  style={{ backgroundImage: "url('/backgroundhomepage.jpg')" }}
>
      {/* ================= BRAND ================= */}

      <header className="absolute left-0 top-0 z-30 w-full pt-6 text-center">
        <h1 className="text-[20px] font-semibold tracking-[0.38em]">
          PHOTOBOOTH
          <span className="ml-2 text-[#a56f63]">
            DIGITALKU
          </span>
        </h1>

        <div className="mt-3 flex items-center justify-center">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#a77468]" />
          <div className="mx-3 h-[7px] w-[7px] rotate-45 bg-[#aa7568]" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#a77468]" />
        </div>
      </header>

      {/* LEFT PHOTO STRIP */}
<Image
  src="/homepage/strip2.png"
  alt="Left photo strip"
  width={300}
  height={650}
  className="
    absolute
    left-[-6%]
    top-[2%]
    z-[15]
    hidden
    h-[530px]
    w-auto
    rotate-[5deg]
    object-contain
    drop-shadow-[0_20px_16px_rgba(0,0,0,0.22)]
    xl:block
  "
  priority
/>
      {/* ================= RIGHT POLAROID ================= */}

      <Image
        src="/homepage/polaroidhitam-right.png"
        alt="Black photo booth example"
        width={200}
        height={400}
        className="absolute -right-[-2%] top-[4%] z-10 hidden h-auto w-[100px] rotate-[6deg] object-contain drop-shadow-[0_24px_20px_rgba(0,0,0,0.20)] lg:block xl:w-[310px]"
        priority
      />
{/* RIGHT PINK POLAROID */}
<Image
  src="/homepage/polaroid2.png"
  alt="White polaroid right"
  width={400}
  height={500}
  className="
    absolute
    right-[-2%]
    top-[21%]
    z-[12]
    hidden
    h-auto
    w-[450px]
    rotate-[8deg]
    object-contain
    drop-shadow-[0_20px_18px_rgba(0,0,0,0.20)]
    xl:block
  "
  priority
/>
      {/* ================= SPARKLES ================= */}

      <span className="absolute left-[5%] top-[15%] z-20 text-[25px] text-[#b77667]">
        ✦
      </span>

      <span className="absolute right-[7%] top-[15%] z-20 text-[22px] text-[#b77667]">
        ✦
      </span>

      <span className="absolute bottom-[14%] right-[6%] z-20 text-[25px] text-[#b77667]">
        ✦
      </span>

{/* ================= PINK CAMERA DECOR ================= */}

<Image
  src="/homepage/cameragold.png"
  alt="Gold camera"
  width={400}
  height={400}
  className="
    absolute
    left-[18%]
    top-[18%]
    z-[12]
    hidden
    h-auto
    w-[220px]
    -rotate-[8deg]
    object-contain
    drop-shadow-[0_18px_16px_rgba(0,0,0,0.18)]
    xl:block
  "
  priority
/>
{/* ================= LIGHTING DECOR ================= */}

<Image
  src="/homepage/lighting.png"
  alt="Studio lighting"
  width={400}
  height={500}
  className="
    absolute
    left-[15%]
    top-[50%]
    z-[11]
    hidden
    h-auto
    w-[250px]
    rotate-[3deg]
    object-contain
    drop-shadow-[0_18px_16px_rgba(0,0,0,0.16)]
    xl:block
  "
  priority
/>


      {/* ================= CENTER CONTENT ================= */}

      <section className="relative z-20 mx-auto flex h-[100dvh] w-[620px] max-w-[44vw] translate-y-[18px] flex-col items-center justify-center py-[2vh] text-center">


        <h2 className="font-serif text-[60px] font-medium leading-[0.88] tracking-[-0.045em] text-[#242322] lg:text-[74px]">
          Capture Your
          <br />
          Moment.
        </h2>

        <p className="mt-4 font-serif text-[21px] italic tracking-[0.03em] text-[#9c665a]">
          Your photo booth, your way.
        </p>

       {/* ================= GOLD BUTTON ================= */}

<button
  type="button"
 onClick={() => router.push("/booth")}
 
          className="
            group
            relative
            mt-6
            flex
            min-w-[390px]
            items-center
            justify-center
            overflow-hidden
            rounded-full
            border
            border-[#b88a42]
            bg-[linear-gradient(105deg,#8f641f_0%,#d5a94f_18%,#f8dfa0_38%,#c28d32_58%,#f3d384_78%,#9b6b22_100%)]
            px-10
            py-[16px]
            text-[13px]
            font-bold
            tracking-[0.22em]
            text-[#171717]
            shadow-[0_10px_25px_rgba(112,75,18,0.30),inset_0_1px_1px_rgba(255,255,255,0.8)]
            transition
            duration-300
            hover:-translate-y-1
            hover:shadow-[0_15px_30px_rgba(112,75,18,0.38),inset_0_1px_1px_rgba(255,255,255,0.9)]
          "
        >
          {/* metallic shine */}
          <span className="pointer-events-none absolute inset-y-0 left-[25%] w-[80px] -skew-x-[25deg] bg-white/20 blur-md" />

          <span className="relative z-10">
            MULAI PHOTOBOOTH
          </span>

          <span className="relative z-10 ml-7 text-[20px] font-normal transition-transform duration-300 group-hover:translate-x-1">
            ›
          </span>
        </button>

        {/* ================= CARA PAKAI ================= */}

        <div className="mt-6 w-[590px] max-w-full">

          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-28 bg-gradient-to-r from-transparent to-[#a76e61]" />

            <p className="whitespace-nowrap text-[12px] font-bold tracking-[0.3em] text-[#272625]">
              CARA PAKAI
            </p>

            <div className="h-px w-28 bg-gradient-to-l from-transparent to-[#a76e61]" />
          </div>

          <div className="mx-auto mt-4 grid max-w-[520px] grid-cols-3">

            <HowTo
              number="01"
              icon="▣"
              title="Pilih Frame"
              text="Pilih desain favoritmu"
            />

            <HowTo
              number="02"
              icon="◎"
              title="Ambil Foto"
              text="3 • 2 • 1 • pose!"
              border
            />

            <HowTo
              number="03"
              icon="⇩"
              title="Download"
              text="Simpan hasil fotomu"
            />

          </div>
        </div>

        {/* ================= BOTTOM FEATURES ================= */}

        <div className="mt-5 flex items-center justify-center gap-5 text-[16px] font-medium tracking-[0.19em] text-[#575250]">

          <span>NO INSTALL</span>

          <span className="h-[5px] w-[5px] rotate-45 bg-[#ad7466]" />

          <span>INSTANT</span>

          <span className="h-[5px] w-[5px] rotate-45 bg-[#ad7466]" />

          <span>DOWNLOAD</span>

        </div>

      </section>
    </main>
  );
}

/* ============================================================
   HOW TO
============================================================ */

function HowTo({
  number,
  icon,
  title,
  text,
  border = false,
}: {
  number: string;
  icon: string;
  title: string;
  text: string;
  border?: boolean;
}) {
  return (
    <div
      className={`px-5 ${
        border ? "border-x border-[#967e78]/40" : ""
      }`}
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#b27567] text-[17px] text-[#965f54]">
        {icon}
      </div>

      <p className="mt-1 text-[9px] font-semibold tracking-[0.14em] text-[#745b55]">
        {number}
      </p>

      <p className="mt-1 whitespace-nowrap text-[14px] font-bold text-[#272625]">
        {title}
      </p>

      <p className="mt-[3px] whitespace-nowrap text-[10px] text-[#625d5b]">
        {text}
      </p>
    </div>
  );
}