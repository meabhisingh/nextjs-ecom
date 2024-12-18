"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { QueryType } from "@/types/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
};

export const getProducts = async (query: QueryType) => {
  const categoryId = query.category;
  const search = query.search;

  return await prisma.product.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
      categoryId: categoryId === "all" ? undefined : categoryId,
    },
    include: { category: true },
  });
};

export const getProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id: id },
    include: { category: true },
  });
};

export const getProductReviews = async (productId: string) => {
  return await prisma.review.findMany({
    where: { productId },
    include: { user: true },
    orderBy: { updatedAt: "desc" },
  });
};

export const deleteProductReview = async (formData: FormData) => {
  const id = formData.get("id") as string;

  const session = await auth();
  const user = session?.user;
  if (!user) redirect(`/auth/signin?redirect=/products/${id}`);

  await prisma.review.delete({ where: { id: id } });

  revalidatePath(`/products/${id}`);
};

export const createProductReview = async (formData: FormData) => {
  const rating = formData.get("rating") as string;
  const comment = formData.get("comment") as string;
  const productId = formData.get("productId") as string;

  const session = await auth();
  const user = session?.user;
  if (!user) redirect(`/auth/signin?redirect=/products/${productId}`);

  await prisma.review.create({
    data: {
      rating: Number(rating),
      comment,
      productId,
      userId: user.id,
    },
  });

  return revalidatePath(`/products/${productId}`);
};
