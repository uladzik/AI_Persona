// Re-renders a chosen face so it matches the current canon face text, keeping identity and framing.
// Usage: pnpm tweak <face.jpg>
import { loadPersona } from "./lib/canon.js";
import { budgetLine, generate, uploadLocal } from "./lib/fal.js";

const RUNS = [
  { id: "seedream-s1", endpoint: "fal-ai/bytedance/seedream/v4.5/edit", usd: 0.04, extra: { image_size: "portrait_4_3", seed: 1 } },
  { id: "seedream-s2", endpoint: "fal-ai/bytedance/seedream/v4.5/edit", usd: 0.04, extra: { image_size: "portrait_4_3", seed: 2 } },
  { id: "nanobanana", endpoint: "fal-ai/nano-banana-2/edit", usd: 0.08, extra: { aspect_ratio: "3:4" } },
];

const [face] = process.argv.slice(2);
if (!face) throw new Error("Pass the face image path");

const imageUrls = [await uploadLocal(face)];
const prompt =
  "The same woman as in the reference image. Keep her hair, freckles, eye colour, outfit, jewellery, pose, " +
  `lighting and framing identical. Adjust only her facial features to match: ${loadPersona().appearance.face}. ` +
  "Photorealistic, natural skin texture.";
const outDir = `output/tweak-${new Date().toISOString().slice(0, 16).replace(/[T:]/g, "-")}`;

for (const r of RUNS) {
  const [file] = await generate(r.endpoint, { prompt, image_urls: imageUrls, ...r.extra }, r.usd, outDir, r.id);
  process.stdout.write(`${file}\n`);
}
process.stdout.write(`${budgetLine()}\n`);
