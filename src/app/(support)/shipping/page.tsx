import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Shipping Information</h1>
        <p className="mt-4 text-lg text-gray-600">
          Everything you need to know about our shipping options and policies.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {/* Shipping Options */}
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Shipping Options</h2>
          <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Delivery Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">Standard Shipping</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">5-7 business days</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">$5.99 (Free over $50)</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">Express Shipping</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">2-3 business days</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">$12.99</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">Next Day Delivery</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">1 business day</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">$24.99</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            * Delivery times are estimates and may vary based on location and carrier conditions.
          </p>
        </section>

        {/* Free Shipping */}
        <section className="rounded-2xl bg-black p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
              <svg className="h-7 w-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Free Shipping on Orders $50+</h3>
              <p className="mt-1 text-gray-300">Enjoy complimentary standard shipping on all qualifying orders.</p>
            </div>
          </div>
        </section>

        {/* Processing Time */}
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Order Processing</h2>
          <div className="mt-4 space-y-4 text-gray-600">
            <p>
              Orders are processed within 1-2 business days after payment confirmation. You&apos;ll receive a confirmation
              email with tracking information once your order ships.
            </p>
            <p>
              Orders placed after 2 PM EST or on weekends/holidays will be processed the next business day.
            </p>
          </div>
        </section>

        {/* International Shipping */}
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">International Shipping</h2>
          <div className="mt-4 space-y-4 text-gray-600">
            <p>
              We ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination.
            </p>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm">
                <strong className="text-gray-900">Note:</strong> International orders may be subject to customs duties
                and taxes, which are the responsibility of the recipient.
              </p>
            </div>
          </div>
        </section>

        {/* Tracking */}
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Track Your Order</h2>
          <p className="mt-4 text-gray-600">
            Once your order ships, you&apos;ll receive a shipping confirmation email with a tracking number.
            You can track your order at any time using our order tracking page.
          </p>
          <Link
            href="/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
          >
            Track Your Order
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </section>

        {/* Contact */}
        <section className="rounded-2xl bg-gray-100 p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Have Questions?</h2>
          <p className="mt-2 text-gray-600">
            Our customer service team is here to help with any shipping inquiries.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block text-sm font-medium text-black hover:underline"
          >
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  );
}
