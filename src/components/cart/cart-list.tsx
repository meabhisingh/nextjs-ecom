"use client";

import { useCart } from "@/store";
import { CartActionType, CartItemType } from "@/types/types";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";

const CartItemsList = () => {
  const { items, addItem, removeItem, setItems } = useCart();

  const updateQuantity = (item: CartItemType, action: CartActionType) => {
    if (item.quantity >= item.stock)
      return toast.error("Cannot add more items");
    else if (item.quantity < 1) return removeItem(item.id);
    addItem(item, action);
    toast.success("Cart updated");
  };

  const removeHandler = (id: string) => {
    removeItem(id);
    toast.success("Item removed from cart");
  };

  useEffect(() => {
    const cartItems = window.localStorage.getItem("cart");
    if (cartItems) {
      setItems(JSON.parse(cartItems));
    }
  }, [setItems]);

  return items.length === 0 ? (
    <div className="text-center py-8">
      <p>Your cart is empty</p>
    </div>
  ) : (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeHandler}
          />
        ))}
      </div>

      <div className="md:col-span-1">
        <CartSummary />
      </div>
    </div>
  );
};

export default CartItemsList;
