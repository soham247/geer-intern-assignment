import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

interface ItemData {
    slug: string;
    quantity: number;
}

interface CartState {
    items: ItemData[];
    hasHydrated: boolean;
    
    // Core cart operations
    addItem: (item: ItemData) => void;
    removeItem: (slug: string) => void;
    updateQuantity: (slug: string, quantity: number) => void;
    clearCart: () => void;
    
    // Utility functions
    getTotalItems: () => number;
    getTotalQuantity: () => number;
    getItemQuantity: (slug: string) => number;
    setHasHydrated: (hasHydrated: boolean) => void;
}

export const useCart = create<CartState>()(
    persist(
        immer((set, get) => ({
            items: [],
            hasHydrated: false,
            
            setHasHydrated: (hasHydrated) => {
                set((state) => {
                    state.hasHydrated = hasHydrated;
                });
            },
            
            addItem: (item) => {
                set((state) => {
                    const existingItem = state.items.find(i => i.slug === item.slug);
                    if (existingItem) {
                        existingItem.quantity += item.quantity;
                    } else {
                        state.items.push(item);
                    }
                });
            },
            
            removeItem: (slug) => {
                set((state) => {
                    state.items = state.items.filter(item => item.slug !== slug);
                });
            },
                
            updateQuantity: (slug, quantity) => {
                set((state) => {
                    const item = state.items.find(i => i.slug === slug);
                    if (item) {
                        if (quantity <= 0) {
                            state.items = state.items.filter(i => i.slug !== slug);
                        } else {
                            item.quantity = quantity;
                        }
                    }
                });
            },
                
            clearCart: () => {
                set((state) => {
                    state.items = [];
                });
            },
                
            getTotalItems: () => {
                return get().items.length;
            },

            getTotalQuantity: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getItemQuantity: (slug) => {
                const item = get().items.find(i => i.slug === slug);
                return item ? item.quantity : 0;
            }
        })),
        {
            name: "cart-storage",
            version: 1,
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);