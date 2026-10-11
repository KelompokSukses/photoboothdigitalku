"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const BASE_PRICE = 5000;
const STICKER_PRICE = 2000;
const metallicGradients: Record<string, string> = {
  "#D4AF37": "linear-gradient(135deg,#795019 0%,#E6BF61 25%,#FFF1B0 45%,#B17A2E 70%,#F4D98A 100%)",
  "#B76E79": "linear-gradient(135deg,#854A53 0%,#D89A9F 25%,#FFE0D0 45%,#B46B76 70%,#F1B9B2 100%)",
  "#C0C0C0": "linear-gradient(135deg,#737A84 0%,#D7DDE4 25%,#FFFFFF 45%,#929AA5 70%,#E6EBF0 100%)",
};
const stickerCatalog = [
  { name: "King Crown", src: "/stickers/mahkota raja.png" },
  { name: "Queen Crown", src: "/stickers/mahkota ratu.png" },
  { name: "Matcha Cake", src: "/stickers/Matcha Cake.png" },
  { name: "Rainbow Cake", src: "/stickers/Rainbow Cake.png" },
  { name: "Bear Cake", src: "/stickers/Bear Cake.png" },
 { name: "Brown Sugar Boba", src: "/stickers/Brown Sugar Boba.png" },
 { name: "Cat Ice Cream", src: "/stickers/Cat Ice Cream.png" },
{ name: "Chocolate Cake", src: "/stickers/Chocolate Cake.png" },
{ name: "Strawberry Sundae", src: "/stickers/Strawberry Sundae.png" },
  { name: "Red Ribbon", src: "/stickers/Pita Merah.png" },
  { name: "Pink Ribbon", src: "/stickers/Pita Pink.png" },
  { name: "Love Duo", src: "/stickers/Love Duo.png" },
  { name: "Red Love", src: "/stickers/Love Merah.png" },
  { name: "Pink Love", src: "/stickers/Love Pink.png" },
  { name: "Wig 001", src: "/stickers/Wig 001.png" },
  { name: "Wig 002", src: "/stickers/Wig 002.png" },
  { name: "Wig 003", src: "/stickers/Wig 003.png" },
  { name: "Wig 004", src: "/stickers/Wig 004.png" },
  { name: "Wig 005", src: "/stickers/Wig 005.png" },
  { name: "Wig 006", src: "/stickers/Wig 006.png" },
{ name: "Wig 007", src: "/stickers/Wig 007.png" },
{ name: "Wig 008", src: "/stickers/Wig 008.png" },
{ name: "Wig 009", src: "/stickers/Wig 009.png" },
{ name: "Wig 010", src: "/stickers/Wig 010.png" },
{ name: "Wig 011", src: "/stickers/Wig 011.png" },
{ name: "Wig 012", src: "/stickers/Wig 012.png" },
{ name: "Rose", src: "/stickers/Rose.png" },
{ name: "Daisy", src: "/stickers/Daisy.png" },
{ name: "Hydrangea", src: "/stickers/Hydrangea.png" },
{ name: "Sakura", src: "/stickers/Sakura.png" },
{ name: "Sun Flower", src: "/stickers/Sun Flower.png" },
{ name: "Taken", src: "/stickers/Taken.png" },
{ name: "Single", src: "/stickers/Single.png" },
{ name: "Jomblo", src: "/stickers/Jomblo.png" },
{ name: "Complicated", src: "/stickers/Complicated.png" },
{ name: "Bestie", src: "/stickers/Bestie.png" },
{ name: "Good Vibes", src: "/stickers/Good Vibes.png" },
];

type LayoutId = "3cut" | "4cut" | "2x2" | "polaroid";
const layouts: Record<LayoutId, { name: string; count: number; columns: number }> = {
  "3cut": { name: "3 Cut", count: 3, columns: 1 },
  "4cut": { name: "4 Cut", count: 4, columns: 1 },
  "2x2": { name: "2 × 2", count: 4, columns: 2 },
  polaroid: { name: "Polaroid", count: 1, columns: 1 },
};
type Photo = { url: string; key: string; x: number; y: number; zoom: number };
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
// Draft lokal: metadata di localStorage, foto asli di IndexedDB.
const DRAFT_KEY = "photoboothdigitalku-draft-v1";
const PHOTO_DB = "photoboothdigitalku-photos-v1";
type StoredPhoto = { key: string; x: number; y: number; zoom: number } | null;
type Draft = { photos: StoredPhoto[]; stickers: Sticker[]; selectedSlot: number; layout: LayoutId; color: string };

function openPhotoDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PHOTO_DB, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains("photos")) request.result.createObjectStore("photos");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function savePhotoBlob(key: string, blob: Blob) {
  const db = await openPhotoDB();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("photos", "readwrite");
      tx.objectStore("photos").put(blob, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } finally { db.close(); }
}
async function readPhotoBlob(key: string): Promise<Blob | undefined> {
  const db = await openPhotoDB();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("photos", "readonly");
      const req = tx.objectStore("photos").get(key);
      req.onsuccess = () => resolve(req.result as Blob | undefined);
      req.onerror = () => reject(req.error);
    });
  } finally { db.close(); }
}
async function deletePhotoBlob(key: string) {
  const db = await openPhotoDB();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("photos", "readwrite");
      tx.objectStore("photos").delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } finally { db.close(); }
}

type Action = "photo" | "move" | "resize" | "rotate";
type Drag = {
  action: Action;
  pointerId: number;
  slot: number;
  stickerId?: string;
  startX: number;
  startY: number;
  x: number;
  y: number;
  zoom: number;
  rotation: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  distance: number;
  angle: number;
};
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function CreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = searchParams.get("layout") ?? "4cut";
  const layoutId: LayoutId = Object.prototype.hasOwnProperty.call(layouts, requested)
    ? (requested as LayoutId) : "4cut";
  const layout = layouts[layoutId];
  const color = searchParams.get("color") ?? "#FFFFFF";
  const isMetallic = Object.prototype.hasOwnProperty.call(metallicGradients, color);
  const framePrice = BASE_PRICE + (isMetallic ? 1200 : 0);

  const [photos, setPhotos] = useState<(Photo | null)[]>([null, null, null, null]);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [draftError, setDraftError] = useState("");
  const draftPhotosRef = useRef<(Photo | null)[]>([null, null, null, null]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef(photos);
  const dragRef = useRef<Drag | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => { photosRef.current = photos; draftPhotosRef.current = photos; }, [photos]);

  // Restore draft before enabling auto-save, to avoid overwriting saved data.
  useEffect(() => {
    let cancelled = false;
    async function restore() {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) {
          const draft = JSON.parse(raw) as Draft;
          const restored = await Promise.all(
            Array.from({ length: 4 }, async (_, index) => {
              const entry = draft.photos?.[index];
              if (!entry?.key) return null;
              const blob = await readPhotoBlob(entry.key);
              return blob ? { ...entry, url: URL.createObjectURL(blob) } : null;
            })
          );
          if (cancelled) {
            restored.forEach((photo) => { if (photo) URL.revokeObjectURL(photo.url); });
            return;
          }
          setPhotos(restored);
          draftPhotosRef.current = restored;
          setStickers(Array.isArray(draft.stickers) ? draft.stickers : []);
          setSelectedSlot(Math.min(layout.count - 1, Math.max(0, draft.selectedSlot ?? 0)));
        }
      } catch (error) {
        console.error("Gagal membuka draft", error);
        if (!cancelled) setDraftError("Draft belum bisa dipulihkan. Periksa penyimpanan browser.");
      } finally { if (!cancelled) setDraftLoaded(true); }
    }
    void restore();
    return () => {
      cancelled = true;
      draftPhotosRef.current.forEach((photo) => { if (photo?.url.startsWith("blob:")) URL.revokeObjectURL(photo.url); });
    };
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;
    const draft: Draft = {
      photos: photos.map((photo) => photo ? { key: photo.key, x: photo.x, y: photo.y, zoom: photo.zoom } : null),
      stickers, selectedSlot, layout: layoutId, color,
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error("Gagal menyimpan draft", error);
      setDraftError("Penyimpanan browser penuh atau tidak tersedia.");
    }
  }, [draftLoaded, photos, stickers, selectedSlot, layoutId, color]);

  const stickerTotal = stickers.filter((sticker) => sticker.slot < layout.count).length * STICKER_PRICE;
  const totalPrice = framePrice + stickerTotal;
  const selectedPhoto = photos[Math.min(selectedSlot, layout.count - 1)];
  const uploadedCount = photos.slice(0, layout.count).filter(Boolean).length;
  const allPhotosReady = uploadedCount === layout.count;

  function updatePhoto(index: number, updates: Partial<Photo>) {
    setPhotos((old) => old.map((photo, i) => i === index && photo ? { ...photo, ...updates } : photo));
  }
  function updateSticker(id: string, updates: Partial<Sticker>) {
    setStickers((old) => old.map((sticker) => sticker.id === id ? { ...sticker, ...updates } : sticker));
  }
  function addSticker(name: string, src: string) {
    const activeSlot = Math.min(selectedSlot, layout.count - 1);
    const newSticker: Sticker = {
      id: crypto.randomUUID(), name, src, slot: activeSlot,
      x: 50, y: 50, zoom: 1, rotation: 0,
    };
    setStickers((old) => [...old, newSticker]);
    setSelectedStickerId(newSticker.id);
  }
  function deleteSticker(id: string) {
    setStickers((old) => old.filter((sticker) => sticker.id !== id));
    setSelectedStickerId(null);
  }
  async function handleUpload(files: FileList | null) {
    if (!files?.length || !draftLoaded) return;
    const valid = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (!valid.length) { alert("Pilih file gambar yang valid."); return; }
    const next = [...photosRef.current];
    let slot = selectedSlot;
    try {
      for (const file of valid) {
  if (slot >= layout.count) break;

  const key = crypto.randomUUID();

  await savePhotoBlob(key, file);

  next[slot] = {
    key,
    url: URL.createObjectURL(file),
    x: 0,
    y: 0,
    zoom: 1,
  };

  slot++;
}
      const existing = localStorage.getItem(DRAFT_KEY);
      const previousDraft = existing ? JSON.parse(existing) as Draft : null;
      const immediateDraft: Draft = {
        photos: next.map((photo) => photo ? { key: photo.key, x: photo.x, y: photo.y, zoom: photo.zoom } : null),
        stickers: previousDraft?.stickers ?? stickers,
        selectedSlot,
        layout: layoutId,
        color,
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(immediateDraft));
      setPhotos(next);
      photosRef.current = next;
      setDraftError("");
    } catch (error) {
      console.error("Gagal menyimpan foto", error);
      setDraftError("Foto gagal disimpan di browser. Cek ruang penyimpanan.");
      // Do not expose an unsaved photo as if it were safely stored.
      next.forEach((photo, index) => {
        if (photo && !photosRef.current[index]) {
          URL.revokeObjectURL(photo.url);
          void deletePhotoBlob(photo.key);
        }
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
  function removePhoto(index: number) {
    const old = photosRef.current[index];
    setPhotos((previous) => previous.map((photo, i) => i === index ? null : photo));
    if (old) {
      // Delay cleanup until metadata has been persisted.
      window.setTimeout(() => {
        if (old.url.startsWith("blob:")) URL.revokeObjectURL(old.url);
        void deletePhotoBlob(old.key);
      }, 300);
    }
  }

  function beginAction(event: ReactPointerEvent<HTMLElement>, action: Action, slot: number, sticker?: Sticker) {
    event.stopPropagation();
    event.preventDefault();
    const slotElement = sticker
  ? slotRefs.current[slot]
  : (event.currentTarget as HTMLElement).closest("[data-photo-slot]") as HTMLElement | null;
    if (!slotElement) return;
    const rect = slotElement.getBoundingClientRect();
    const photo = photos[slot];
    if (action === "photo" && !photo) { setSelectedSlot(slot); setSelectedStickerId(null); return; }
    const x = sticker ? sticker.x : (photo?.x ?? 0);
    const y = sticker ? sticker.y : (photo?.y ?? 0);
    const centerX = rect.left + (sticker ? sticker.x / 100 * rect.width : rect.width / 2);
    const centerY = rect.top + (sticker ? sticker.y / 100 * rect.height : rect.height / 2);
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    dragRef.current = {
      action, pointerId: event.pointerId, slot, stickerId: sticker?.id,
      startX: event.clientX, startY: event.clientY, x, y,
      zoom: sticker?.zoom ?? photo?.zoom ?? 1, rotation: sticker?.rotation ?? 0,
      width: rect.width, height: rect.height, centerX, centerY,
      distance: Math.max(1, Math.hypot(dx, dy)), angle: Math.atan2(dy, dx),
    };
    setSelectedSlot(slot);
    setSelectedStickerId(sticker?.id ?? null);
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveAction(event: ReactPointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.stopPropagation();
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (drag.action === "photo") {
      updatePhoto(drag.slot, { x: drag.x + dx, y: drag.y + dy });
    } else if (drag.stickerId) {
     if (drag.action === "move") {
  updateSticker(drag.stickerId, {
    x: drag.x + (dx / drag.width) * 100,
    y: drag.y + (dy / drag.height) * 100,
  });
}
      else if (drag.action === "resize") {
        const distance = Math.hypot(event.clientX - drag.centerX, event.clientY - drag.centerY);
        updateSticker(drag.stickerId, { zoom: clamp(drag.zoom * distance / drag.distance, 0.2, 20) });
      } else if (drag.action === "rotate") {
        const angle = Math.atan2(event.clientY - drag.centerY, event.clientX - drag.centerX);
        const difference = (angle - drag.angle) * 180 / Math.PI;
        updateSticker(drag.stickerId, { rotation: ((drag.rotation + difference) % 360 + 360) % 360 });
      }
    }
  }
  function endAction(event: ReactPointerEvent<HTMLElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    event.stopPropagation();
    dragRef.current = null;
  }

  return (
   <main className="min-h-screen bg-cover bg-center bg-fixed px-4 py-6 text-[#292929]" style={{ backgroundImage: "url('/backgroundcreate.jpg')" }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => router.push("/booth")} className="text-sm font-medium hover:underline">← Back</button>
          <span className="text-xs font-bold tracking-[0.2em] text-[#96764f]">PHOTOBOOTH DIGITALKU</span>
        </div>
        {draftError && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{draftError}</p>}
        {!draftLoaded && <p className="mt-3 text-center text-sm text-gray-600">Memulihkan draft...</p>}
        <div className="mt-5 text-center">
          <h1 className="text-3xl font-bold">Create Your Photobooth</h1>
          <p className="mt-2 text-sm text-gray-600">Upload foto, lalu hias langsung di preview.</p>
        </div>
        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-2xl bg-white/90 p-5 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold">01. Upload Your Photos</h2>
                <p className="mt-1 text-sm text-gray-600">{layout.name} · {uploadedCount}/{layout.count} foto</p>
              </div>
              <button type="button" disabled={!draftLoaded} onClick={() => fileInputRef.current?.click()} className="rounded-lg bg-[#252525] px-4 py-2 text-xs font-semibold text-white hover:bg-[#444444]">+ Upload Foto</button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple={layout.count > 1} className="hidden" onChange={(event) => handleUpload(event.target.files)} />
            <p className="mt-2 text-right text-[11px] text-gray-500">JPG, PNG, WEBP · Pilih slot sebelum upload</p>

            <h3 className="mt-6 text-sm font-bold">02. Pilih Slot Foto</h3>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {Array.from({ length: layout.count }).map((_, index) => (
                <button key={index} type="button" onClick={() => { setSelectedSlot(index); setSelectedStickerId(null); }} className={`rounded-lg border-2 px-2 py-3 text-xs font-semibold ${selectedSlot === index ? "border-[#b58b50] bg-[#f7ead4]" : "border-gray-200 bg-gray-50"}`}>
                  Slot {index + 1}<span className="mt-1 block text-[10px] font-normal">{photos[index] ? "Terisi" : "Kosong"}</span>
                </button>
              ))}
            </div>

            <h3 className="mt-6 text-sm font-bold">03. Atur Posisi Foto</h3>
            {selectedPhoto ? (
              <div className="mt-3 space-y-3">
                <div className="flex justify-between text-xs"><span>Zoom Foto</span><span>{Math.round(selectedPhoto.zoom * 100)}%</span></div>
                <input type="range" min="1" max="3" step="0.05" value={selectedPhoto.zoom} onChange={(event) => updatePhoto(selectedSlot, { zoom: Number(event.target.value) })} className="w-full accent-[#b58b50]" />
                <p className="text-xs text-gray-500">Geser foto langsung di preview untuk mengatur posisi wajah.</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => updatePhoto(selectedSlot, { x: 0, y: 0, zoom: 1 })} className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold">Reset Posisi</button>
                  <button type="button" onClick={() => removePhoto(selectedSlot)} className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600">Hapus Foto</button>
                </div>
              </div>
            ) : <p className="mt-3 rounded-lg bg-gray-100 p-3 text-xs text-gray-500">Upload foto ke slot terpilih untuk mulai mengedit.</p>}

            <div className="mt-7 border-t border-gray-200 pt-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold">04. Sticker Shop</h3>
                <span className="rounded-full bg-[#f7ead4] px-3 py-1 text-xs font-semibold text-[#8d6737]">Rp2.000 / sticker</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">Pilih slot foto, klik stiker, lalu edit langsung di preview. Setiap salinan dihitung satu stiker.</p>
              <div className="mt-3 grid max-h-[300px] grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-5">
                {stickerCatalog.map((item) => (
                  <button key={item.src} type="button" onClick={() => addSticker(item.name, item.src)} className="flex min-w-0 flex-col items-center rounded-xl border border-gray-200 bg-white p-1.5 transition hover:border-[#b58b50] hover:bg-[#fff8ed]">
                    <div className="flex h-12 w-full items-center justify-center rounded-lg bg-[#f5f1ed]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={encodeURI(item.src)} alt={item.name} className="h-10 w-10 object-contain" />
                    </div>
                    <span className="mt-1 line-clamp-2 min-h-[26px] text-center text-[10px] font-semibold leading-3">{item.name}</span>
                    <span className="text-[10px] text-[#a47a46]">+Rp2.000</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">Pilih stiker pada preview untuk menampilkan kontrol: × hapus, ↻ putar, ↗ perbesar/perkecil.</p>
            </div>
          </section>

          <section className="rounded-2xl bg-white/90 p-5 shadow-md lg:sticky lg:top-4">
            <h2 className="text-base font-bold">05. Preview Your Frame</h2>
            <div className="mt-4 space-y-2 rounded-xl border border-[#eadbc5] bg-[#fbf7f0] p-4 text-sm">
              <div className="flex justify-between gap-3"><span>{layout.name} · {isMetallic ? "Metallic" : "Standard"}</span><span>Rp{framePrice.toLocaleString("id-ID")}</span></div>
              <div className="flex justify-between gap-3"><span>Sticker ({stickers.filter((sticker) => sticker.slot < layout.count).length} × Rp2.000)</span><span>Rp{stickerTotal.toLocaleString("id-ID")}</span></div>
              <div className="flex justify-between border-t border-[#eadbc5] pt-3 text-lg font-bold"><span>Total</span><span className="text-[#a47a46]">Rp{totalPrice.toLocaleString("id-ID")}</span></div>
            </div>
            <div className="mt-4 flex min-h-[360px] items-center justify-center rounded-xl bg-gradient-to-br from-[#D8DCE0] via-[#E8DDE3] to-[#F2D6E2] p-3 sm:p-5">
  <div
    ref={stripRef}
    className="relative flex w-full max-w-[300px] flex-col gap-[6px] overflow-hidden p-[9px] shadow-xl"
    style={{ background: metallicGradients[color] ?? color }}
  >
    {/* LAYER FOTO */}
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
            ref={(element) => {
              slotRefs.current[index] = element;
            }}
            data-photo-slot
            className={`relative aspect-[4/3] overflow-hidden bg-[#ded8d2] touch-none ${
              selectedSlot === index
                ? "outline outline-2 outline-offset-[-2px] outline-[#b58b50]"
                : ""
            }`}
            onPointerDown={(event) => beginAction(event, "photo", index)}
            onPointerMove={moveAction}
            onPointerUp={endAction}
            onPointerCancel={endAction}
          >
            {photo ? (
              <img
                src={photo.url}
                alt={`Photo ${index + 1}`}
                draggable={false}
                className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
                style={{
                  transform: `translate(${photo.x}px, ${photo.y}px) scale(${photo.zoom})`,
                }}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                <span className="text-xl">+</span>
                <span className="text-xs">Photo {index + 1}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>

    

    
    <div className="pointer-events-none absolute inset-0 z-30">
      {stickers
        .filter((sticker) => sticker.slot < layout.count)
        .map((sticker) => {
          const selected = selectedStickerId === sticker.id;
          const slotElement = slotRefs.current[sticker.slot];
          const stripElement = stripRef.current;

          if (!slotElement || !stripElement) return null;

          const slotRect = slotElement.getBoundingClientRect();
          const stripRect = stripElement.getBoundingClientRect();

          const x =
            slotRect.left -
            stripRect.left +
            (sticker.x / 100) * slotRect.width;

          const y =
            slotRect.top -
            stripRect.top +
            (sticker.y / 100) * slotRect.height;

          return (
            <div
              key={sticker.id}
              className="pointer-events-auto absolute touch-none"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${30 * sticker.zoom}px`,
                height: `${30 * sticker.zoom}px`,
                transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
              }}
              onPointerDown={(event) =>
                beginAction(event, "move", sticker.slot, sticker)
              }
              onPointerMove={moveAction}
              onPointerUp={endAction}
              onPointerCancel={endAction}
            >
              <img
                src={encodeURI(sticker.src)}
                alt={sticker.name}
                draggable={false}
                className="pointer-events-none h-full w-full select-none object-contain"
              />

              {selected && (
                <>
                  <div className="pointer-events-none absolute inset-0 border border-dashed border-[#b58b50]" />

                  <button
                    type="button"
                    aria-label="Hapus stiker"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteSticker(sticker.id);
                    }}
                    className="absolute -left-2 -top-2 z-30 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[11px] text-white shadow"
                  >
                    ×
                  </button>

                  <div
                    title="Putar stiker"
                    onPointerDown={(event) =>
                      beginAction(event, "rotate", sticker.slot, sticker)
                    }
                    onPointerMove={moveAction}
                    onPointerUp={endAction}
                    onPointerCancel={endAction}
                    className="absolute -right-2 -top-2 z-30 flex h-4 w-4 cursor-grab touch-none items-center justify-center rounded-full bg-[#b58b50] text-[10px] text-white shadow"
                  >
                    ↻
                  </div>

                  <div
                    title="Ubah ukuran stiker"
                    onPointerDown={(event) =>
                      beginAction(event, "resize", sticker.slot, sticker)
                    }
                    onPointerMove={moveAction}
                    onPointerUp={endAction}
                    onPointerCancel={endAction}
                    className="absolute -bottom-2 -right-2 z-30 flex h-4 w-4 cursor-nwse-resize touch-none items-center justify-center rounded-full bg-[#b58b50] text-[10px] text-white shadow"
                  >
                    ↗
                  </div>
                </>
              )}
            </div>
          );
        })}
    </div>
  </div>
</div>

            <button type="button" disabled={!allPhotosReady} onClick={() => router.push("/preview")} className={`mt-5 w-full rounded-full px-6 py-4 text-sm font-bold shadow-lg ${allPhotosReady ? "bg-gradient-to-r from-[#b68a49] via-[#f4dca5] to-[#b68a49] text-black hover:brightness-105" : "cursor-not-allowed bg-gray-300 text-gray-500"}`}>{allPhotosReady ? "CONTINUE →" : `UPLOAD ${layout.count - uploadedCount} FOTO LAGI`}</button>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function CreatePage() {
  return <Suspense fallback={<div className="p-8 text-center">Loading photobooth...</div>}><CreateContent /></Suspense>;
}
