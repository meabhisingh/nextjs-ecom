"use client";

import { Button } from "@/components/ui/button";
import {
  createOrder,
  getRazorpayKey,
  updateOrderStatus,
} from "@/lib/actions/cart";
import { useCart } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CartSummary = () => {
  const { items, subtotal, emptyCart } = useCart();

  const shippingCharges = subtotal > 200 ? 0 : 200;
  const tax = Number((subtotal * 0.18).toFixed(0));
  const total = subtotal + tax + shippingCharges;
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      const orderInfo = await createOrder(total, items);

      const apiKey = getRazorpayKey();

      if (!orderInfo) return;

      const { orderId, amount, currency, order } = orderInfo;

      const options = {
        key: apiKey,
        amount: Number(amount),
        currency: currency,
        name: "Store",
        description: "Purchase Description",
        order_id: orderId,
        handler: async function () {
          if (!order)
            return toast.error(
              "Something went wrong! If debited, you will get refund within 7 days."
            );
          await updateOrderStatus(order.id, "PROCESSING");
          toast.success("Your order has been placed successfully!");
          emptyCart();
          document.body.removeChild(script);
          router.push("/orders");
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("There was an error processing your payment.");
    }
  };

  return (
    <div className="border p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shippingCharges === 0 ? "FREE" : shippingCharges}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹{tax}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
      <Button
        className="w-full mt-4"
        onClick={handleCheckout}
        disabled={items.length === 0}
      >
        Proceed to Checkout
      </Button>
    </div>
  );
};
