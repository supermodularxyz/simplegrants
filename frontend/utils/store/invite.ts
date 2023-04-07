import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface InviteState {
  inviteCode?: string;
  saveInvite: (inviteCode: string) => void;
  clearInvite: () => void;
}

export const useInviteStore = create<InviteState>()(
  devtools(
    persist(
      (set) => ({
        inviteCode: undefined,
        saveInvite: (inviteCode) => set(() => ({ inviteCode })),
        clearInvite: () => set(() => ({ inviteCode: undefined })),
      }),
      {
        name: "simplegrants-invite-code-storage",
      }
    )
  )
);
