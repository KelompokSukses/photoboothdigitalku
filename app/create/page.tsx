"use client";
import { Caveat } from "next/font/google";

const handwritingFont = Caveat({
  subsets: ["latin"],
  display: "swap",
});
import { Suspense, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { premiumFrames } from "@/lib/premiumFrames";
import { luxuryFrames } from "@/lib/luxuryFrames";
import { premiumFrameGeometry } from "@/lib/premiumFrameGeometry";
const BASE_PRICE = 5000;
const STICKER_PRICE = 2000;

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

const stickerCatalog = [
    { name: "King Crown", src: "/stickers/mahkota raja.png" },
    { name: "Queen Crown", src: "/stickers/mahkota ratu.png" },
    { name: "Matcha Cake", src: "/stickers/Matcha Cake.png" },
    { name: "Rainbow Cake", src: "/stickers/Rainbow Cake.png" },
    { name: "Bear Cake", src: "/stickers/Bear Cake.png" },
    { name: "Bear Merah", src: "/stickers/Bear Merah.png" },
    { name: "Bear Pink", src: "/stickers/Bear Pink.png" },
    { name: "Brown Sugar Boba", src: "/stickers/Brown Sugar Boba.png" },
    { name: "Cat Ice Cream", src: "/stickers/Cat Ice Cream.png" },
    { name: "Chocolate Cake", src: "/stickers/Chocolate Cake.png" },
    { name: "Strawberry Sundae", src: "/stickers/Strawberry Sundae.png" },
    { name: "Red Ribbon", src: "/stickers/Pita Merah.png" },
    { name: "Pink Ribbon", src: "/stickers/Pita Pink.png" },
    { name: "Love Duo", src: "/stickers/Love Duo.png" },
    { name: "Red Love", src: "/stickers/Love Merah.png" },
    { name: "Pink Love", src: "/stickers/Love Pink.png" },
     { name: "Love", src: "/stickers/Love 001.png" },
    { name: "Rabbit", src: "/stickers/Rabbit.png" },
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
 { name: "Eye Liner 001", src: "/stickers/Eye Liner 001.png" },
{ name: "Eye Liner 001a", src: "/stickers/Eye Liner 001a.png" },
{ name: "Eye Liner 002", src: "/stickers/Eye Liner 002.png" },
{ name: "Eye Liner 002a", src: "/stickers/Eye Liner 002a.png" },
{ name: "Eye Liner 003", src: "/stickers/Eye Liner 003.png" },
{ name: "Eye Liner 003a", src: "/stickers/Eye Liner 003a.png" },
{ name: "Eye Liner 004", src: "/stickers/Eye Liner 004.png" },
{ name: "Eye Liner 004a", src: "/stickers/Eye Liner 004a.png" },
{ name: "Eye Liner 005", src: "/stickers/Eye Liner 005.png" },
{ name: "Eye Liner 005a", src: "/stickers/Eye Liner 005a.png" },
{ name: "Eye Liner 006", src: "/stickers/Eye Liner 006.png" },
{ name: "Eye Liner 006a", src: "/stickers/Eye Liner 006a.png" },
    { name: "Rose", src: "/stickers/Rose.png" },
    { name: "Daisy", src: "/stickers/Daisy.png" },
    { name: "Hydrangea", src: "/stickers/Hydrangea.png" },
    { name: "Sakura", src: "/stickers/Sakura.png" },
    { name: "Sun Flower", src: "/stickers/Sun Flower.png" },
{ name: "Flower 001", src: "/stickers/Flower 001.png" },
{ name: "Flower 002", src: "/stickers/Flower 002.png" },
{ name: "Flower 003", src: "/stickers/Flower 003.png" },
{ name: "Flower 004", src: "/stickers/Flower 004.png" },
{ name: "Font 001", src: "/stickers/Flower 001.png" },
{ name: "Font 002", src: "/stickers/Flower 001.png" },
{ name: "Font 003", src: "/stickers/Flower 003.png" },
{ name: "Font 004", src: "/stickers/Flower 004.png" },
{ name: "Font 005", src: "/stickers/Flower 005.png" },
{ name: "Font 006", src: "/stickers/Flower 006.png" },
    { name: "Taken", src: "/stickers/Taken.png" },
    { name: "Single", src: "/stickers/Single.png" },
    { name: "Jomblo", src: "/stickers/Jomblo.png" },
    { name: "Complicated", src: "/stickers/Complicated.png" },
    { name: "Bestie", src: "/stickers/Bestie.png" },
    { name: "Good Vibes", src: "/stickers/Good Vibes.png" },
    { name: "Still Looking", src: "/stickers/Still Looking.png" },
    { name: "Moai", src: "/stickers/Moai.png" },
    { name: "Statue", src: "/stickers/Statue.png" },
    { name: "Liberti", src: "/stickers/Liberti.png" },
];
type LayoutId = "3cut" | "4cut" | "2x2" | "polaroid";
const layouts: Record<LayoutId, {
    name: string;
    count: number;
    columns: number;
}> = {
    "3cut": { name: "3 Cut", count: 3, columns: 1 },
    "4cut": { name: "4 Cut", count: 4, columns: 1 },
    "2x2": { name: "2 × 2", count: 4, columns: 2 },
    polaroid: { name: "Polaroid", count: 1, columns: 1 },
};
type Photo = {
    url: string;
    key: string;
    x: number;
    y: number;
    zoom: number;
};
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
type StoredPhoto = {
    key: string;
    x: number;
    y: number;
    zoom: number;
} | null;
type Draft = {
    customText?: string;
  customTextColor?: string;
  customTextSize?: number;
    photos: StoredPhoto[];
    stickers: Sticker[];
    selectedSlot: number;
    layout: LayoutId;
    color: string;
    frameType?: "original" | "premium" | "luxury";
    luxuryFrameId?: string;
};
function openPhotoDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(PHOTO_DB, 1);
        request.onupgradeneeded = () => {
            if (!request.result.objectStoreNames.contains("photos"))
                request.result.createObjectStore("photos");
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
    }
    finally {
        db.close();
    }
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
    }
    finally {
        db.close();
    }
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
    }
    finally {
        db.close();
    }
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

