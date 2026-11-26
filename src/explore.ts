// Explores diverse looks before fixing the face in the canon. Usage: pnpm explore
// Keeps only the canon invariants (adult age, sporty, freckles); everything else varies per look.
import { loadPersona } from "./lib/canon.js";
import { budgetLine, generate } from "./lib/fal.js";

const MODELS = [
  { id: "zimage", endpoint: "fal-ai/z-image/turbo", usd: 0.005 }, // $0.005 per MP, portrait_4_3 < 1 MP
  { id: "flux2", endpoint: "fal-ai/flux-2", usd: 0.012 }, // $0.012 per MP
];

const LOOKS = [
  "Korean-Irish, messy copper-brown shag haircut with curtain bangs, half smile, at a night street food market, direct phone flash",
  "Japanese-Scandinavian, platinum buzz cut, tiny nose stud, laughing with eyes closed, on a rooftop basketball court at golden hour",
  "Filipino-Spanish, long dark wavy hair in a low messy bun, sun-kissed tan, squinting into the sun, on a surfboard at the beach",
  "Chinese-British, choppy black wolf cut with red streaks, smirk, leaning on a gym rack after a workout, sweaty, fluorescent light",
  "Vietnamese-French, honey-brown hair in two braids, gap-tooth grin, on a bike in a European city, overcast soft light",
  "Thai-German, sleek high ponytail, bold brows, focused look, tying running shoes on stadium stairs, early morning blue hour",
  "Mongolian-Russian, long straight dark hair with a beanie, rosy cheeks from cold, snowboarding resort, bright winter sun",
  "Indonesian-Dutch, curly shoulder-length dark hair, dimples, mid-laugh, holding an iced matcha in a cafe, window light",
  "Kazakh-Italian, sharp cheekbones, slicked-back wet hair, calm stare, sitting at the edge of a swimming pool, underwater light reflections",
  "Japanese-Brazilian, voluminous dark curls with a claw clip, playful tongue-out selfie, climbing gym with chalk on hands",
];

const { age } = loadPersona();
const outDir = `output/explore-${new Date().toISOString().slice(0, 16).replace(/[T:]/g, "-")}`;

for (const [i, look] of LOOKS.entries()) {
  const prompt =
    `Candid iPhone photo of a ${age}-year-old athletic woman with natural freckles, ${look}. ` +
    "Unretouched skin with pores and slight asymmetry, flyaway hairs, real moment, not posed, no studio, " +
    "slight motion blur, Instagram photo dump aesthetic.";
  for (const m of MODELS) {
    const [file] = await generate(
      m.endpoint,
      { prompt, seed: i + 1, image_size: "portrait_4_3", output_format: "jpeg" },
      m.usd,
      outDir,
      `${m.id}-look${String(i + 1).padStart(2, "0")}`,
    );
    process.stdout.write(`${file}\n`);
  }
}
process.stdout.write(`${budgetLine()}\n`);
