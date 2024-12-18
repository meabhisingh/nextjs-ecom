"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { CartItemType, ProductType } from "@/types/types";
import { useCart } from "@/store";

export function ProductGrid({ products = [] }: { products: ProductType[] }) {
  const [loading, setLoading] = useState<boolean>(false);

  const { addItem } = useCart((state) => state);

  const addToCart = async (product: CartItemType) => {
    setLoading(true);
    try {
      addItem(product, "increase");

      // Add to cart logic here
      toast.success("Added to Cart");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to add product to cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12">
        Featured Products
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden group">
              <Link href={`/products/${product.id}`}>
                <div className="relative h-48">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    height={300}
                    width={400}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-lg font-semibold mb-2 hover:text-primary">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-4">₹{product.price}</p>
                <Button
                  className="w-full"
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      stock: product.stock,
                      image: product.images[0],
                      quantity: 1,
                    })
                  }
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
