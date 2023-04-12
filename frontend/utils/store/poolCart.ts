import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { BasicPoolResponse } from "../../types/pool";

// The info about a pool that will be checked out
interface PoolCheckoutItem {
  id: string;
  image: string;
  name: string;
  amount: number;
}

interface PoolCartState {
  pools: PoolCheckoutItem[];
  addToCart: (pool: BasicPoolResponse) => void;
  updateCart: (id: string, amount: number) => void;
  removeFromCart: (poolId: string) => void;
  clearCart: () => void;
}

export const usePoolCartStore = create<PoolCartState>()(
  devtools(
    persist(
      (set) => ({
        pools: [],
        addToCart: (pool) =>
          set((state) => ({
            pools: [
              ...state.pools,
              {
                id: pool.id,
                image: "/assets/pool-placeholder-image.png",
                name: pool.name,
                amount: 0,
              },
            ],
          })),
        updateCart: (id: string, amount: number) =>
          set((state) => ({
            pools: state.pools.map((g) =>
              g.id === id
                ? {
                    ...g,
                    amount: amount,
                  }
                : g
            ),
          })),
        removeFromCart: (poolId) =>
          set((state) => {
            const pools = state.pools.filter((pool) => pool.id !== poolId);
            return { pools: pools };
          }),
        clearCart: () => set(() => ({ pools: [] })),
      }),
      {
        name: "simplegrants-pool-cart-storage",
      }
    )
  )
);
