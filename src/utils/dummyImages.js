/** Local bundled food photos — no external URLs, works offline */

import defaultImg from "../assets/dummy/default.jpg";
import paratha from "../assets/dummy/paratha.jpg";
import chana from "../assets/dummy/chana.jpg";
import halwa from "../assets/dummy/halwa.jpg";
import omelette from "../assets/dummy/omelette.jpg";
import eggFry from "../assets/dummy/eggFry.jpg";
import lassi from "../assets/dummy/lassi.jpg";
import fries from "../assets/dummy/fries.jpg";
import springRolls from "../assets/dummy/springRolls.jpg";
import chickenWings from "../assets/dummy/chickenWings.jpg";
import chicken from "../assets/dummy/chicken.jpg";
import broast from "../assets/dummy/broast.jpg";
import bbq from "../assets/dummy/bbq.jpg";
import mixGrill from "../assets/dummy/mixGrill.jpg";
import fish from "../assets/dummy/fish.jpg";
import prawn from "../assets/dummy/prawn.jpg";
import kebab from "../assets/dummy/kebab.jpg";
import tikka from "../assets/dummy/tikka.jpg";
import mutton from "../assets/dummy/mutton.jpg";
import cocktail from "../assets/dummy/cocktail.jpg";
import orangeJuice from "../assets/dummy/orangeJuice.jpg";
import lassiDrink from "../assets/dummy/lassiDrink.jpg";
import chowmien from "../assets/dummy/chowmien.jpg";
import noodles from "../assets/dummy/noodles.jpg";
import mangoShake from "../assets/dummy/mangoShake.jpg";
import vanillaShake from "../assets/dummy/vanillaShake.jpg";
import chocolateShake from "../assets/dummy/chocolateShake.jpg";
import hummus from "../assets/dummy/hummus.jpg";
import salad from "../assets/dummy/salad.jpg";
import gardenSalad from "../assets/dummy/gardenSalad.jpg";
import raita from "../assets/dummy/raita.jpg";
import mandi from "../assets/dummy/mandi.jpg";
import platter from "../assets/dummy/platter.jpg";
import soup from "../assets/dummy/soup.jpg";
import rice from "../assets/dummy/rice.jpg";
import seafood from "../assets/dummy/seafood.jpg";

export const dummyImages = {
  default: defaultImg,
  paratha,
  chana,
  halwa,
  omelette,
  eggFry,
  lassi,
  fries,
  springRolls,
  chickenWings,
  chicken,
  broast,
  bbq,
  mixGrill,
  fish,
  prawn,
  kebab,
  tikka,
  mutton,
  cocktail,
  orangeJuice,
  lassiDrink,
  chowmien,
  noodles,
  mangoShake,
  vanillaShake,
  chocolateShake,
  hummus,
  salad,
  gardenSalad,
  raita,
  mandi,
  platter,
  soup,
  rice,
  seafood,
};

export function pickImage(local, dummy) {
  return local || dummy || defaultImg;
}
