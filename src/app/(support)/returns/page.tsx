import Link from "next/link";

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Returns & Exchanges</h1>
        <p className="mt-4 text-lg text-gray-600">
          Easy returns within 30 days. Your satisfaction is our priority.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {/* Return Policy Highlights */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black">
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">30-Day Returns</h3>
            <p className="mt-2 text-sm text-gray-600">Return any item within 30 days of delivery</p>
          </div>
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black">
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">Free Returns</h3>
            <p className="mt-2 text-sm text-gray-600">Prepaid return labels on all US orders</p>
          </div>
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black">
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">Easy Exchanges</h3>
            <p className="mt-2 text-sm text-gray-600">Swap for a different size or color</p>
          </div>
        </section>

        {/* Return Process */}
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">How to Return an Item</h2>
          <div className="mt-6 space-y-6">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">1</div>
              <div>
                <h3 className="font-medium text-gray-900">Start Your Return</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Log into your account, go to your order history, and select the item(s) you want to return.
                  Choose whether you want a refund or exchange.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">2</div>
              <div>
                <h3 className="font-medium text-gray-900">Print Your Label</h3>
                <p className="mt-1 text-sm text-gray-600">
                  We&apos;ll email you a prepaid return shipping label. Print it out and attach it to your package.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">3</div>
              <div>
                <h3 className="font-medium text-gray-900">Ship It Back</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Drop off your package at any authorized shipping location. Keep your receipt as proof of shipment.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">4</div>
              <div>
                <h3 className="font-medium text-gray-900">Receive Your Refund</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Once we receive and inspect your return, we&apos;ll process your refund within 3-5 business days.
                  Refunds are issued to your original payment method.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Return Policy Details */}
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Return Policy</h2>
          <div className="mt-6 space-y-4 text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900">Eligible Items</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>Items must be unworn, unwashed, and in original condition</li>
                <li>All original tags must be attached</li>
                <li>Items must be returned in original packaging</li>
                <li>Returns must be initiated within 30 days of delivery</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Non-Returnable Items</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>Final sale items (marked as such)</li>
                <li>Swimwear and intimates (for hygiene reasons)</li>
                <li>Personalized or custom items</li>
                <li>Gift cards</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Exchanges */}
        <section className="rounded-2xl bg-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900">Exchanges</h2>
          <p className="mt-4 text-gray-600">
            Need a different size or color? We make exchanges easy. Simply start a return and select
            &quot;Exchange&quot; as your preference. If your desired item is available, we&apos;ll ship it as soon as
            we receive your return.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Tip: For faster service, you can also place a new order for the correct item and return the
            original for a full refund.
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-2xl bg-black p-8 text-center text-white">
          <h2 className="text-xl font-semibold">Need Help with a Return?</h2>
          <p className="mt-2 text-gray-300">
            Our customer service team is ready to assist you.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-gray-100 transition"
            >
              View Your Orders
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
