"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CartItemType } from "@/types/types";
import { Order, OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createOrder(amount: number, items: CartItemType[]) {
  try {
    const session = await auth();
    if (!session) return redirect("/auth/signin");

    const payment = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    let order: Order | undefined;

    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
          select: { stock: true },
        });

        if (product?.stock && product?.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ID: ${item.id}`);
        }
      }

      order = await tx.order.create({
        data: {
          userId: session.user.id,
          total: amount,
          status: "PENDING",
          items: {
            createMany: {
              data: items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
        },
      });

      const updatePromises = items.map((item) =>
        tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        })
      );

      await Promise.all(updatePromises);
    });

    return {
      orderId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      order: order,
    };
  } catch (error) {
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const session = await auth();
    if (!session) throw new Error("Authentication required");

    await prisma.order.update({
      where: { id: orderId },
      data: { status: status },
    });

    revalidatePath("/orders");
    revalidatePath("/profile");
  } catch (error) {
    console.error("Order status update error:", error);
    throw new Error("Failed to update order status");
  }
}

export const getRazorpayKey = () => process.env.RAZORPAY_KEY_ID!;