// =====================================================
// CREATE PAGE
// =====================================================

function CreateContent() {
  // ---------------------------------------------------
  // 1. ROUTER & FRAME SELECTION
  // ---------------------------------------------------

  const router = useRouter();
  const searchParams = useSearchParams();

  const frameType = searchParams.get("frameType") === "luxury"
    ? "luxury" : searchParams.get("frameType") === "premium" ? "premium" : "original";
  const luxuryFrameId = searchParams.get("luxuryFrameId") ?? "luxury-001";
  const selectedLuxuryFrame = luxuryFrames.find((frame) => frame.id === luxuryFrameId) ?? luxuryFrames[0];

  const premiumFrameId = searchParams.get("premiumFrameId");

  const selectedPremiumFrame =
  frameType === "premium"
    ? premiumFrames.find((frame) => frame.id === premiumFrameId)
    : undefined;

const selectedPremiumGeometry =
  frameType === "premium" && selectedPremiumFrame
    ? premiumFrameGeometry[selectedPremiumFrame.id]
    : undefined;

const premiumPhotoSlots = selectedPremiumGeometry?.slots ?? [];
  // ---------------------------------------------------
  // 2. LAYOUT & COLOR
  // ---------------------------------------------------

  const requested = searchParams.get("layout") ?? "4cut";

  const layoutId: LayoutId =
    Object.prototype.hasOwnProperty.call(layouts, requested)
      ? (requested as LayoutId)
      : "4cut";

  const layout =
    frameType === "luxury"
      ? { name: "Luxury 1 Photo", count: 1, columns: 1 }
      : frameType === "premium"
      ? { name: "Premium 3 Cut", count: 3, columns: 1 }
      : layouts[layoutId];

  const color = searchParams.get("color") ?? "#FFFFFF";
  console.log("WARNA DARI BOOTH:", color);
console.log("GRADASI TERBACA:", metallicGradients[color]);

  const metallicColorCodes = [
  "#D4AF37",
  "#B76E79",
  "#C0C0C0",
];

const premiumColorCodes = [
  "#B8E6F5",
  "#F5F0EB",
  "#358C98",
  "#69449E",
];

const isMetallic = metallicColorCodes.includes(color);
const isPremiumColor = premiumColorCodes.includes(color);

  // ---------------------------------------------------
  // 3. FRAME PRICE
  // ---------------------------------------------------

  const framePrice =
  frameType === "luxury" ? 10000 :
  frameType === "premium"
    ? (selectedPremiumFrame?.price ?? 6900)
    : BASE_PRICE +
      (isPremiumColor ? 1500 : isMetallic ? 1200 : 0);

  // ---------------------------------------------------
  // 4. PHOTO & STICKER STATES
  // ---------------------------------------------------

  const [photos, setPhotos] = useState<(Photo | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [customText, setCustomText] = useState("");
  const [customTextColor, setCustomTextColor] = useState("#252525");
  const [customTextSize, setCustomTextSize] = useState(26);
  const [selectedSlot, setSelectedSlot] = useState(0);

  const [selectedStickerId, setSelectedStickerId] = useState<
    string | null
  >(null);

  const [draftLoaded, setDraftLoaded] = useState(false);
  const [draftError, setDraftError] = useState("");

  // ---------------------------------------------------
  // 5. PHOTO & CAMERA REFERENCES
  // ---------------------------------------------------

  const draftPhotosRef = useRef<(Photo | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // ---------------------------------------------------
  // 6. PREVIEW & DRAG REFERENCES
  // ---------------------------------------------------

  const photosRef = useRef(photos);
  const dragRef = useRef<Drag | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ---------------------------------------------------
  // 7. SYNCHRONIZE PHOTO REFERENCES
  // ---------------------------------------------------

  useEffect(() => {
    photosRef.current = photos;
    draftPhotosRef.current = photos;
  }, [photos]);

  // ---------------------------------------------------
  // 8. RESTORE SAVED DRAFT
  // ---------------------------------------------------

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

              if (!entry?.key) {
                return null;
              }

              const blob = await readPhotoBlob(entry.key);

              return blob
                ? { ...entry, url: URL.createObjectURL(blob) }
                : null;
            })
          );

          if (cancelled) {
            restored.forEach((photo) => {
              if (photo) {
                URL.revokeObjectURL(photo.url);
              }
            });

            return;
          }

          setPhotos(restored);
          draftPhotosRef.current = restored;

          setStickers(
            Array.isArray(draft.stickers) ? draft.stickers : []
          );
