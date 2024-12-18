import CartItemsList from "@/components/cart/cart-list";

export default function Cart() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <CartItemsList />
    </div>
  );
}
