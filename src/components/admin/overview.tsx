"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const dummyData = {
  sales: [
    { name: "Jan", amount: 2400 },
    { name: "Feb", amount: 1398 },
    { name: "Mar", amount: 9800 },
    { name: "Apr", amount: 3908 },
    { name: "May", amount: 4800 },
    { name: "Jun", amount: 3800 },
  ],
  categories: [
    { name: "Electronics", value: 400 },
    { name: "Clothing", value: 300 },
    { name: "Books", value: 200 },
    { name: "Home", value: 278 },
  ],
};

export function Overview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <h3 className="font-semibold">Total Revenue</h3>
        <p className="text-2xl font-bold">$45,231.89</p>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold">Orders</h3>
        <p className="text-2xl font-bold">+2350</p>
        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold">Products</h3>
        <p className="text-2xl font-bold">+12,234</p>
        <p className="text-xs text-muted-foreground">+19% from last month</p>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold">Active Users</h3>
        <p className="text-2xl font-bold">+573</p>
        <p className="text-xs text-muted-foreground">+201 since last hour</p>
      </Card>

      <Card className="p-6 md:col-span-2">
        <h3 className="font-semibold mb-4">Sales Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dummyData.sales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 md:col-span-2">
        <h3 className="font-semibold mb-4">Sales by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dummyData.categories}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
