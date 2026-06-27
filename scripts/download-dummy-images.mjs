import { mkdir, writeFile } from "fs/promises";
import path from "path";

const outDir = path.resolve("src/assets/dummy");
await mkdir(outDir, { recursive: true });

/** Unsplash Source — reliable, no auth, works offline after download */
const images = {
  default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop",
  paratha: "https://images.unsplash.com/photo-1626074353765-517a8e32562a?w=600&h=600&fit=crop",
  chana: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=600&fit=crop",
  halwa: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop",
  omelette: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=600&fit=crop",
  eggFry: "https://images.unsplash.com/photo-1482049015728-a59ff4c0ea00?w=600&h=600&fit=crop",
  lassi: "https://images.unsplash.com/photo-1623065422902-30a2e2df7a2b?w=600&h=600&fit=crop",
  fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=600&fit=crop",
  springRolls: "https://images.unsplash.com/photo-1529006557810-274b5b5c7687?w=600&h=600&fit=crop",
  chickenWings: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&h=600&fit=crop",
  chicken: "https://images.unsplash.com/photo-1598515214210-0fabfa8e0f02?w=600&h=600&fit=crop",
  broast: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&h=600&fit=crop",
  bbq: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=600&fit=crop",
  mixGrill: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop",
  fish: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=600&fit=crop",
  prawn: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&h=600&fit=crop",
  kebab: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&h=600&fit=crop",
  tikka: "https://images.unsplash.com/photo-1599487488170-d11ec29cada8?w=600&h=600&fit=crop",
  mutton: "https://images.unsplash.com/photo-1603048297172-c9254474d2a8?w=600&h=600&fit=crop",
  cocktail: "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&h=600&fit=crop",
  orangeJuice: "https://images.unsplash.com/photo-1621506284667-e0541ff5162f?w=600&h=600&fit=crop",
  lassiDrink: "https://images.unsplash.com/photo-1623065422902-30a2e2df7a2b?w=600&h=600&fit=crop",
  chowmien: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=600&fit=crop",
  noodles: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&h=600&fit=crop",
  mangoShake: "https://images.unsplash.com/photo-1623065422902-30a2e2df7a2b?w=600&h=600&fit=crop",
  vanillaShake: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=600&fit=crop",
  chocolateShake: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=600&fit=crop",
  hummus: "https://images.unsplash.com/photo-1664475566857-9d9d9b5162d7?w=600&h=600&fit=crop",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop",
  gardenSalad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop",
  raita: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=600&fit=crop",
  mandi: "https://images.unsplash.com/photo-1563379091339-03246963d96a?w=600&h=600&fit=crop",
  platter: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop",
  soup: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=600&fit=crop",
  rice: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=600&fit=crop",
  seafood: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=600&fit=crop",
};

for (const [name, url] of Object.entries(images)) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    console.error(`✗ ${name}: HTTP ${res.status}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const file = path.join(outDir, `${name}.jpg`);
  await writeFile(file, buf);
  console.log(`✓ ${name} (${(buf.length / 1024).toFixed(1)} KB)`);
}

console.log("\nDone — dummy images saved to src/assets/dummy/");
