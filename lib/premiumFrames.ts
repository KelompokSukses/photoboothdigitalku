
export type PremiumFrame = {
  id: string;
  name: string;
  image: string;
  price: number;
};

export const premiumFrames: PremiumFrame[] = Array.from(
  { length: 17 },
  (_, index) => {
    const number = String(index).padStart(3, "0");

    return {
      id: `frame-${number}`,
      name: `Frame ${number}`,
      image: `/frames/frame ${number}.png`,
      price: 6900,
    };
  }
);
