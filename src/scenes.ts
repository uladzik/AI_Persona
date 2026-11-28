// Puts the chosen face into test scenes on each candidate pipeline.
// Usage: pnpm scenes [--only=<pipeline id>] [--scene=<n>] <face.jpg> [more reference images...]
import { describePersona, loadPersona } from "./lib/canon.js";
import { budgetLine, generate, uploadLocal } from "./lib/fal.js";

interface Scene {
  action: string;
  face: string;
}

// The reference is a still portrait; each scene states how her face reacts, so the portrait's pose is not copied.
const SCENES: Scene[] = [
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
  {
    action:
      "standing on a city river embankment at sunrise after a run, full-body shot from head to toe with shoes visible. " +
      "Relaxed asymmetric pose: weight on one leg, hip shifted, body turned three-quarters to the camera, one hand holding " +
      "a water bottle, the other pulling out an earphone, glancing to the side. Realistic adult proportions, head about " +
      "one-eighth of her height. Fit, sporty body of a regular runner, not skinny: toned shoulders and arms, strong thighs " +
      "and calves with visible muscle, natural skin texture. Black running shorts, simple running shoes with low ankle " +
      "socks, bare legs from ankle to thigh, no knee socks or leg warmers. Low sun behind her: warm rim light " +
      "on hair and shoulders, front of the body in soft shade. Photographed by a friend 4 metres away, camera at waist " +
      "height, 50mm lens, not a selfie",
    face: "catching her breath, soft half smile, light sweat",
  },
];

const REALISM =
  "Candid photo taken on an iPhone by a friend, unretouched skin with visible pores and uneven tone, no makeup, " +
  "matte natural lips, slight motion blur, imperfect framing, no brand logos on clothing.";

const SEEDREAM = { endpoint: "fal-ai/bytedance/seedream/v4.5/edit", usd: 0.04, size: { image_size: "portrait_4_3" } };
const NANOBANANA = { endpoint: "fal-ai/nano-banana-2/edit", usd: 0.08, size: { aspect_ratio: "3:4" } };
const FLUX = { endpoint: "fal-ai/flux-2-pro", usd: 0.03, size: { image_size: "portrait_4_3" } }; // $0.03/MP, ≈1 MP

const args = process.argv.slice(2);
const flag = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const only = flag("only");
const sceneNo = flag("scene");
const refs = args.filter((a) => !a.startsWith("--"));
if (refs.length === 0) throw new Error("Pass at least one reference image path");

const imageUrls = await Promise.all(refs.map(uploadLocal));
const look = describePersona(loadPersona());
const outDir = `output/scenes-${new Date().toISOString().slice(0, 16).replace(/[T:]/g, "-")}`;

const editPrompt = (s: Scene) =>
  "The same woman as in the reference image: keep her identity (face shape, eye colour, freckle pattern, haircut), " +
  `but not the portrait's pose or expression. ${look} Scene: ${s.action}. Her face: ${s.face}. ${REALISM}`;

const edit =
  (m: typeof SEEDREAM | typeof NANOBANANA) =>
  async (s: Scene, name: string): Promise<string> =>
    (await generate(m.endpoint, { prompt: editPrompt(s), image_urls: imageUrls, ...m.size }, m.usd, outDir, name))[0];

// Edit models build the whole body around the face close-up (big head, pasted-on light), so the body comes
// from a text-to-image model first and only the face is swapped in from the reference.
async function fluxSwap(s: Scene, name: string): Promise<string> {
  const bodyPrompt = `Photo of a ${look} Scene: ${s.action}. Her face: ${s.face}. ${REALISM}`;
  const [body] = await generate(FLUX.endpoint, { prompt: bodyPrompt, output_format: "jpeg", ...FLUX.size }, FLUX.usd, outDir, `${name}-body`);
  const swapPrompt =
    "Image 1 is the photo to keep. Replace only the face of the woman in image 1 with the woman from image 2: her face " +
    "shape, eye colour, freckle pattern and haircut. Keep everything else from image 1 unchanged: body, proportions, " +
    `pose, clothes, lighting, background and framing. Light the face like the rest of image 1. Her expression: ${s.face}.`;
  const [file] = await generate(
    SEEDREAM.endpoint,
    { prompt: swapPrompt, image_urls: [await uploadLocal(body), ...imageUrls], ...SEEDREAM.size },
    SEEDREAM.usd,
    outDir,
    name,
  );
  return file;
}

const PIPELINES = [
  { id: "seedream", run: edit(SEEDREAM) },
  { id: "nanobanana", run: edit(NANOBANANA) },
  { id: "fluxswap", run: fluxSwap },
];

const pipelines = only ? PIPELINES.filter((p) => only.split(",").includes(p.id)) : PIPELINES;
if (pipelines.length === 0) throw new Error(`Unknown pipeline "${only}"; known: ${PIPELINES.map((p) => p.id).join(", ")}`);
const picked = sceneNo ? [Number(sceneNo) - 1] : SCENES.map((_, i) => i);
if (picked.some((i) => !SCENES[i])) throw new Error(`Scene must be 1..${SCENES.length}`);

for (const i of picked) {
  for (const p of pipelines) process.stdout.write(`${await p.run(SCENES[i], `${p.id}-scene${i + 1}`)}\n`);
}
process.stdout.write(`${budgetLine()}\n`);
