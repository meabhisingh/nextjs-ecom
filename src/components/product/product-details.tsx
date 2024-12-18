"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Category, Product } from "@prisma/client";
import { useState } from "react";
import { useCart } from "@/store";
import { CartItemType } from "@/types/types";
import { toast } from "sonner";

type Props = {
  product: Product & { category: Category };
};
const ProductDetailsPage = ({ product }: Props) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

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
    <motion.div
      className="container mx-auto p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <motion.div variants={itemVariants}>
            <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={itemVariants}
          >
            <div>
              <motion.img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-auto rounded-lg shadow-lg"
                variants={itemVariants}
              />
            </div>
            <div className="space-y-4">
              <motion.p
                className="text-2xl font-semibold"
                variants={itemVariants}
              >
                ₹{product.price.toFixed(2)}
              </motion.p>
              <motion.div variants={itemVariants}>
                <Badge variant="secondary">{product.category.name}</Badge>
              </motion.div>
              <motion.p className="text-gray-600" variants={itemVariants}>
                {product.description}
              </motion.p>
              <motion.div variants={itemVariants}>
                <Button
                  disabled={loading}
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
                  size="lg"
                >
                  Add to Cart
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductDetailsPage;
