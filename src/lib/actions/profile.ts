"use server";

import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const updateProfile = async (formData: FormData) => {
  const session = await auth();
  const user = session?.user;
  if (!user) redirect(`/auth/signin?redirect=/profile`);

  const name = formData.get("name") as string;

  await prisma.user.update({
    where: { id: user.id },
    data: { name },
  });

  await signIn("github");

  revalidatePath("/profile");
};

export async function getUserOrders() {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Authentication required");
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  } catch (error) {
    console.error("Get orders error:", error);
    throw new Error("Failed to fetch orders");
  }
}

export const getMyLatestOrders = async () => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) redirect(`/auth/signin?redirect=/profile`);

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    return orders;
  } catch (error) {
    console.error("Get latest orders error:", error);
    throw new Error("Failed to fetch latest orders");
  }
};

export const getMyOrders = async () => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) redirect(`/auth/signin?redirect=/profile`);

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  } catch (error) {
    console.error("Get orders error:", error);
    throw new Error("Failed to fetch orders");
  }
};

export const getOrderById = async (id: string) => {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Authentication required");
    }

    return await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: {
                  select: { name: true },
                },
              },
            },
          },
        },
        coupon: true,
      },
    });
  } catch (error) {
    console.error("Get order error:", error);
    throw new Error("Failed to fetch order");
  }
};
