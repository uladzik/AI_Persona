// Generates face candidates from the canon. Usage: pnpm faces [count]
import { describePersona, loadPersona } from "./lib/canon.js";
import { budgetLine, generate } from "./lib/fal.js";

const ENDPOINT = "fal-ai/flux-2-pro";
const USD_PER_IMAGE = 0.03; // $0.03 per megapixel, portrait_4_3 ≈ 1 MP

const count = Number(process.argv[2] ?? 8);
const persona = loadPersona();
const prompt =
  `Close-up portrait photo of a ${describePersona(persona)} ` +
  "Looking at the camera, soft daylight, neutral background, shot on 85mm, natural skin texture, no makeup look.";

const outDir = `output/faces-${new Date().toISOString().slice(0, 16).replace(/[T:]/g, "-")}`;
for (let seed = 1; seed <= count; seed++) {
  const [file] = await generate(
    ENDPOINT,
    { prompt, seed, image_size: "portrait_4_3", output_format: "jpeg" },
    USD_PER_IMAGE,
    outDir,
    `face-seed${seed}`,
  );
  process.stdout.write(`${file}\n`);
}
process.stdout.write(`${budgetLine()}\n`);
