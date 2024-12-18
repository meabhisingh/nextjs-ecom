"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7)",
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center text-white px-4"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Discover Amazing Products
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Shop the latest trends with our curated collection of premium products
        </p>
        <Link href="/products">
          <Button size="lg" className="bg-white text-black hover:bg-gray-100">
            Shop Now
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}