setCustomText(draft.customText ?? "");
setCustomTextColor(draft.customTextColor ?? "#252525");
setCustomTextSize(draft.customTextSize ?? 26);
          setSelectedSlot(
            Math.min(
              layout.count - 1,
              Math.max(0, draft.selectedSlot ?? 0)
            )
          );
        }
      } catch (error) {
        console.error("Gagal membuka draft", error);

        if (!cancelled) {
          setDraftError(
            "Draft belum bisa dipulihkan. Periksa penyimpanan browser."
          );
        }
      } finally {
        if (!cancelled) {
          setDraftLoaded(true);
        }
      }
    }

  
                 void restore();

    return () => {
      cancelled = true;

      draftPhotosRef.current.forEach((photo) => {
        if (photo?.url.startsWith("blob:")) {
          URL.revokeObjectURL(photo.url);
        }
      });
    };
  }, []);

  // ---------------------------------------------------
  // 9. AUTO SAVE DRAFT
  // ---------------------------------------------------

  useEffect(() => {
    if (!draftLoaded) return;

    const draft: Draft = {
      customText,
customTextColor,
customTextSize,
      photos: photos.map((photo) =>
        photo
          ? {
              key: photo.key,
              x: photo.x,
              y: photo.y,
              zoom: photo.zoom,
            }
          : null
      ),
      stickers,
      selectedSlot,
      layout: layoutId,
      color,
      frameType,
      luxuryFrameId: frameType === "luxury" ? selectedLuxuryFrame.id : undefined,
    };

    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error("Gagal menyimpan draft", error);
      setDraftError("Penyimpanan browser penuh atau tidak tersedia.");
    }
  }, [
  draftLoaded,
  photos,
  stickers,
  selectedSlot,
  layoutId,
  color,
  customText,
  customTextColor,
    customTextSize,
   frameType,
   luxuryFrameId,
]);

  // ---------------------------------------------------
  // 10. PRICE & PHOTO STATUS
  // ---------------------------------------------------

  const stickerTotal =
    stickers.filter((sticker) => sticker.slot < layout.count).length *
    STICKER_PRICE;

  const totalPrice = framePrice + stickerTotal;

  const selectedPhoto =
    photos[Math.min(selectedSlot, layout.count - 1)];

  const uploadedCount =
    photos.slice(0, layout.count).filter(Boolean).length;

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
        if (!files?.length || !draftLoaded)
            return;
        const valid = Array.from(files).filter((file) => file.type.startsWith("image/"));
        if (!valid.length) {
            alert("Pilih file gambar yang valid.");
            return;
        }
        const next = [...photosRef.current];
        let slot = selectedSlot;
        try {
            for (const file of valid) {
                if (slot >= layout.count)
                    break;
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
  photos: next.map((photo) =>
    photo
      ? {
          key: photo.key,
          x: photo.x,
          y: photo.y,
          zoom: photo.zoom,
        }
      : null
  ),
  stickers: previousDraft?.stickers ?? stickers,
  selectedSlot,
  layout: layoutId,
  color,
  customText,
  customTextColor,
  customTextSize,
  frameType,
  luxuryFrameId: frameType === "luxury" ? selectedLuxuryFrame.id : undefined,
};
            localStorage.setItem(DRAFT_KEY, JSON.stringify(immediateDraft));
            setPhotos(next);
            photosRef.current = next;
            setDraftError("");
        }
        catch (error) {
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
        if (fileInputRef.current)
            fileInputRef.current.value = "";
    }
    // Camera: video is mounted before the stream is attached.
    useEffect(() => {
        if (!cameraOpen)
            return;
        let cancelled = false;
        async function startCamera() {
            try {
                if (!navigator.mediaDevices?.getUserMedia) {
                    throw new Error("Browser tidak mendukung akses kamera.");
                }
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" },
                    audio: false,
                });
                if (cancelled) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }
                cameraStreamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }
            }
            catch (error) {
                if (!cancelled) {
                    console.error("Gagal membuka kamera", error);
                    setCameraError("Kamera tidak bisa dibuka. Periksa izin kamera di browser.");
                    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
                    cameraStreamRef.current = null;
                }
            }
        }
        void startCamera();
        return () => {
            cancelled = true;
            cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
            cameraStreamRef.current = null;
            if (videoRef.current)
                videoRef.current.srcObject = null;
        };
    }, [cameraOpen]);
    function openCamera() {
  setCameraError("");
  setCameraOpen(true);
}
    function closeCamera() {
        cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
        if (videoRef.current)
            videoRef.current.srcObject = null;
        setCameraOpen(false);
        setCameraError("");
    }
    async function capturePhoto() {
        const video = videoRef.current;
        if (!video || !video.videoWidth || !video.videoHeight)
            return;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (!context)
            return;
        context.drawImage(video, 0, 0);
        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, "image/jpeg", 0.92);
        });
        if (!blob)
            return;
        const file = new File([blob], `camera-${Date.now()}.jpg`, {
            type: "image/jpeg",
        });
        const transfer = new DataTransfer();
        transfer.items.add(file);
        await handleUpload(transfer.files);
        closeCamera();
    }
    function removePhoto(index: number) {
        const old = photosRef.current[index];
        setPhotos((previous) => previous.map((photo, i) => i === index ? null : photo));
        if (old) {
            // Delay cleanup until metadata has been persisted.
            window.setTimeout(() => {
                if (old.url.startsWith("blob:"))
                    URL.revokeObjectURL(old.url);
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
        if (!slotElement)
            return;
        const rect = slotElement.getBoundingClientRect();
        const photo = photos[slot];
        if (action === "photo" && !photo) {
            setSelectedSlot(slot);
            setSelectedStickerId(null);
            return;
        }
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
        if (!drag || drag.pointerId !== event.pointerId)
            return;
        event.stopPropagation();
        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        if (drag.action === "photo") {
            updatePhoto(drag.slot, { x: drag.x + dx, y: drag.y + dy });
        }
        else if (drag.stickerId) {
            if (drag.action === "move") {
                updateSticker(drag.stickerId, {
                    x: drag.x + (dx / drag.width) * 100,
                    y: drag.y + (dy / drag.height) * 100,
                });
            }
            else if (drag.action === "resize") {
                const distance = Math.hypot(event.clientX - drag.centerX, event.clientY - drag.centerY);
                updateSticker(drag.stickerId, { zoom: clamp(drag.zoom * distance / drag.distance, 0.2, 20) });
            }
            else if (drag.action === "rotate") {
                const angle = Math.atan2(event.clientY - drag.centerY, event.clientX - drag.centerX);
                const difference = (angle - drag.angle) * 180 / Math.PI;
                updateSticker(drag.stickerId, { rotation: ((drag.rotation + difference) % 360 + 360) % 360 });
            }
        }
    }
    function endAction(event: ReactPointerEvent<HTMLElement>) {
        if (dragRef.current?.pointerId !== event.pointerId)
            return;
        event.stopPropagation();
        dragRef.current = null;
    }
    return (<main className="min-h-screen bg-cover bg-center bg-fixed px-4 py-6 text-[#292929]" style={{ backgroundImage: "url('/backgroundcreate.jpg')" }}>
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
             
    <div className="flex flex-wrap gap-2">
  <button type="button" disabled={!draftLoaded} onClick={openCamera} className="rounded-lg bg-[#b58b50] px-4 py-2 text-xs font-semibold text-white hover:brightness-105 disabled:opacity-50">
    📷 Ambil Foto
  </button>

  <button type="button" disabled={!draftLoaded} onClick={() => fileInputRef.current?.click()} className="rounded-lg bg-[#252525] px-4 py-2 text-xs font-semibold text-white hover:bg-[#444444] disabled:opacity-50">
    + Upload Foto
  </button>
    </div>

            
    </div>

    <input ref={fileInputRef} type="file" accept="image/*" multiple={layout.count > 1} className="hidden" onChange={(event) => handleUpload(event.target.files)}/>

    <p className="mt-2 text-right text-[11px] text-gray-500">
  JPG, PNG, WEBP · Pilih slot sebelum upload
    </p>


        {cameraOpen && (<div className="mt-4 rounded-xl bg-gray-900 p-3 text-white">
    <video ref={videoRef} autoPlay playsInline muted className="aspect-[4/3] w-full rounded-lg bg-black object-cover"/>

    {cameraError && (<p className="mt-2 text-xs text-red-300">{cameraError}</p>)}

    <div className="mt-3 flex justify-center gap-3">
      <button type="button" onClick={closeCamera} className="rounded-lg bg-gray-600 px-4 py-2 text-sm">
        Batal
      </button>

      <button type="button" onClick={capturePhoto} disabled={!!cameraError} className="rounded-lg bg-[#b58b50] px-4 py-2 text-sm font-semibold disabled:opacity-50">
        📸 Ambil Foto
      </button>
    </div>
  </div>)}

            <h3 className="mt-6 text-sm font-bold">02. Pilih Slot Foto</h3>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {Array.from({ length: layout.count }).map((_, index) => (<button key={index} type="button" onClick={() => { setSelectedSlot(index); setSelectedStickerId(null); }} className={`rounded-lg border-2 px-2 py-3 text-xs font-semibold ${selectedSlot === index ? "border-[#b58b50] bg-[#f7ead4]" : "border-gray-200 bg-gray-50"}`}>
                  Slot {index + 1}<span className="mt-1 block text-[10px] font-normal">{photos[index] ? "Terisi" : "Kosong"}</span>
                </button>))}
            </div>

            <h3 className="mt-6 text-sm font-bold">03. Atur Posisi Foto</h3>
            {selectedPhoto ? (<div className="mt-3 space-y-3">
                <div className="flex justify-between text-xs"><span>Zoom Foto</span><span>{Math.round(selectedPhoto.zoom * 100)}%</span></div>
                <input type="range" min="1" max="3" step="0.05" value={selectedPhoto.zoom} onChange={(event) => updatePhoto(selectedSlot, { zoom: Number(event.target.value) })} className="w-full accent-[#b58b50]"/>
                <p className="text-xs text-gray-500">Geser foto langsung di preview untuk mengatur posisi wajah.</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => updatePhoto(selectedSlot, { x: 0, y: 0, zoom: 1 })} className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold">Reset Posisi</button>
                  <button type="button" onClick={() => removePhoto(selectedSlot)} className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600">Hapus Foto</button>
                </div>
              </div>) : <p className="mt-3 rounded-lg bg-gray-100 p-3 text-xs text-gray-500">Upload foto ke slot terpilih untuk mulai mengedit.</p>}

{frameType === "original" && (
  <div className="mt-6 border-t border-gray-200 pt-5">
    <h3 className="text-sm font-bold">
      Custom Text
    </h3>

    <p className="mt-1 text-xs text-gray-500">
      Opsional. Kosongkan jika tidak ingin menambahkan tulisan.
    </p>

    <input
      type="text"
      maxLength={40}
      placeholder="Contoh: Best Day Ever!"
      value={customText}
      onChange={(event) => setCustomText(event.target.value)}
      className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
    />

    {customText.trim() && (
      <div className="mt-3 space-y-3">
        <div>
          <label className="text-xs font-medium">
            Warna tulisan
          </label>
          <input
            type="color"
            value={customTextColor}
            onChange={(event) =>
              setCustomTextColor(event.target.value)
            }
            className="mt-1 block h-9 w-16 cursor-pointer"
          />
        </div>

        <div>
          <label className="text-xs font-medium">
            Ukuran tulisan: {customTextSize}px
          </label>
          <input
            type="range"
            min="14"
            max="42"
            value={customTextSize}
            onChange={(event) =>
              setCustomTextSize(Number(event.target.value))
            }
            className="mt-2 w-full accent-[#b58b50]"
          />
        </div>

        <button
          type="button"
          onClick={() => setCustomText("")}
          className="text-xs text-red-600 hover:underline"
        >
          Hapus tulisan
        </button>
      </div>
    )}
  </div>
)}

            <div className="mt-7 border-t border-gray-200 pt-5">
              <div className="flex items-center justify-between gap-2">
                
<div className="flex items-center gap-2">
  <span className="rounded-full bg-[#f7ead4] px-3 py-1 text-xs font-semibold text-[#8d6737]">
    Rp2.000 / sticker
  </span>

  <button
    type="button"
    disabled={stickers.length === 0}
    onClick={() => {
      if (window.confirm("Hapus semua stiker dan pilih ulang dari awal?")) {
        setStickers([]);
        setSelectedStickerId(null);
      }
    }}
    className="rounded-lg border border-red-200 bg-white px-2 py-1 text-[10px] font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
  >
    🗑 Hapus Semua
  </button>
</div>

              </div>
              <p className="mt-2 text-xs text-gray-500">Pilih slot foto, klik stiker, lalu edit langsung di preview. Setiap salinan dihitung satu stiker.</p>
              <div className="mt-3 grid max-h-[300px] grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-5">
                {stickerCatalog.map((item) => {
  const selectedCount = stickers.filter(
    (sticker) => sticker.src === item.src
  ).length;

  return (<button key={item.src} type="button" onClick={() => addSticker(item.name, item.src)} className="flex min-w-0 flex-col items-center rounded-xl border border-gray-200 bg-white p-1.5 transition hover:border-[#b58b50] hover:bg-[#fff8ed]">
                    <div className="flex h-12 w-full items-center justify-center rounded-lg bg-[#f5f1ed]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={encodeURI(item.src)} alt={item.name} className="h-10 w-10 object-contain"/>
                    </div>
                    <span className="mt-1 line-clamp-2 min-h-[26px] text-center text-[10px] font-semibold leading-3">{item.name}</span>
                    {selectedCount > 0 ? (
  <span className="text-[10px] font-bold text-green-700">
    ✓ {selectedCount} dipakai
  </span>
) : (
  <span className="text-[10px] text-[#a47a46]">
    +Rp2.000
  </span>
)}
                  </button>
  );
})}
              </div>
              <p className="mt-3 text-xs text-gray-500">Pilih stiker pada preview untuk menampilkan kontrol: × hapus, ↻ putar, ↗ perbesar/perkecil.</p>
            </div>
          </section>

          <section className="rounded-2xl bg-white/90 p-5 shadow-md lg:sticky lg:top-4">
            <h2 className="text-base font-bold">05. Preview Your Frame</h2>
            <div className="mt-4 space-y-2 rounded-xl border border-[#eadbc5] bg-[#fbf7f0] p-4 text-sm">
              <div className="flex justify-between gap-3"><span>{frameType === "luxury" ? selectedLuxuryFrame.name : frameType === "premium"
            ? selectedPremiumFrame?.name ?? "Premium Frame"
            : `${layout.name} · ${isMetallic ? "Metallic" : "Standard"}`}</span><span>Rp{framePrice.toLocaleString("id-ID")}</span></div>
              <div className="flex justify-between gap-3"><span>Sticker ({stickers.filter((sticker) => sticker.slot < layout.count).length} × Rp2.000)</span><span>Rp{stickerTotal.toLocaleString("id-ID")}</span></div>
              <div className="flex justify-between border-t border-[#eadbc5] pt-3 text-lg font-bold"><span>Total</span><span className="text-[#a47a46]">Rp{totalPrice.toLocaleString("id-ID")}</span></div>
            </div>
            <div className="mt-4 flex min-h-[360px] items-center justify-center rounded-xl bg-gradient-to-br from-[#D8DCE0] via-[#E8DDE3] to-[#F2D6E2] p-3 sm:p-5">
  <div
  ref={stripRef}
  
className={`relative flex w-full max-w-[300px] flex-col overflow-hidden shadow-xl ${
  frameType === "premium" || frameType === "luxury"
    ? "p-0"
    : layoutId === "polaroid"
      ? "gap-0 px-[9px] pt-[9px] pb-[42px]"
      : "gap-[6px] px-[9px] pt-[9px] pb-[42px]"
}`}

  style={{
    aspectRatio:
      frameType === "luxury" ? "2 / 3" :
      frameType === "premium" && selectedPremiumGeometry
        ? `${selectedPremiumGeometry.width} / ${selectedPremiumGeometry.height}`
        : undefined,

    backgroundImage:
  frameType !== "original"
    ? "none"
    : metallicGradients[color]?.startsWith("linear-gradient")
      ? metallicGradients[color]
      : "none",

backgroundColor:
  frameType !== "original"
    ? "transparent"
    : color,
  }}
>
    {/* LAYER FOTO */}
    
        {frameType === "luxury" && (
          <div className="absolute inset-0">
            <div ref={(element) => { slotRefs.current[0] = element; }}
              data-photo-slot
              className="absolute z-10 overflow-hidden bg-gray-200 touch-none"
              style={{ left: `${selectedLuxuryFrame.photoSlot.left}%`, top: `${selectedLuxuryFrame.photoSlot.top}%`,
                width: `${selectedLuxuryFrame.photoSlot.width}%`, height: `${selectedLuxuryFrame.photoSlot.height}%` }}
              onPointerDown={(event) => beginAction(event, "photo", 0)}
              onPointerMove={moveAction} onPointerUp={endAction} onPointerCancel={endAction}>
              {photos[0] ? <img src={photos[0].url} alt="Foto Luxury" draggable={false}
                className="pointer-events-none h-full w-full object-cover"
                style={{ transform: `translate(${photos[0].x}px, ${photos[0].y}px) scale(${photos[0].zoom})` }} />
                : <div className="flex h-full items-center justify-center text-xs text-gray-500">Upload foto</div>}
            </div>
            <img src={selectedLuxuryFrame.image} alt={selectedLuxuryFrame.name}
              draggable={false} className="pointer-events-none absolute inset-0 z-20 h-full w-full object-fill" />
          </div>
        )}
        {frameType === "premium" && selectedPremiumFrame && (<div className="absolute inset-0 z-20">
    {premiumPhotoSlots.map((slot, index) => {
                const photo = photos[index];
                return (<div key={index} ref={(element) => {
                        slotRefs.current[index] = element;
                    }} data-photo-slot className="absolute overflow-hidden bg-gray-200 touch-none" style={{
                        left: `${slot.left}%`,
                        top: `${slot.top}%`,
                        width: `${slot.width}%`,
                        height: `${slot.height}%`,
                    }} onPointerDown={(event) => beginAction(event, "photo", index)} onPointerMove={moveAction} onPointerUp={endAction} onPointerCancel={endAction}>
          {photo ? (<img src={photo.url} alt={`Premium Photo ${index + 1}`} draggable={false} className="pointer-events-none h-full w-full object-cover" style={{
                            transform: `translate(${photo.x}px, ${photo.y}px) scale(${photo.zoom})`,
                        }}/>) : (<div className="flex h-full items-center justify-center text-xs text-gray-500">
              Photo {index + 1}
            </div>)}
        </div>);
            })}

    <img
  src={selectedPremiumFrame.image}
  alt={selectedPremiumFrame.name}
  className="pointer-events-none absolute inset-0 h-full w-full object-fill"
  draggable={false}
/>
</div>)}

        {frameType === "original" && (<div className="grid gap-[6px]" style={{
                gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
            }}>
      {Array.from({ length: layout.count }).map((_, index) => {
                const photo = photos[index];
                return (<div key={index} ref={(element) => {
                        slotRefs.current[index] = element;
                    }} className={`relative ${
  layoutId === "polaroid" ? "aspect-square" : "aspect-[4/3]"
} overflow-hidden bg-[#ded8d2] touch-none ${selectedSlot === index
                        ? "outline outline-2 outline-offset-[-2px] outline-[#b58b50]"
                        : ""}`} onPointerDown={(event) => beginAction(event, "photo", index)} onPointerMove={moveAction} onPointerUp={endAction} onPointerCancel={endAction}>
            {photo ? (<img src={photo.url} alt={`Photo ${index + 1}`} draggable={false} className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover" style={{
                            transform: `translate(${photo.x}px, ${photo.y}px) scale(${photo.zoom})`,
                        }}/>) : (<div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                <span className="text-xl">+</span>
                <span className="text-xs">Photo {index + 1}</span>
              </div>)}
          </div>);
            })}
    </div>)}

{frameType === "original" && customText.trim() && (
  
<div
  className="pointer-events-none absolute inset-x-0 bottom-[10px] z-20 px-2 text-center"
>

    <span
      className={handwritingFont.className}
      style={{
        color: customTextColor,
        fontSize: `${customTextSize}px`,
        lineHeight: 1,
        overflowWrap: "anywhere",
      }}
    >
      {customText}
    </span>
  </div>
)}

    <div className="pointer-events-none absolute inset-0 z-30">
      {stickers
            .filter((sticker) => sticker.slot < layout.count)
            .map((sticker) => {
            const selected = selectedStickerId === sticker.id;
            const slotElement = slotRefs.current[sticker.slot];
            const stripElement = stripRef.current;
            if (!slotElement || !stripElement)
                return null;
            const slotRect = slotElement.getBoundingClientRect();
            const stripRect = stripElement.getBoundingClientRect();
            const x = slotRect.left -
                stripRect.left +
                (sticker.x / 100) * slotRect.width;
            const y = slotRect.top -
                stripRect.top +
                (sticker.y / 100) * slotRect.height;
            return (<div key={sticker.id} className="pointer-events-auto absolute touch-none" style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    width: `${30 * sticker.zoom}px`,
                    height: `${30 * sticker.zoom}px`,
                    transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
                }} onPointerDown={(event) => beginAction(event, "move", sticker.slot, sticker)} onPointerMove={moveAction} onPointerUp={endAction} onPointerCancel={endAction}>
              <img src={encodeURI(sticker.src)} alt={sticker.name} draggable={false} className="pointer-events-none h-full w-full select-none object-contain"/>

              {selected && (<>
                  <div className="pointer-events-none absolute inset-0 border border-dashed border-[#b58b50]"/>

                  <button type="button" aria-label="Hapus stiker" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => {
                        event.stopPropagation();
                        deleteSticker(sticker.id);
                    }} className="absolute -left-2 -top-2 z-30 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[11px] text-white shadow">
                    ×
                  </button>

                  <div title="Putar stiker" onPointerDown={(event) => beginAction(event, "rotate", sticker.slot, sticker)} onPointerMove={moveAction} onPointerUp={endAction} onPointerCancel={endAction} className="absolute -right-2 -top-2 z-30 flex h-4 w-4 cursor-grab touch-none items-center justify-center rounded-full bg-[#b58b50] text-[10px] text-white shadow">
                    ↻
                  </div>

                  <div title="Ubah ukuran stiker" onPointerDown={(event) => beginAction(event, "resize", sticker.slot, sticker)} onPointerMove={moveAction} onPointerUp={endAction} onPointerCancel={endAction} className="absolute -bottom-2 -right-2 z-30 flex h-4 w-4 cursor-nwse-resize touch-none items-center justify-center rounded-full bg-[#b58b50] text-[10px] text-white shadow">
                    ↗
                  </div>
                </>)}
            </div>);
        })}
    </div>
  </div>
    </div>

            
