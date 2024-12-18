import React, { Suspense } from "react";
import ProductsPage from "./page-component";
import { getProducts } from "@/lib/actions/product";
import { QueryType } from "@/types/types";

const Page = ({ searchParams }: { searchParams: QueryType }) => {
  return (
    <div>
      <Suspense fallback={<ProductsLoader />}>
        <Wrapper query={searchParams} />
      </Suspense>
    </div>
  );
};

const ProductsLoader = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-64 w-full rounded-lg" />
          <div className="h-4 bg-gray-200 w-3/4 mt-2 rounded" />
          <div className="h-4 bg-gray-200 w-1/2 mt-2 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const Wrapper = async ({ query }: { query: QueryType }) => {
  const products = await getProducts(query);

  return <ProductsPage products={products} />;
};

export default Page;
