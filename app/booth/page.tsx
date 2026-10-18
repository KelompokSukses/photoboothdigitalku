"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { premiumFrames } from "@/lib/premiumFrames";
import { luxuryFrames } from "@/lib/luxuryFrames";
import { premiumFrameGeometry } from "@/lib/premiumFrameGeometry";

type LayoutId = "3cut" | "4cut" | "2x2" | "polaroid";
type FrameColor = { name: string; hex: string; metallic?: boolean };
const DRAFT_KEY = "photoboothdigitalku-draft-v1";
const layouts: { id: LayoutId; label: string; count: number; columns: number }[] = [
  { id: "3cut", label: "3 Cut", count: 3, columns: 1 },
  { id: "4cut", label: "4 Cut", count: 4, columns: 1 },
  { id: "2x2", label: "2 × 2", count: 4, columns: 2 },
  { id: "polaroid", label: "Polaroid", count: 1, columns: 1 },
];
const standardColors: FrameColor[] = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#202020" },
  { name: "Navy", hex: "#192A48" },
  { name: "Dusty Pink", hex: "#D8A7B1" },
  { name: "Baby Blue", hex: "#AFCDE7" },
  { name: "Lavender", hex: "#C9B8E7" },
  { name: "Cream", hex: "#F4E5CF" },
  { name: "Sage", hex: "#B8C7B1" },
  { name: "Chili Red", hex: "#E32219" },
  { name: "Orange", hex: "#FF7518" },
  { name: "Maroon", hex: "#800020" },
];

const metallicColors: FrameColor[] = [
  { name: "Gold Metallic", hex: "#D4AF37", metallic: true },
  { name: "Rose Gold Metallic", hex: "#B76E79", metallic: true },
  { name: "Silver Metallic", hex: "#C0C0C0", metallic: true },
];

const premiumColors: FrameColor[] = [
  { name: "Holographic", hex: "#B8E6F5" },
  { name: "Pearl", hex: "#F5F0EB" },
  { name: "Aurora", hex: "#358C98" },
  { name: "Galaxy", hex: "#69449E" },
];

const gradients: Record<string, string> = {
  // METALLIC
  "#D4AF37": "linear-gradient(135deg,#795019 0%,#E6BF61 25%,#FFF1B0 45%,#B17A2E 70%,#F4D98A 100%)",
  "#B76E79": "linear-gradient(135deg,#854A53 0%,#D89A9F 25%,#FFE0D0 45%,#B46B76 70%,#F1B9B2 100%)",
"#C0C0C0": "linear-gradient(135deg, #525862 0%, #AEB7C2 20%, #FFFFFF 40%, #788390 65%, #E8EEF5 85%, #626C78 100%)",

  // PREMIUM
 "#B8E6F5": "linear-gradient(135deg,#8ED9ED 0%,#F5C7EF 25%,#C7BEFF 50%,#B4F1DE 75%,#FFE8AD 100%)",
  "#F5F0EB": "linear-gradient(135deg,#DDDCE2 0%,#FFFDF8 30%,#EADFEB 55%,#FFFFFF 75%,#DCE9EB 100%)",
 "#358C98": "linear-gradient(135deg,#153C59 0%,#358C98 25%,#8CE3B4 50%,#A38DD9 75%,#233F79 100%)",
  "#69449E": "linear-gradient(135deg,#2B164B 0%,#69449E 25%,#D18AD8 50%,#F2B5B0 75%,#53307A 100%)",
};

// File contoh asli dari folder public/samples, sesuai layout yang dipilih.
const samplePhotos: Record<LayoutId, string[]> = {
  "3cut": ["3cutphoto-1.png", "3cutphoto-2.png", "3cutphoto-3.png"],
  "4cut": ["4cutphoto-1.png", "4cutphoto-2.png", "4cutphoto-3.png", "4cutphoto-4.png"],
  "2x2": ["2x2photo-1.png", "2x2photo-2.png", "2x2photo-3.png", "2x2photo-4.png"],
  polaroid: ["polaroidphoto.png"],
};

