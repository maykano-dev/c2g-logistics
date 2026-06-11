import CartClient from "../../components/shop/cart-client";

export const metadata = {
  title: "Shopping Cart | C2G Mall",
  description: "Review your selected items and proceed to secure checkout.",
};

export default function CartPage() {
  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Your Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">Review your items, adjust quantities, and proceed to checkout to secure your C2G Mall order.</p>
        </div>

        <CartClient />
      </div>
    </div>
  );
}
