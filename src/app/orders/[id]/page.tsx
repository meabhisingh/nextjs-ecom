import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrderById } from "@/lib/actions/profile";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface OrderDetailsProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: OrderDetailsProps) => {
  return (
    <div className="container py-6 mx-auto">
      <Suspense fallback={<OrderDetailsLoader />}>
        <OrderDetails params={params} />
      </Suspense>{" "}
    </div>
  );
};

const OrderDetails = async ({ params }: OrderDetailsProps) => {
  const { id } = params;
  const order = await getOrderById(id);

  if (!order) redirect("/404");

  const calculatedSubtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingCost = calculatedSubtotal > 1000 ? 0 : 200;
  const tax = calculatedSubtotal * 0.18;
  const discount = order.coupon
    ? (order.coupon.discount / 100) * calculatedSubtotal
    : 0;
  const grandTotal = calculatedSubtotal + shippingCost + tax - discount;

  if (!order) {
    return <p className="text-center py-8 text-gray-500">Order not found.</p>;
  }

  return (
    <Card className="p-6">
      {/* Order Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <p className="text-xl font-semibold">Order #{order.id}</p>
          <p className="text-sm text-gray-500">
            Placed on {format(new Date(order.createdAt), "PPP")}
          </p>
        </div>
        <Badge
          variant={
            order.status === "DELIVERED"
              ? "default"
              : order.status === "PENDING"
              ? "outline"
              : "secondary"
          }
          className="capitalize"
        >
          {order.status.toLowerCase()}
        </Badge>
      </div>

      {/* Applied Coupon */}
      {order.coupon && (
        <div className="mb-6 p-4 bg-yellow-100 rounded">
          <p className="font-medium">Coupon Applied:</p>
          <p className="text-sm text-gray-700">
            {order.coupon.code} - {order.coupon.discount}% off
          </p>
        </div>
      )}

      {/* Order Items */}
      <div className="space-y-4">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row items-start md:items-center justify-between"
          >
            {/* Product Details */}
            <div className="flex items-center space-x-4">
              <Image
                src={item.product.images[0]}
                width={100}
                height={100}
                alt={item.product.name}
                className="h-20 w-20 object-cover rounded"
              />
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500">
                  {item.product.description}
                </p>
                <p className="text-sm text-gray-500">
                  Category: {item.product.category.name}
                </p>
              </div>
            </div>

            {/* Quantity and Price */}
            <div className="mt-4 md:mt-0 flex items-center space-x-6">
              <p className="text-sm">
                Quantity: <span className="font-semibold">{item.quantity}</span>
              </p>
              <p className="text-sm">
                Price:{" "}
                <span className="font-semibold">${item.price.toFixed(2)}</span>
              </p>
              <p className="text-sm">
                Total:{" "}
                <span className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-8 pt-6 border-t">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <p className="font-semibold text-lg">Order Summary</p>
          </div>
          <div className="w-full md:w-1/3">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${calculatedSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {order.coupon && (
              <div className="flex justify-between mb-2">
                <span>Discount ({order.coupon.discount}%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg mt-4">
              <span>Grand Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Link
          className="mt-4 inline-block text-muted-foreground  text-xs hover:underline"
          href={`/orders`}
        >
          Back to Orders
        </Link>
      </div>
    </Card>
  );
};

const OrderDetailsLoader = () => (
  <Card className="p-6">
    {/* Order Header */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <Skeleton className="h-6 w-32 mb-2" /> {/* Order #id */}
        <Skeleton className="h-4 w-48" /> {/* Placed on date */}
      </div>
      <Skeleton className="h-6 w-24 rounded-full" /> {/* Badge */}
    </div>

    {/* Applied Coupon */}
    <div className="mb-6 p-4  rounded">
      <Skeleton className="h-4 w-24 mb-2" /> {/* Coupon Applied */}
      <Skeleton className="h-4 w-40" /> {/* Coupon code and discount */}
    </div>

    {/* Order Items */}
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row items-start md:items-center justify-between"
        >
          {/* Product Details */}
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded" /> {/* Product Image */}
            <div>
              <Skeleton className="h-4 w-32 mb-2" /> {/* Product Name */}
              <Skeleton className="h-4 w-40 mb-2" /> {/* Description */}
              <Skeleton className="h-4 w-24" /> {/* Category */}
            </div>
          </div>

          {/* Quantity and Price */}
          <div className="mt-4 md:mt-0 flex items-center space-x-6">
            <Skeleton className="h-4 w-16" /> {/* Quantity */}
            <Skeleton className="h-4 w-16" /> {/* Price */}
            <Skeleton className="h-4 w-16" /> {/* Total */}
          </div>
        </div>
      ))}
    </div>

    {/* Order Summary */}
    <div className="mt-8 pt-6 border-t">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div>
          <Skeleton className="h-6 w-24 mb-4" /> {/* Order Summary */}
        </div>
        <div className="w-full md:w-1/3">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-24" /> {/* Subtotal */}
            <Skeleton className="h-4 w-16" /> {/* Subtotal Value */}
          </div>
          <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-24" /> {/* Shipping */}
            <Skeleton className="h-4 w-16" /> {/* Shipping Value */}
          </div>
          <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-24" /> {/* Tax */}
            <Skeleton className="h-4 w-16" /> {/* Tax Value */}
          </div>
          <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-24" /> {/* Discount */}
            <Skeleton className="h-4 w-16" /> {/* Discount Value */}
          </div>
          <div className="flex justify-between font-semibold text-lg mt-4">
            <Skeleton className="h-5 w-24" /> {/* Grand Total */}
            <Skeleton className="h-5 w-16" /> {/* Grand Total Value */}
          </div>
        </div>
      </div>
      <Skeleton className="h-4 w-32 mt-4" /> {/* Back to Orders Link */}
    </div>
  </Card>
);

export default Page;

export const dynamic = "force-dynamic";
