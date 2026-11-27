// Puts the chosen face into test scenes on each candidate model.
// Usage: pnpm scenes [--only=<model id>] <face.jpg> [more reference images...]
import { describePersona, loadPersona } from "./lib/canon.js";
import { budgetLine, generate, uploadLocal } from "./lib/fal.js";

const ALL_MODELS = [
  { id: "seedream", endpoint: "fal-ai/bytedance/seedream/v4.5/edit", usd: 0.04, size: { image_size: "portrait_4_3" } },
  { id: "nanobanana", endpoint: "fal-ai/nano-banana-2/edit", usd: 0.08, size: { aspect_ratio: "3:4" } },
];

const SCENES = [
  "running along a city river embankment at sunrise, sportswear, mid-stride",
  "in a gym doing a dumbbell row, sweaty, candid phone photo",
  "sitting in a cafe holding a flat white, laughing, window light",
  "selfie on a mountain hiking trail, windy hair, backpack straps",
  "at home on a yoga mat stretching, morning light, casual top",
];

const args = process.argv.slice(2);
const only = args.find((a) => a.startsWith("--only="))?.slice("--only=".length);
const refs = args.filter((a) => !a.startsWith("--only="));
const MODELS = only ? ALL_MODELS.filter((m) => m.id === only) : ALL_MODELS;
if (MODELS.length === 0) throw new Error(`Unknown model id "${only}"; known: ${ALL_MODELS.map((m) => m.id).join(", ")}`);
if (refs.length === 0) throw new Error("Pass at least one reference image path");

const imageUrls = await Promise.all(refs.map(uploadLocal));
const look = describePersona(loadPersona());
const outDir = `output/scenes-${new Date().toISOString().slice(0, 16).replace(/[T:]/g, "-")}`;

for (const [i, scene] of SCENES.entries()) {
  const prompt =
    `The same woman as in the reference image, keep her face and freckles identical. ${look} ` +
    `Scene: ${scene}. Photorealistic, natural Instagram photo.`;
  for (const m of MODELS) {
    const [file] = await generate(m.endpoint, { prompt, image_urls: imageUrls, ...m.size }, m.usd, outDir, `${m.id}-scene${i + 1}`);
    process.stdout.write(`${file}\n`);
  }
}
process.stdout.write(`${budgetLine()}\n`);
