import { Metadata } from "next";
import WishlistClient from "./wishlist-client";

export const metadata: Metadata = {
  title: "My Wishlist | C2G Logistics",
  description: "View and manage your saved products.",
};

export default function WishlistPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <WishlistClient />
    </div>
  );
}
