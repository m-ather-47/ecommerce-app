"use client";

import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="min-h-screen bg-gray-50">{children}</main>
      <Footer />
    </CartProvider>
  );
}
