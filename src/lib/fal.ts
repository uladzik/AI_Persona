import { fal } from "@fal-ai/client";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const COSTS_FILE = "output/costs.jsonl";
const BUDGET_USD = Number(process.env.BUDGET_USD ?? 3);

interface FalImage {
  url: string;
}

function spentUsd(): number {
  if (!existsSync(COSTS_FILE)) return 0;
  return readFileSync(COSTS_FILE, "utf8")
    .split("\n")
    .filter(Boolean)
    .reduce((sum, line) => sum + (JSON.parse(line) as { usd: number }).usd, 0);
}

/** Runs one fal endpoint under the budget cap and saves the images to disk (provider URLs expire). */
export async function generate(
  endpoint: string,
  input: Record<string, unknown>,
  estUsd: number,
  outDir: string,
  name: string,
): Promise<string[]> {
  const spent = spentUsd();
  if (spent + estUsd > BUDGET_USD) {
    throw new Error(`Budget $${BUDGET_USD} would be exceeded: spent $${spent.toFixed(2)} + $${estUsd}`);
  }
  mkdirSync(outDir, { recursive: true });
  const { data } = await fal.subscribe(endpoint, { input });
  appendFileSync(COSTS_FILE, JSON.stringify({ ts: new Date().toISOString(), endpoint, name, usd: estUsd }) + "\n");
  const images = (data as { images: FalImage[] }).images;

  return Promise.all(
    images.map(async (img, i) => {
      const ext = new URL(img.url).pathname.split(".").pop() ?? "jpg";
      const file = join(outDir, `${name}${images.length > 1 ? `-${i}` : ""}.${ext}`);
      writeFileSync(file, Buffer.from(await (await fetch(img.url)).arrayBuffer()));
      return file;
    }),
  );
}

export async function uploadLocal(path: string): Promise<string> {
  const blob = new Blob([readFileSync(path)]);
  return fal.storage.upload(new File([blob], basename(path)));
}

export function budgetLine(): string {
  return `spent $${spentUsd().toFixed(2)} of $${BUDGET_USD}`;
}
