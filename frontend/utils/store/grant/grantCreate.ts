import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { GrantDetailResponse } from "../../../types/grant";

interface GrantState {
  grant?: GrantDetailResponse;
  saveGrant: (grant: GrantDetailResponse) => void;
  clearGrant: () => void;
}

export const useGrantStore = create<GrantState>()(
  devtools(
    persist(
      (set) => ({
        grant: undefined,
        saveGrant: (grant) => set(() => ({ grant })),
        clearGrant: () => set(() => ({ grant: undefined })),
      }),
      {
        name: "simplegrants-Grant-storage",
      }
    )
  )
);
