import { readFileSync } from "node:fs";

interface Appearance {
  build: string;
  face: string;
  skin: string;
  hair: string | null;
  eyes: string | null;
  style: string | null;
  negative?: string[];
}

export interface Persona {
  id: string;
  age: number;
  appearance: Appearance;
}

export function loadPersona(path = "persona/persona.json"): Persona {
  return JSON.parse(readFileSync(path, "utf8")) as Persona;
}

/** Describes the persona's look from the canon only; null fields are left to the model. */
export function describePersona(p: Persona): string {
  const a = p.appearance;
  const parts = [`${p.age}-year-old woman`, a.build, a.face, a.skin, a.hair, a.eyes, a.style];
  const avoid = a.negative?.length ? ` Avoid: ${a.negative.join(", ")}.` : "";
  return parts.filter(Boolean).join(", ") + "." + avoid;
}
