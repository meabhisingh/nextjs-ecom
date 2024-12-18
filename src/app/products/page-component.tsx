"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/store";
import { CartItemType } from "@/types/types";
import { Category, Product } from "@prisma/client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type ProductWithCategory = Product & { category: Category };

type Props = {
  products: ProductWithCategory[];
};

export default function ProductsPage({ products }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

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

  const categories = useMemo(() => {
    const categoryMap = new Map<string, Category>();

    products.forEach((product) => {
      if (product.category && product.category.id) {
        categoryMap.set(product.category.id, product.category);
      }
    });
    const uniqueCategories: Category[] = Array.from(categoryMap.values());

    return uniqueCategories;
  }, [products]);

  const router = useRouter();
  const addInQuery = useCallback(
    (key: string, value: string) => {
      const url = new URL(window.location.href);
      url.searchParams.set(key, value);
      router.push(url.toString());
    },
    [router]
  );

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      addInQuery("search", search);
    }, 500);

    return () => clearTimeout(timeoutID);
  }, [search, addInQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Select
          defaultValue="all"
          onValueChange={(value) => addInQuery("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="search"
          placeholder="Search products..."
        />

        <Link href="/products">
          <Button variant="outline">Reset Filters</Button>
        </Link>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <Image
                  src={product.images[0]}
                  width={300}
                  height={300}
                  alt="Product"
                  className="aspect-square bg-gray-200 rounded-lg mb-4"
                />
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">₹{product.price}</p>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
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
                  className="w-full"
                >
                  Add to Cart
                </Button>
                <Link className="w-full" href={`/products/${product.id}`}>
                  <Button variant={"outline"} className="w-full">
                    View
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
