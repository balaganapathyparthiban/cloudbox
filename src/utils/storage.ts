import { Web3Storage } from "web3.storage";

export const makeStorageClient = () => {
  if (!import.meta.env.VITE_WEB3_STORAGE_API_KEY) return null;

  return new Web3Storage({
    token: import.meta.env.VITE_WEB3_STORAGE_API_KEY.toString(),
  });
};
