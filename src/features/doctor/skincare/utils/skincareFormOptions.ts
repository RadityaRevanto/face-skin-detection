import type { SkincareApiConcern, SkincareApiSkinType } from "../types";

export function mapConcernOptions(concerns: SkincareApiConcern[]) {
  return concerns.map((concern) => ({
    // Backend kini menerima uuid pada concern_id (UuidResolver).
    id: concern.uuid,
    name: concern.name ?? "-",
  }));
}

export function mapSkinTypeOptions(skinTypes: SkincareApiSkinType[]) {
  return skinTypes.map((skinType) => ({
    id: skinType.uuid,
    name: skinType.name ?? "-",
  }));
}
