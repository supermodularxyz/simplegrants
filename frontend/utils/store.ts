import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// The info about a grant that will be checked out
interface GrantCheckoutItem {
  id: string;
  amount: number;
}

interface CartState {
  grants: GrantCheckoutItem[];
  addToCart: (grant: GrantCheckoutItem) => void;
  updateCart: (grant: GrantCheckoutItem) => void;
  removeFromCart: (grantId: string) => void;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        grants: [],
        addToCart: (grant) =>
          set((state) => ({ grants: [...state.grants, grant] })),
        updateCart: (grant) =>
          set((state) => ({
            grants: state.grants.map((g) => (g.id === grant.id ? grant : g)),
          })),
        removeFromCart: (grantId) =>
          set((state) => {
            const grants = state.grants.filter((grant) => grant.id !== grantId);
            return { grants: grants };
          }),
      }),
      {
        name: "simplegrants-cart-storage",
      }
    )
  )
);
