import type { Asset } from "../types";

export function hasSrc(asset: Asset): asset is Extract<Asset, { src: string }> {
  return "src" in asset;
}