import { Grant } from "@prisma/client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// The info about a grant that will be checked out
interface GrantCheckoutItem {
  id: string;
  image: string;
  name: string;
  amount: number;
}

interface CartState {
  grants: GrantCheckoutItem[];
  addToCart: (grant: Grant) => void;
  updateCart: (grant: Grant) => void;
  removeFromCart: (grantId: string) => void;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
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
        updateCart: (grant) =>
          set((state) => ({
            grants: state.grants.map((g) =>
              g.id === grant.id
                ? {
                    id: grant.id,
                    image: grant.image,
                    name: grant.name,
                    amount: 0,
                  }
                : g
            ),
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
