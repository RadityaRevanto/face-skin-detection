export { SkinTypesContainer } from "./components/SkinTypesContainer";
export { SkinTypeTable } from "./components/SkinTypeTable";
export { SkinTypeForm } from "./components/SkinTypeForm";
export {
  getSkinTypes,
  createSkinType,
  updateSkinType,
  deleteSkinType,
} from "./lib/skinTypesService";
export type { SkinType, SkinTypeListResponse } from "./types";
