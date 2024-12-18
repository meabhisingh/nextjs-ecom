import { getAllCategories } from "@/lib/actions/product";
import Link from "next/link";
import { Suspense } from "react";

const Page = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Suspense fallback={<CategoriesLoader />}>
          <CategoriesWrapper />
        </Suspense>
      </div>
    </div>
  );
};

const CategoriesLoader = () =>
  Array.from({ length: 8 }).map((_, i) => (
    <div key={i} className="animate-pulse">
      <div className="bg-gray-200 h-64 w-full rounded-lg" />
      <div className="h-4 bg-gray-200 w-3/4 mt-2 rounded" />
      <div className="h-4 bg-gray-200 w-1/2 mt-2 rounded" />
    </div>
  ));

const CategoriesWrapper = async () => {
  const categories = await getAllCategories();

  return categories.map((category, i) => {
    const fromColor = `hsl(${(i + 1) * 10},60%,50%)`;
    const toColor = `hsl(${(i + 1) * 20},60%,50%)`;

    return (
      <Link
        key={category.id}
        href={`/products?category=${category.id}`}
        style={{
          backgroundImage: `linear-gradient(to right, ${fromColor}, ${toColor})`,
        }}
        className={`border flex justify-center group items-center h-[200px] w-[300px]  rounded-lg hover:shadow-lg transition-shadow duration-200`}
      >
        <h2 className="text-2xl rounded-xl text-white group-hover:scale-110 transition-all  p-4  bg-opacity-70  font-semibold">
          {category.name.toUpperCase()}
        </h2>
      </Link>
    );
  });
};

export default Page;
