
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LayoutId = "3cut" | "4cut" | "2x2" | "polaroid";

type StoredPhoto = {
  key: string;
  x: number;
  y: number;
  zoom: number;
} | null;

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
  photos: StoredPhoto[];
  stickers: Sticker[];
  layout: LayoutId;
  color: string;
};

type PreviewPhoto = {
  url: string;
  x: number;
  y: number;
  zoom: number;
} | null;

const DRAFT_KEY = "photoboothdigitalku-draft-v1";
const PHOTO_DB = "photoboothdigitalku-photos-v1";

const layouts = {
  "3cut": { count: 3, columns: 1 },
  "4cut": { count: 4, columns: 1 },
  "2x2": { count: 4, columns: 2 },
  polaroid: { count: 1, columns: 1 },
};

const metallicGradients: Record<string, string> = {
  "#D4AF37":
    "linear-gradient(135deg,#795019 0%,#E6BF61 25%,#FFF1B0 45%,#B17A2E 70%,#F4D98A 100%)",
  "#B76E79":
    "linear-gradient(135deg,#854A53 0%,#D89A9F 25%,#FFE0D0 45%,#B46B76 70%,#F1B9B2 100%)",
  "#C0C0C0":
    "linear-gradient(135deg,#737A84 0%,#D7DDE4 25%,#FFFFFF 45%,#929AA5 70%,#E6EBF0 100%)",
};

export default function PreviewPage() {
  const router = useRouter();

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
        if (!layouts[saved.layout]) return;

        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          const request = indexedDB.open(PHOTO_DB, 1);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        try {
          const restored = await Promise.all(
            saved.photos.map(async (photo) => {
              if (!photo) return null;

              const blob = await new Promise<Blob | undefined>(
                (resolve, reject) => {
                  const tx = db.transaction("photos", "readonly");
                  const request = tx.objectStore("photos").get(photo.key);

                  request.onsuccess = () => resolve(request.result);
                  request.onerror = () => reject(request.error);
                }
              );

              if (!blob) return null;

              const url = URL.createObjectURL(blob);
              objectUrls.push(url);

              return {
                url,
                x: photo.x,
                y: photo.y,
                zoom: photo.zoom,
              };
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

  if (loading) {
    return <main className="p-10 text-center">Memuat preview...</main>;
  }

  if (!draft) {
    return (
      <main className="p-10 text-center">
        <p>Draft photobooth tidak ditemukan.</p>
        <button onClick={() => router.push("/create")}>
          Kembali ke Create
        </button>
      </main>
    );
  }

  const layout = layouts[draft.layout];
  const isMetallic = !!metallicGradients[draft.color];
  const framePrice = 5000 + (isMetallic ? 1200 : 0);
  const stickerCount = draft.stickers.filter(
    (sticker) => sticker.slot < layout.count
  ).length;
  const total = framePrice + stickerCount * 2000;

  return (
   <main
  className="min-h-screen bg-cover bg-center bg-fixed px-4 py-8 text-[#292929]"
  style={{ backgroundImage: "url('/backgroundcreate.jpg')" }}
>
      <div className="mx-auto max-w-5xl">

  <button
    type="button"
    onClick={() => router.back()}
    className="mb-5 flex items-center gap-2 rounded-full bg-white/80 px-5 py-2.5 text-sm font-semibold text-[#292929] shadow-md transition hover:bg-white"
  >
    ← Back to Create
  </button>

  <h1 className="text-center text-3xl font-bold">
    Your Photobooth Preview
  </h1>

        <p className="mt-2 text-center text-sm text-gray-600">
          Periksa hasil photobooth sebelum checkout.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
         <section className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#D8DCE0] via-[#E8DDE3] to-[#F2D6E2] p-6 shadow-lg">
            <div
              className="relative flex w-full max-w-[300px] flex-col gap-[6px] overflow-hidden p-[9px] shadow-xl"
              style={{
                background:
                  metallicGradients[draft.color] ?? draft.color,
              }}
            >
              <div
                className="grid gap-[6px]"
                style={{
                  gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: layout.count }).map((_, index) => {
                  const photo = photos[index];

                  return (
                    <div
                      key={index}
                      className="relative aspect-[4/3] overflow-hidden bg-[#ded8d2]"
                    >
                      {photo && (
                        <img
                          src={photo.url}
                          alt={`Photo ${index + 1}`}
                          className="absolute inset-0 h-full w-full object-cover"
                          style={{
                            transform: `translate(${photo.x}px, ${photo.y}px) scale(${photo.zoom})`,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

            
            </div>
          </section>

          <section className="rounded-2xl bg-white/90 p-6 shadow-lg">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between">
                <span>Frame</span>
                <span>Rp{framePrice.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between">
                <span>Sticker ({stickerCount})</span>
                <span>Rp{(stickerCount * 2000).toLocaleString("id-ID")}</span>
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
