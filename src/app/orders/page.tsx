import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyOrders } from "@/lib/actions/profile";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const Page = () => {
  return (
    <div>
      <main className="container py-6 m-auto">
        <Suspense fallback={<OrderLoader />}>
          <OrderWrapper />
        </Suspense>
      </main>
    </div>
  );
};

const OrderLoader = () => (
  <div className="space-y-6">
    <Skeleton className="h-36" />
    <Skeleton className="h-36" />
    <Skeleton className="h-36" />
    <Skeleton className="h-36" />
    <Skeleton className="h-36" />
  </div>
);

const OrderWrapper = async () => {
  const orders = await getMyOrders();

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-semibold">Order #{order.id}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(order.createdAt), "PPP")}
              </p>
            </div>
            <Badge
              variant={order.status === "DELIVERED" ? "default" : "secondary"}
            >
              {order.status}
            </Badge>
          </div>

          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center  text-sm">
                <Image
                  src={item.product.images[0]}
                  width={50}
                  height={50}
                  alt="Product"
                  className="h-12 w-12 object-cover "
                />
                <span>
                  {item.product.name} x{item.quantity}
                </span>
                <span className="ml-auto">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between  font-semibold">
              <span>Total</span>
              <span className="flex flex-col text-center">
                ₹{order.total.toFixed(2)}
                <Link
                  className=" text-muted-foreground text-xs  font-sans hover:underline"
                  href={`/orders/${order.id}`}
                >
                  View Details
                </Link>
              </span>{" "}
            </div>
          </div>
        </Card>
      ))}

      {orders.length === 0 && (
        <p className="text-center py-8 text-gray-500">
          {`You haven't placed any orders yet.`}
        </p>
      )}
    </div>
  );
};

export default Page;

export const dynamic = "force-dynamic";
