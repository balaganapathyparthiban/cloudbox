import GUN from "gun";
import "gun/sea";

export const db = GUN([
  import.meta.env.VITE_GUN_PEER_1,
  import.meta.env.VITE_GUN_PEER_2,
  import.meta.env.VITE_GUN_PEER_3,
]);

export const user = db.user();

export const SEA = GUN.SEA;
