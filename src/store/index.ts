import { CartActionType, CartItemType } from "@/types/types";
import { create } from "zustand";

type CartStoreState = {
  items: CartItemType[];
  addItem: (item: CartItemType, action: CartActionType) => void;
  removeItem: (id: string) => void;
  emptyCart: () => void;
  setItems: (items: CartItemType[]) => void;
  subtotal: number;
};

const getTotal = (items: CartItemType[]) =>
  items.reduce((acc, i) => acc + i.price * i.quantity, 0);

export const useCart = create<CartStoreState>((set) => ({
  subtotal: 0,
  items: [],
  addItem: (item, action) => {
    set((state) => {
      const itemIndex = state.items.findIndex((i) => i.id === item.id);

      if (itemIndex === -1) {
        const newItems = [...state.items, item];
        state.subtotal = getTotal(newItems);
        window.localStorage.setItem("cart", JSON.stringify(newItems));
        return { items: newItems };
      }

      const newItems = [...state.items];
      if (action === "decrease") {
        newItems[itemIndex].quantity -= 1;
        state.subtotal = getTotal(newItems);
        window.localStorage.setItem("cart", JSON.stringify(newItems));
        return { items: newItems };
      } else {
        newItems[itemIndex].quantity += 1;
        state.subtotal = getTotal(newItems);
        window.localStorage.setItem("cart", JSON.stringify(newItems));
        return { items: newItems };
      }
    });
  },
  removeItem: (id) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      state.subtotal = getTotal(newItems);
      window.localStorage.setItem("cart", JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  emptyCart: () => {
    set({ items: [], subtotal: 0 });
    window.localStorage.setItem("cart", JSON.stringify([]));
  },
  setItems: (items) => {
    set({ items });
  },
}));
