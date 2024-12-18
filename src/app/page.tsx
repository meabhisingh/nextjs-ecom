import { ProductGrid } from "@/components/product/product-grid";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { getProducts } from "@/lib/actions/product";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <FeaturedCategories />
      <Suspense fallback={<MainLoader />}>
        <MainComponent />
      </Suspense>
    </div>
  );
}

const MainLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: 2 }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-200 h-64 w-full rounded-lg" />
        <div className="h-4 bg-gray-200 w-3/4 mt-2 rounded" />
        <div className="h-4 bg-gray-200 w-1/2 mt-2 rounded" />
      </div>
    ))}
  </div>
);

const MainComponent = async () => {
  const products = await getProducts({ category: "all", search: "" });
  return <ProductGrid products={products} />;
};
