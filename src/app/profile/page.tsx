import { auth } from "@/auth";
import { SubmitButton } from "@/components/client/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMyLatestOrders, updateProfile } from "@/lib/actions/profile";
import { format } from "date-fns";
import Image from "next/image";
import { Suspense } from "react";

export default async function Profile() {
  const session = await auth();
  const user = session?.user;

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-center">
            {user.image && (
              <Image
                height={128}
                width={128}
                src={user.image}
                alt={user.name || "Profile"}
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
            )}
            <h2 className="font-semibold text-xl">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </Card>

        <div className="md:col-span-3">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Order History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Suspense fallback={<OrderHistoryLoader />}>
                <OrderHistory />
              </Suspense>
            </TabsContent>

            <TabsContent value="settings">
              <form
                action={updateProfile}
                className="space-y-6 p-4 w-full max-w-md"
              >
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input name="name" defaultValue={user.name || ""} />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    readOnly
                    disabled
                    value={user.email || ""}
                  />
                </div>
                <SubmitButton loaderClassName="bg-white dark:bg-white">
                  Update Profile
                </SubmitButton>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

const OrderHistoryLoader = () => (
  <div className="space-y-6">
    <Skeleton className="h-36" />
    <Skeleton className="h-36" />
    <Skeleton className="h-36" />
  </div>
);

const OrderHistory = async () => {
  const orders = await getMyLatestOrders();

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
            <Badge>{order.status}</Badge>
          </div>

          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.product.name} x{item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
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

export const dynamic = "force-dynamic";
