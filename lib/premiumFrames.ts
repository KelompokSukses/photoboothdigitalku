
export type PremiumFrame = {
  id: string;
  name: string;
  image: string;
  price: number;
};

export const premiumFrames: PremiumFrame[] = Array.from(
  { length: 16 },
  (_, index) => {
    const number = String(index).padStart(3, "0");

    return {
      id: `frame-${number}`,
      name: `Frame ${number}`,
      image: `/frames/${index <= 5 || index === 15 ? "Frame" : "frame"} ${number}.png`,
      price: 6900,
    };
  }
);

