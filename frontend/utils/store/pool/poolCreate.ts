import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { PoolResponse } from "../../../types/pool";

interface PoolState {
  pool?: PoolResponse;
  savePool: (pool: PoolResponse) => void;
  clearPool: () => void;
}

export const usePoolStore = create<PoolState>()(
  devtools(
    persist(
      (set) => ({
        pool: undefined,
        savePool: (pool) => set(() => ({ pool })),
        clearPool: () => set(() => ({ pool: undefined })),
      }),
      {
        name: "simplegrants-pool-storage",
      }
    )
  )
);
