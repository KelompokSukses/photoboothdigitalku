"use client";
import { Caveat } from "next/font/google";

const handwritingFont = Caveat({
  subsets: ["latin"],
  display: "swap",
});

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { premiumFrames } from "@/lib/premiumFrames";
import { luxuryFrames } from "@/lib/luxuryFrames";

type LayoutId = "3cut" | "4cut" | "2x2" | "polaroid";
type StoredPhoto = { key: string; x: number; y: number; zoom: number } | null;
type Sticker = {
  id: string;
  src: string;
  name: string;
  slot: number;
  x: number;
  y: number;
  zoom: number;
  rotation: number;
};
type Draft = {
  customText?: string;
customTextColor?: string;
customTextSize?: number;
  photos: StoredPhoto[];
  stickers: Sticker[];
  layout: LayoutId;
  color: string;
};
type PreviewPhoto = { url: string; x: number; y: number; zoom: number } | null;
type PhotoSlot = { left: number; top: number; width: number; height: number };

const DRAFT_KEY = "photoboothdigitalku-draft-v1";
const PHOTO_DB = "photoboothdigitalku-photos-v1";
const STICKER_PRICE = 2000;

const layouts: Record<LayoutId, { count: number; columns: number }> = {
  "3cut": { count: 3, columns: 1 },
  "4cut": { count: 4, columns: 1 },
  "2x2": { count: 4, columns: 2 },
  polaroid: { count: 1, columns: 1 },
};

// Harus sama dengan premiumPhotoSlots di app/create/page.tsx.
const premiumPhotoSlots: PhotoSlot[] = [
  { left: 15, top: 8.5, width: 70, height: 25.5 },
  { left: 15, top: 34.5, width: 70, height: 25.5 },
  { left: 15, top: 61.5, width: 70, height: 25.5 },
];


const metallicGradients: Record<string, string> = {
  // METALLIC
  "#D4AF37": "linear-gradient(135deg,#795019 0%,#E6BF61 25%,#FFF1B0 45%,#B17A2E 70%,#F4D98A 100%)",
  "#B76E79": "linear-gradient(135deg,#854A53 0%,#D89A9F 25%,#FFE0D0 45%,#B46B76 70%,#F1B9B2 100%)",
  "#C0C0C0": "linear-gradient(135deg,#525862 0%,#AEB7C2 20%,#FFFFFF 40%,#788390 65%,#E8EEF5 85%,#626C78 100%)",

  // PREMIUM COLOR
  "#B8E6F5": "linear-gradient(135deg,#8ED9ED 0%,#F5C7EF 25%,#C7BEFF 50%,#B4F1DE 75%,#FFE8AD 100%)",
  "#F5F0EB": "linear-gradient(135deg,#DDDCE2 0%,#FFFDF8 30%,#EADFEB 55%,#FFFFFF 75%,#DCE9EB 100%)",
  "#358C98": "linear-gradient(135deg,#153C59 0%,#358C98 25%,#8CE3B4 50%,#A38DD9 75%,#233F79 100%)",
  "#69449E": "linear-gradient(135deg,#2B164B 0%,#69449E 25%,#D18AD8 50%,#F2B5B0 75%,#53307A 100%)",
};

function PhotoContent({ photo, index }: { photo: PreviewPhoto; index: number }) {
  return photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo.url}
      alt={`Photo ${index + 1}`}
      draggable={false}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      style={{ transform: `translate(${photo.x}px, ${photo.y}px) scale(${photo.zoom})` }}
    />
  ) : (
    <div className="flex h-full items-center justify-center text-xs text-gray-500">
      Photo {index + 1}
    </div>
  );
}

