import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { PoolResponse } from "../../../types/pool";
import { GrantResponse } from "../../../types/grant";

interface PoolState {
  pool?: PoolResponse;
  grants: GrantResponse[];
  savePool: (pool: PoolResponse) => void;
  clearPool: () => void;
  addGrantsToPool: (grant: GrantResponse) => void;
  removeGrantFromPool: (grant: GrantResponse) => void;
  clearGrantsFromPool: () => void;
}

export const usePoolStore = create<PoolState>()(
  devtools(
    persist(
      (set) => ({
        pool: undefined,
        grants: [],
        savePool: (pool) => set(() => ({ pool })),
        clearPool: () => set(() => ({ pool: undefined })),
        addGrantsToPool: (grant) =>
          set((state) => ({
            grants: [...state.grants, grant],
          })),
        removeGrantFromPool: (grant) =>
          set((state) => {
            const grants = state.grants.filter((obj) => obj.id !== grant.id);
            return { grants: grants };
          }),
        clearGrantsFromPool: () => set(() => ({ grants: [] })),
      }),
      {
        name: "simplegrants-pool-storage",
      }
    )
  )
);
