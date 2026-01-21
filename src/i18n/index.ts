import type { LandingDict, Lang } from "./types";
import { en } from "./en";
import { ua } from "./ua";

export type { LandingDict, Lang };

export function getLandingDict(lang: Lang): LandingDict {
  return lang === "ua" ? ua : en;
}
