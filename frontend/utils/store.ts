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
      (set) => ({
        grants: [],
        addToCart: (grant) =>
          set((state) => ({ grants: [...state.grants, grant] })),
        updateCart: (grant) =>
          set((state) => {
            const grantIndex = state.grants.findIndex(
              (data) => data.id === grant.id
            );
            state.grants[grantIndex].amount = grant.amount;
            return { grants: [...state.grants] };
          }),
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