function SlotStickers({ stickers, slot }: { stickers: Sticker[]; slot: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-visible">
      {stickers.filter((sticker) => sticker.slot === slot).map((sticker) => (
        <div
          key={sticker.id}
          className="absolute"
          style={{
            left: `${sticker.x}%`,
            top: `${sticker.y}%`,
            width: `${30 * sticker.zoom}px`,
            height: `${30 * sticker.zoom}px`,
            transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={encodeURI(sticker.src)} alt={sticker.name} className="h-full w-full object-contain" />
        </div>
      ))}
    </div>
  );
}

function PreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const frameType = searchParams.get("frameType") === "luxury" ? "luxury" :
    searchParams.get("frameType") === "premium" ? "premium" : "original";
  const selectedLuxuryFrame = luxuryFrames.find((frame) =>
    frame.id === searchParams.get("luxuryFrameId")) ?? luxuryFrames[0];
  const isLuxury = frameType === "luxury";
  const premiumFrameId = searchParams.get("premiumFrameId");
  const selectedPremiumFrame = frameType === "premium"
    ? premiumFrames.find((frame) => frame.id === premiumFrameId)
    : undefined;
  const isPremium = frameType === "premium" && !!selectedPremiumFrame;

  const [draft, setDraft] = useState<Draft | null>(null);
  const [photos, setPhotos] = useState<PreviewPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const objectUrls: string[] = [];

    async function loadPreview() {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return;

        const saved = JSON.parse(raw) as Draft;
        if (!Object.prototype.hasOwnProperty.call(layouts, saved.layout)) return;

        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          const request = indexedDB.open(PHOTO_DB, 1);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        try {
          const restored = await Promise.all(
            saved.photos.map(async (photo) => {
              if (!photo) return null;
              const blob = await new Promise<Blob | undefined>((resolve, reject) => {
                const tx = db.transaction("photos", "readonly");
                const request = tx.objectStore("photos").get(photo.key);
                request.onsuccess = () => resolve(request.result as Blob | undefined);
                request.onerror = () => reject(request.error);
              });
              if (!blob) return null;
              const url = URL.createObjectURL(blob);
              objectUrls.push(url);
              return { url, x: photo.x, y: photo.y, zoom: photo.zoom };
            })
          );

          if (!cancelled) {
            setDraft(saved);
            setPhotos(restored);
          }
        } finally {
          db.close();
        }
      } catch (error) {
        console.error("Gagal memuat preview:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadPreview();
    return () => {
      cancelled = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  if (loading) return <main className="p-10 text-center">Memuat preview...</main>;
  if (!draft) {
    return (
      <main className="p-10 text-center">
        <p>Draft photobooth tidak ditemukan.</p>
        <button type="button" onClick={() => router.back()} className="mt-4 underline">
          Kembali ke Create
        </button>
      </main>
    );
  }

  const layout = isLuxury ? { count: 1, columns: 1 } :
    isPremium ? { count: 3, columns: 1 } : layouts[draft.layout];
  
const metallicColorCodes = ["#D4AF37", "#B76E79", "#C0C0C0"];
const premiumColorCodes = ["#B8E6F5", "#F5F0EB", "#358C98", "#69449E"];

const isMetallic = metallicColorCodes.includes(draft.color);
const isPremiumColor = premiumColorCodes.includes(draft.color);

const framePrice = isLuxury ? 10000 : isPremium
  ? selectedPremiumFrame.price
  : 5000 + (isPremiumColor ? 1500 : isMetallic ? 1200 : 0);

  const stickerCount = draft.stickers.filter((sticker) => sticker.slot < layout.count).length;
  const total = framePrice + stickerCount * STICKER_PRICE;

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed px-4 py-8 text-[#292929]"
      style={{ backgroundImage: "url('/backgroundcreate.jpg')" }}
    >
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 flex items-center gap-2 rounded-full bg-white/80 px-5 py-2.5 text-sm font-semibold shadow-md transition hover:bg-white"
        >
          ← Back to Create
        </button>

        <h1 className="text-center text-3xl font-bold">Your Photobooth Preview</h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Periksa hasil photobooth sebelum checkout.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <section className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#D8DCE0] via-[#E8DDE3] to-[#F2D6E2] p-6 shadow-lg">
            <div
             
  className={`relative flex w-full max-w-[300px] flex-col overflow-hidden shadow-xl ${
    isLuxury ? "aspect-[2/3] p-0" : isPremium
      ? "aspect-[619/1536] p-0"
      : draft.layout === "polaroid"
        ? "gap-0 px-[9px] pt-[9px] pb-[42px]"
        : "gap-[6px] px-[9px] pt-[9px] pb-[42px]"
  }`}
  style={{
    backgroundImage: isPremium || isLuxury
      ? "none"
      : metallicGradients[draft.color] ?? "none",
    backgroundColor: isPremium || isLuxury ? "transparent" : draft.color,
  }}
>

              {isLuxury ? (
                <>
                  <div className="absolute z-10 overflow-hidden bg-gray-200"
                    style={{ left: `${selectedLuxuryFrame.photoSlot.left}%`, top: `${selectedLuxuryFrame.photoSlot.top}%`,
                      width: `${selectedLuxuryFrame.photoSlot.width}%`, height: `${selectedLuxuryFrame.photoSlot.height}%` }}>
                    <PhotoContent photo={photos[0] ?? null} index={0} />
                  </div>
                  <img src={selectedLuxuryFrame.image} alt={selectedLuxuryFrame.name}
                    draggable={false} className="pointer-events-none absolute inset-0 z-20 h-full w-full object-fill" />
                  <div className="pointer-events-none absolute z-30"
                    style={{ left: `${selectedLuxuryFrame.photoSlot.left}%`, top: `${selectedLuxuryFrame.photoSlot.top}%`,
                      width: `${selectedLuxuryFrame.photoSlot.width}%`, height: `${selectedLuxuryFrame.photoSlot.height}%` }}>
                    <SlotStickers stickers={draft.stickers} slot={0} />
                  </div>
                </>
              ) : isPremium && selectedPremiumFrame ? (
                <>
                  {/* Foto ditempatkan di belakang gambar Premium Frame. */}
                  <div className="absolute inset-0 z-10">
                    {premiumPhotoSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="absolute overflow-hidden bg-gray-200"
                        style={{
                          left: `${slot.left}%`,
                          top: `${slot.top}%`,
                          width: `${slot.width}%`,
                          height: `${slot.height}%`,
                        }}
                      >
                        <PhotoContent photo={photos[index] ?? null} index={index} />
                      </div>
                    ))}
                  </div>

                  {/* PNG Premium Frame sebagai overlay di atas foto. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedPremiumFrame.image}
                    alt={selectedPremiumFrame.name}
                    draggable={false}
                    className="pointer-events-none absolute inset-0 z-20 h-full w-full object-contain"
                  />

                  {/* Stiker tampil di atas frame, mengikuti posisi slot foto. */}
                  <div className="pointer-events-none absolute inset-0 z-30">
                    {premiumPhotoSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="absolute"
                        style={{
                          left: `${slot.left}%`,
                          top: `${slot.top}%`,
                          width: `${slot.width}%`,
                          height: `${slot.height}%`,
                        }}
                      >
                        <SlotStickers stickers={draft.stickers} slot={index} />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div
                  className="grid gap-[6px]"
                  style={{ gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: layout.count }).map((_, index) => (
                    

<div
  key={index}
  className={`relative ${
    draft.layout === "polaroid"
      ? "aspect-square"
      : "aspect-[4/3]"
  } bg-[#ded8d2]`}
>


                      <div className="absolute inset-0 overflow-hidden">
                        <PhotoContent photo={photos[index] ?? null} index={index} />
                      </div>
                      <SlotStickers stickers={draft.stickers} slot={index} />
                    </div>
                  ))}
                  {!isPremium && draft.customText?.trim() && (
  <div
    
className="pointer-events-none absolute inset-x-0 bottom-[10px] z-20 px-2 text-center"
  >
    <span
      className={handwritingFont.className}
      style={{
        color: draft.customTextColor ?? "#252525",
        fontSize: `${draft.customTextSize ?? 26}px`,
        lineHeight: 1,
        overflowWrap: "anywhere",
      }}
    >
      {draft.customText}
    </span>
  </div>
)}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl bg-white/90 p-6 shadow-lg">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between gap-3">
                <span>{isLuxury ? selectedLuxuryFrame.name : isPremium ? selectedPremiumFrame?.name : "Frame"}</span>
                <span>Rp{framePrice.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span>Sticker ({stickerCount})</span>
                <span>Rp{(stickerCount * STICKER_PRICE).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between border-t pt-4 text-lg font-bold">
                <span>Total</span>
                <span>Rp{total.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.back()}
              className="mt-8 w-full rounded-full border border-gray-300 px-5 py-3 font-semibold"
            >
              ← Back to Edit
            </button>
            <button
              type="button"
              disabled
              className="mt-3 w-full cursor-not-allowed rounded-full bg-gray-300 px-5 py-3 font-bold text-gray-600"
            >
              CHECKOUT & PAYMENT
            </button>
            <p className="mt-3 text-center text-xs text-gray-500">
              Pembayaran akan diaktifkan setelah integrasi payment gateway.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<main className="p-10 text-center">Memuat preview...</main>}>
      <PreviewContent />
    </Suspense>
  );
}