function FrameSample({ layout, color, thumbnail = false }: { layout: typeof layouts[number]; color: string; thumbnail?: boolean }) {
  return (
    <div className={`flex w-full flex-col ${thumbnail ? "gap-[3px] p-[4px]" : "gap-[6px] p-[9px]"} shadow-md`} style={{ background: gradients[color] ?? color }}>
      <div className={`grid ${thumbnail ? "gap-[3px]" : "gap-[6px]"}`} style={{ gridTemplateColumns: `repeat(${layout.columns},minmax(0,1fr))` }}>
        {Array.from({ length: layout.count }, (_, i) => (
          <div key={i} className="aspect-[4/3] min-w-0 overflow-hidden bg-[#ddd8d2]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/samples/${samplePhotos[layout.id][i]}`}
              alt={`Contoh foto ${layout.label} nomor ${i + 1}`}
              className="block h-full w-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>
      {layout.id === "polaroid" && <div aria-hidden="true" className={thumbnail ? "h-[10px]" : "h-[25px]"} />}
    </div>
  );
}

export default function BoothPage() {
  const router = useRouter();
  const [layoutId, setLayoutId] = useState<LayoutId>("4cut");
  const [color, setColor] = useState<FrameColor>(standardColors[0]);
  const [frameType, setFrameType] = useState<"original" | "premium" | "luxury">("original");
  const [luxuryFrameId, setLuxuryFrameId] = useState("luxury-001");
  const selectedLuxuryFrame = luxuryFrames.find((item) => item.id === luxuryFrameId);
  const [premiumFrameId, setPremiumFrameId] = useState("frame-001");
  const selectedPremiumFrame = premiumFrames.find(
  (item) => item.id === premiumFrameId
);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as { layout?: LayoutId; color?: string };
      if (layouts.some((item) => item.id === draft.layout)) setLayoutId(draft.layout!);
     
if (draft.color && /^#[0-9A-Fa-f]{6}$/.test(draft.color)) {
  const savedColor = [
    ...metallicColors,
    ...premiumColors,
  ].find(
    (item) => item.hex.toLowerCase() === draft.color!.toLowerCase()
  );

  setColor(
    savedColor ?? {
      name: "Custom Color",
      hex: draft.color,
    }
  );
}

    } catch { /* Draft tidak tersedia; gunakan pilihan default. */ }
  }, []);
  const layout = layouts.find((item) => item.id === layoutId)!;
 
const price =
  frameType === "premium"
    ? (selectedPremiumFrame?.price ?? 6900)
    : 5000 +
      (premiumColors.some((item) => item.hex === color.hex)
        ? 1500
        : color.metallic
        ? 1200
        : 0);

 
function continueToCreate() {
  if (frameType === "luxury") {
    router.push(`/create?frameType=luxury&luxuryFrameId=${encodeURIComponent(luxuryFrameId)}`);
    return;
  }
  if (frameType === "premium") {
    router.push(
      `/create?frameType=premium&premiumFrameId=${encodeURIComponent(premiumFrameId)}`
    );
    return;
  }

  router.push(
    `/create?layout=${layoutId}&color=${encodeURIComponent(color.hex)}`
  );
}

  return (

    <main className="min-h-screen bg-cover bg-center bg-fixed px-4 py-7 text-[#292929]" style={{ backgroundImage: "url('/backgroundbooth.jpg')", backgroundColor: "#eee9e5" }}>
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4">
          <button type="button" onClick={() => router.push("/")} className="text-sm font-medium hover:underline">← Back to Home</button>
          <span className="text-right text-xs font-bold tracking-[0.16em] text-[#96764f]">PHOTOBOOTH DIGITALKU</span>
        </header>
        <div className="mt-7 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Choose Your Photobooth</h1>
          <p className="mt-2 text-sm text-gray-600">Pilih layout dan warna frame sebelum mulai mengedit foto.</p>
        </div>
        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="space-y-6">
            
<div className="rounded-2xl bg-white/90 p-5 shadow-md">
  <h2 className="text-base font-bold">
    Pilih Jenis Frame
  </h2>

  <div className="mt-4 grid grid-cols-3 gap-3">
    <button
      type="button"
      onClick={() => setFrameType("original")}
      className={`rounded-xl border-2 px-4 py-3 font-semibold ${
        frameType === "original"
          ? "border-[#b58b50] bg-[#fff7e9]"
          : "border-gray-200 bg-white"
      }`}
    >
      Original Frame
    </button>

    <button
      type="button"
      onClick={() => setFrameType("premium")}
      className={`rounded-xl border-2 px-4 py-3 font-semibold ${
        frameType === "premium"
          ? "border-[#b58b50] bg-[#fff7e9]"
          : "border-gray-200 bg-white"
      }`}
    >
      Premium Frame
    </button>
    <button type="button" onClick={() => setFrameType("luxury")}
      className={`rounded-xl border-2 px-2 py-3 text-sm font-semibold ${frameType === "luxury" ? "border-[#b58b50] bg-[#fff7e9]" : "border-gray-200 bg-white"}`}>
      Luxury Frame
    </button>
  </div>
</div>

{frameType === "luxury" && (
  <div className="rounded-2xl bg-white/90 p-5 shadow-md">
    <h2 className="font-bold">Luxury Frame Collection</h2>
    <p className="mt-1 text-xs text-gray-500">Rp10.000 per frame • 1 foto</p>
    <div className="mt-4 grid grid-cols-2 gap-3">
      {luxuryFrames.map((frame) => (
        <button key={frame.id} type="button" onClick={() => setLuxuryFrameId(frame.id)}
          className={`rounded-xl border-2 p-2 ${luxuryFrameId === frame.id ? "border-[#b58b50] bg-[#fff7e9]" : "border-gray-200"}`}>
          <img src={frame.image} alt={frame.name} className="mx-auto h-48 w-full object-contain" />
          <span className="text-xs font-semibold">{frame.name}</span>
        </button>
      ))}
    </div>
  </div>
)}
{frameType === "premium" && (
  <div className="rounded-2xl bg-white/90 p-5 shadow-md">
    <h2 className="text-base font-bold">
      Premium Frame Collection
    </h2>

    <p className="mt-1 text-xs text-gray-500">
    Rp6.900 per frame • Geser untuk melihat desain
    </p>
      
<div className="mt-4 grid max-h-[390px] grid-cols-3 gap-2 overflow-y-auto overflow-x-hidden pr-2 pb-2">

{premiumFrames.map((frame) => (
  <button
    key={frame.id}
    type="button"
    onClick={() => setPremiumFrameId(frame.id)}
    className={`min-w-0 rounded-xl border-2 p-1.5 ${
      premiumFrameId === frame.id
        ? "border-[#b58b50] bg-[#fff7e9]"
        : "border-gray-200 bg-white"
    }`}
  >

          <img
            src={frame.image}
            alt={frame.name}
            className="h-44 w-full object-contain"
          />

<p className="mt-2 text-xs font-semibold">
  {frame.name}
</p>
<p className="mt-1 text-xs font-semibold text-[#a47a46]">
  Rp{frame.price.toLocaleString("id-ID")}
</p>
</button>

      ))}
    </div>
  </div>
)}


{frameType === "original" && (
  <>

            <div className="rounded-2xl bg-white/90 p-5 shadow-md">
              <h2 className="text-base font-bold">01. Pilih Layout</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {layouts.map((item) => (
                  <button key={item.id} type="button" onClick={() => setLayoutId(item.id)} aria-pressed={layoutId === item.id}
                    className={`rounded-xl border-2 p-3 text-center transition ${layoutId === item.id ? "border-[#b58b50] bg-[#fff7e9]" : "border-gray-200 bg-white hover:border-[#d7ba8b]"}`}>
                    <div className="mx-auto flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-[#D8DCE0] to-[#EEE9E5] p-3">
  <div className="w-[76px]">
    <FrameSample layout={item} color={color.hex} thumbnail />
  </div>
</div>

<div className="mt-3 flex flex-col items-end text-right">
  <span className="text-sm font-semibold">
    {item.label}
  </span>
  <span className="mt-1 text-xs font-semibold text-[#a47a46]">
    Rp5.000
  </span>
</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white/90 p-5 shadow-md">
              <h2 className="text-base font-bold">02. Pilih Warna Frame</h2>
              <p className="mt-1 text-xs text-gray-500">
  Standard Rp5.000 · Metallic Rp6.200 · Premium Rp6.500
</p>
              
<h3 className="mt-5 text-sm font-semibold">
  Standard
</h3>

<div className="mt-3">
  <label className="block text-xs text-gray-600">
    Warna Frame
  </label>

  <input
    type="color"
    value={color.metallic ? "#FFFFFF" : color.hex}
    onChange={(event) =>
      setColor({
        name: "Custom Color",
        hex: event.target.value,
      })
    }
    className="mt-2 h-9 w-12 cursor-pointer"
  />
</div>

              <h3 className="mt-5 text-sm font-semibold">Metallic <span className="font-normal text-[#a47a46]">+Rp1.200</span></h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {metallicColors.map((item) => (
                  <button key={item.hex} type="button" title={item.name} aria-label={item.name} aria-pressed={color.hex === item.hex} onClick={() => setColor(item)} className={`h-11 w-11 rounded-full border-2 p-[3px] transition ${color.hex === item.hex ? "border-[#b58b50] ring-2 ring-[#e5c999]" : "border-gray-300"}`}>
                 <span
  className="block h-full w-full rounded-full border border-black/10"
  style={{ background: gradients[item.hex] || item.hex }}
/>
</button>
))}
</div>

<h3 className="mt-5 text-sm font-semibold">
  Premium <span className="font-normal text-[#a47a46]">+Rp1.500</span>
</h3>

<div className="mt-3 flex flex-wrap gap-3">
  {premiumColors.map((item) => (
    <button
      key={item.hex}
      type="button"
      title={item.name}
      aria-label={item.name}
      aria-pressed={color.hex === item.hex}
      onClick={() => setColor(item)}
      className={`h-11 w-11 rounded-full border-2 p-[3px] transition ${
        color.hex === item.hex
          ? "border-[#b58b50] ring-2 ring-[#e5c999]"
          : "border-gray-300"
      }`}
    >
      <span
        className="block h-full w-full rounded-full border border-black/10"
        style={{ background: gradients[item.hex] || item.hex }}
      />
    </button>
 
  ))}
</div>

<p className="mt-4 text-xs text-gray-600">
  Warna dipilih: <strong>{color.name}</strong>
</p>
</div>
  </>
)}
</section>

<section className="rounded-2xl bg-white/90 p-5 shadow-md lg:sticky lg:top-5">

            <div className="flex items-center justify-between gap-3"><h2 className="text-base font-bold">03. Preview Frame</h2><span className="text-xs text-gray-500">{layout.label}</span></div>
            <div className="mt-4 flex min-h-[390px] items-center justify-center rounded-xl bg-gradient-to-br from-[#D8DCE0] to-[#EEE9E5] p-5">
             <div
  className={`w-full ${
    layout.id === "2x2"
      ? "max-w-[360px]"
      : layout.id === "polaroid"
      ? "max-w-[320px]"
      : "max-w-[255px]"
  }`}
>
{frameType === "luxury" && selectedLuxuryFrame ? (
  <img src={selectedLuxuryFrame.image} alt={selectedLuxuryFrame.name} className="block h-auto w-full object-contain" />
) : frameType === "premium" && selectedPremiumFrame ? (
  <img
    src={selectedPremiumFrame.image}
    alt={selectedPremiumFrame.name}
    className="block h-auto w-full object-contain"
  />
) : (
  <FrameSample layout={layout} color={color.hex} />
)}

</div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-[#eadbc5] bg-[#fbf7f0] p-4">
              <span className="text-sm font-medium">Harga Frame</span><strong className="text-lg text-[#a47a46]">Rp{price.toLocaleString("id-ID")}</strong>
            </div>
            <p className="mt-2 text-xs text-gray-500">Stiker tambahan dapat dipilih di halaman Create (Rp2.000/stiker).</p>
            <button type="button" onClick={continueToCreate} className="mt-5 w-full rounded-full bg-gradient-to-r from-[#b68a49] via-[#f4dca5] to-[#b68a49] px-6 py-4 text-sm font-bold text-black shadow-lg transition hover:brightness-105">CONTINUE TO CREATE →</button>
                    </section>
        </div>
      </div>
    </main>
  );
}
