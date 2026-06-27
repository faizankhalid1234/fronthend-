import { useState } from "react";
import { getSheetPosition } from "../data/menuSheets";
import { dummyImages } from "../utils/dummyImages";
import FoodImage from "./FoodImage";

const DUMMY_BY_CATEGORY = {
  ramadan: [dummyImages.paratha, dummyImages.paratha, dummyImages.paratha, dummyImages.chana, dummyImages.halwa, dummyImages.omelette, dummyImages.eggFry, dummyImages.lassi],
  appetizer: [dummyImages.fries, dummyImages.springRolls, dummyImages.chickenWings, dummyImages.chicken, dummyImages.broast, dummyImages.chickenWings],
  deals: [dummyImages.mandi, dummyImages.mandi, dummyImages.platter, dummyImages.platter],
  barbeque: [dummyImages.mixGrill, dummyImages.fish, dummyImages.prawn, dummyImages.tikka, dummyImages.tikka, dummyImages.tikka, dummyImages.kebab, dummyImages.tikka, dummyImages.kebab, dummyImages.kebab, dummyImages.kebab, dummyImages.mutton],
  juices: [dummyImages.cocktail, dummyImages.orangeJuice, dummyImages.lassiDrink, dummyImages.lassiDrink],
  chowmien: [dummyImages.chowmien, dummyImages.noodles, dummyImages.noodles, dummyImages.chowmien, dummyImages.noodles],
  shakes: [dummyImages.mangoShake, dummyImages.vanillaShake, dummyImages.chocolateShake],
  salad: [dummyImages.hummus, dummyImages.gardenSalad, dummyImages.raita, dummyImages.raita, dummyImages.raita],
};

function SheetItemImage({ categoryId, index, fallback, alt, className = "" }) {
  const pos = getSheetPosition(categoryId, index);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const dummies = DUMMY_BY_CATEGORY[categoryId];
  const dummySrc = dummies?.[index] || fallback || dummyImages.default;

  if (!pos || failed) {
    return (
      <FoodImage src={dummySrc} alt={alt} className={className} loading="eager" />
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gray-input ${className}`}>
      {!ready && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-input via-white to-gray-input" />
      )}
      <img
        src={pos.sheet}
        alt={alt}
        draggable={false}
        onLoad={() => setReady(true)}
        onError={() => setFailed(true)}
        className={`absolute max-w-none select-none transition-opacity duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: 1024,
          height: "auto",
          left: -pos.left,
          top: -pos.top,
        }}
      />
    </div>
  );
}

export default SheetItemImage;
