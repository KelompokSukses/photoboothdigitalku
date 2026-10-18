// Luxury: area foto diperluas melewati batas lubang transparan agar tidak ada gap.
// Koordinat adalah pixel pada PNG 1024 x 1536, dikonversi ke persen.
export type LuxuryFrame = {
  id: string; name: string; image: string; price: number;
  photoSlot: { left: number; top: number; width: number; height: number };
};
export const luxuryFrames: LuxuryFrame[] = [
  { id: "luxury-001", name: "Lux 001", image: "/luxury-frames/lux-001.png", price: 10000,
    photoSlot: { left: 215 / 1024 * 100, top: 0 / 1536 * 100,
      width: 750 / 1024 * 100, height: 1280 / 1536 * 100 } },
  { id: "luxury-002", name: "Lux 002", image: "/luxury-frames/lux-002.png", price: 10000,
    photoSlot: { left: 210 / 1024 * 100, top: 0 / 1536 * 100,
      width: 750 / 1024 * 100, height: 1230 / 1536 * 100 } },
  { id: "luxury-003", name: "Lux 003", image: "/luxury-frames/lux-003.png", price: 10000,
    photoSlot: { left: 235 / 1024 * 100, top: 0 / 1536 * 100,
      width: 745 / 1024 * 100, height: 1300 / 1536 * 100 } },
  { id: "luxury-004", name: "Lux 004", image: "/luxury-frames/lux-004.png", price: 10000,
    photoSlot: { left: 190 / 1024 * 100, top: 55 / 1536 * 100,
      width: 770 / 1024 * 100, height: 1230 / 1536 * 100 } },
  { id: "luxury-005", name: "Lux 005", image: "/luxury-frames/lux-005.png", price: 10000,
    photoSlot: { left: 165 / 1024 * 100, top: 45 / 1536 * 100,
      width: 790 / 1024 * 100, height: 1260 / 1536 * 100 } },
];
