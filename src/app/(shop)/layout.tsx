"use client";

import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="min-h-screen">{children}</main>
      <Footer />
    </CartProvider>
  );
}