<button
  type="button"
  disabled={!allPhotosReady}
  onClick={() => {
    if (frameType === "luxury") {
      router.push(`/preview?frameType=luxury&luxuryFrameId=${encodeURIComponent(selectedLuxuryFrame.id)}`);
    } else if (frameType === "premium" && selectedPremiumFrame) {
      router.push(
        `/preview?frameType=premium&premiumFrameId=${encodeURIComponent(
          selectedPremiumFrame.id
        )}`
      );
    } else {
      router.push(
        `/preview?frameType=original&layout=${layoutId}&color=${encodeURIComponent(
          color
        )}`
      );
    }
  }}
  className={`mt-5 w-full rounded-full px-6 py-4 text-sm font-bold shadow-lg ${
    allPhotosReady
      ? "bg-gradient-to-r from-[#b68a49] via-[#f4dca5] to-[#b68a49] text-black hover:brightness-105"
      : "cursor-not-allowed bg-gray-300 text-gray-500"
  }`}
>
  {allPhotosReady
    ? "CONTINUE →"
    : `UPLOAD ${layout.count - uploadedCount} FOTO LAGI`}
</button>

           </section>
        </div>
      </div>
    </main>);
}
export default function CreatePage() {
    return <Suspense fallback={<div className="p-8 text-center">Loading photobooth...</div>}><CreateContent /></Suspense>;
}

