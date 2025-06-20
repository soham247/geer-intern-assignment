import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[];
  hasHydrated: boolean;

  addItem: (slug: string) => void;
  removeItem: (slug: string) => void;
  getTotalItems: () => number;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    immer((set, get) => ({
      items: [],
      hasHydrated: false,

      setHasHydrated: (hasHydrated) => {
        set((state) => {
          state.hasHydrated = hasHydrated;
        });
      },

      addItem: (slug) => {
        set((state) => {
          if (!state.items.includes(slug)) {
            state.items.push(slug);
          }
        });
      },

      removeItem: (slug) => {
        set((state) => {
          state.items = state.items.filter((item) => item !== slug);
        });
      },

      getTotalItems: () => {
        return get().items.length;
      },
    })),
    {
      name: "wishlist-storage",
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
