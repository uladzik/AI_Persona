// Puts the chosen face into test scenes on each candidate model.
// Usage: pnpm scenes [--only=<model id>] [--scene=<n>] <face.jpg> [more reference images...]
import { describePersona, loadPersona } from "./lib/canon.js";
import { budgetLine, generate, uploadLocal } from "./lib/fal.js";

const ALL_MODELS = [
  { id: "seedream", endpoint: "fal-ai/bytedance/seedream/v4.5/edit", usd: 0.04, size: { image_size: "portrait_4_3" } },
  { id: "nanobanana", endpoint: "fal-ai/nano-banana-2/edit", usd: 0.08, size: { aspect_ratio: "3:4" } },
];

// The reference is a still portrait; each scene states how her face reacts, so the portrait's pose is not copied.
const SCENES = [
  {
    action: "running along a city river embankment at sunrise, sportswear, mid-stride",
    face: "breathing hard through parted lips, squinting into the low sun, flushed cheeks, sweat on forehead, hair strands stuck to her temple",
  },
  {
    action: "in a gym doing a dumbbell row",
    face: "focused effort, jaw tense, sweaty skin, flushed face",
  },
  { action: "sitting in a cafe holding a flat white, window light", face: "laughing with eyes crinkled, relaxed" },
  { action: "selfie on a mountain hiking trail, windy hair, backpack straps", face: "wide genuine smile, wind-reddened cheeks" },
  { action: "at home on a yoga mat stretching, morning light, casual top", face: "calm, eyes half closed, no makeup" },
];

const REALISM =
  "Candid photo taken on an iPhone by a friend, unretouched skin with visible pores and uneven tone, no makeup, " +
  "matte natural lips, slight motion blur, imperfect framing, no brand logos on clothing.";

const args = process.argv.slice(2);
const flag = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const only = flag("only");
const sceneNo = flag("scene");
const refs = args.filter((a) => !a.startsWith("--"));

const MODELS = only ? ALL_MODELS.filter((m) => m.id === only) : ALL_MODELS;
if (MODELS.length === 0) throw new Error(`Unknown model id "${only}"; known: ${ALL_MODELS.map((m) => m.id).join(", ")}`);
const picked = sceneNo ? [Number(sceneNo) - 1] : SCENES.map((_, i) => i);
if (picked.some((i) => !SCENES[i])) throw new Error(`Scene must be 1..${SCENES.length}`);
if (refs.length === 0) throw new Error("Pass at least one reference image path");

const imageUrls = await Promise.all(refs.map(uploadLocal));
const look = describePersona(loadPersona());
const outDir = `output/scenes-${new Date().toISOString().slice(0, 16).replace(/[T:]/g, "-")}`;

for (const i of picked) {
  const s = SCENES[i];
  const prompt =
    "The same woman as in the reference image: keep her identity (face shape, eye colour, freckle pattern, haircut), " +
    `but not the portrait's pose or expression. ${look} Scene: ${s.action}. Her face: ${s.face}. ${REALISM}`;
  for (const m of MODELS) {
    const [file] = await generate(m.endpoint, { prompt, image_urls: imageUrls, ...m.size }, m.usd, outDir, `${m.id}-scene${i + 1}`);
    process.stdout.write(`${file}\n`);
  }
}
process.stdout.write(`${budgetLine()}\n`);
