"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CartActionType, CartItemType } from "@/types/types";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (item: CartItemType, action: CartActionType) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center space-x-4 border p-4 rounded-lg"
    >
      <Image
        src={item.image}
        alt={item.name}
        width={80}
        height={80}
        className="rounded-md"
      />
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-500">₹{item.price}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            onUpdateQuantity(
              { ...item, quantity: item.quantity - 1 },
              "decrease"
            )
          }
        >
          -
        </Button>
        <span>{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            onUpdateQuantity(
              { ...item, quantity: item.quantity + 1 },
              "increase"
            )
          }
        >
          +
        </Button>
      </div>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => onRemove(item.id)}
      >
        ×
      </Button>
    </motion.div>
  );
}
