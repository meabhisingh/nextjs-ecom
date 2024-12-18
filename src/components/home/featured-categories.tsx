"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const categories = [
  {
    id: 1,
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661",
    description: "Latest gadgets and electronics",
  },
  {
    id: 2,
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050",
    description: "Trendy clothing and accessories",
  },
  {
    id: 3,
    name: "Home & Living",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a",
    description: "Beautiful home decor items",
  },
];

export function FeaturedCategories() {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12">
        Featured Categories
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Link href={`/products`}>
              <Card className="overflow-hidden group cursor-pointer">
                <div className="relative h-48">
                  <Image
                    src={category.image}
                    alt={category.name}
                    height={192}
                    width={320}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
