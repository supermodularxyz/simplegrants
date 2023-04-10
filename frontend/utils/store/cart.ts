import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { BasicGrantResponse } from "../../types/grant";

// The info about a grant that will be checked out
interface GrantCheckoutItem {
  id: string;
  image: string;
  name: string;
  amount: number;
}

interface CartState {
  grants: GrantCheckoutItem[];
  addToCart: (grant: BasicGrantResponse) => void;
  updateCart: (id: string, amount: number) => void;
  removeFromCart: (grantId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        grants: [],
        addToCart: (grant) =>
          set((state) => ({
            grants: [
              ...state.grants,
              {
                id: grant.id,
                image: grant.image,
                name: grant.name,
                amount: 0,
              },
            ],
          })),
        updateCart: (id: string, amount: number) =>
          set((state) => ({
            grants: state.grants.map((g) =>
              g.id === id
                ? {
                    ...g,
                    amount: amount,
                  }
                : g
            ),
          })),
        removeFromCart: (grantId) =>
          set((state) => {
            const grants = state.grants.filter((grant) => grant.id !== grantId);
            return { grants: grants };
          }),
        clearCart: () => set(() => ({ grants: [] })),
      }),
      {
        name: "simplegrants-cart-storage",
      }
    )
  )
);
