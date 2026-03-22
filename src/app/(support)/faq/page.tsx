"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How can I track my order?",
        a: "Once your order ships, you'll receive a confirmation email with a tracking number. You can also track your order by logging into your account and viewing your order history, or by visiting our Track Order page.",
      },
      {
        q: "How long does shipping take?",
        a: "Standard shipping typically takes 5-7 business days. Express shipping delivers in 2-3 business days, and Next Day Delivery is available for orders placed before 2 PM EST. Delivery times may vary based on your location.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer free standard shipping on all orders over $50. This applies to US orders only. International shipping rates vary by destination.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "We process orders quickly to get them to you fast. If you need to make changes, please contact us immediately at support@vogue.com. We can only modify orders that haven't entered the shipping process yet.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return policy on all eligible items. Items must be unworn, unwashed, with original tags attached, and in original packaging. Some items like swimwear, intimates, and final sale items are not eligible for return.",
      },
      {
        q: "How do I return an item?",
        a: "Log into your account, go to your order history, and select 'Start Return' for the item you wish to return. We'll email you a prepaid return label. Pack the item securely and drop it off at any authorized shipping location.",
      },
      {
        q: "How long do refunds take?",
        a: "Once we receive your return, we'll inspect it within 2 business days. Refunds are processed within 3-5 business days after inspection and will be issued to your original payment method. It may take additional time for your bank to post the refund.",
      },
      {
        q: "Can I exchange an item?",
        a: "Yes! When starting a return, select 'Exchange' as your preference. If your desired size or color is available, we'll ship it as soon as we receive your return. For faster service, you can place a new order and return the original for a refund.",
      },
    ],
  },
  {
    category: "Products & Sizing",
    questions: [
      {
        q: "How do I find my size?",
        a: "Each product page includes a size guide with detailed measurements. We recommend measuring yourself and comparing to our size charts. If you're between sizes, we generally recommend sizing up for a more comfortable fit.",
      },
      {
        q: "Are your products true to size?",
        a: "Our products are designed to be true to size. However, fit can vary by style. Check individual product descriptions for fit notes (e.g., 'runs small' or 'relaxed fit') and customer reviews for additional guidance.",
      },
      {
        q: "How do I care for my items?",
        a: "Care instructions are included on each product's tag and in the product description online. Generally, we recommend washing in cold water and air drying to maintain the quality and longevity of your items.",
      },
    ],
  },
  {
    category: "Account & Payment",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All transactions are secure and encrypted.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We use industry-standard SSL encryption to protect your personal and payment information. We never store your complete credit card details on our servers.",
      },
      {
        q: "How do I create an account?",
        a: "Click 'Sign In' in the top navigation and select 'Create Account.' You'll need to provide your email address and create a password. Having an account allows you to track orders, save addresses, and check out faster.",
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "Click 'Sign In,' then 'Forgot Password.' Enter your email address and we'll send you a link to reset your password. The link expires after 24 hours for security purposes.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  function toggleQuestion(id: string) {
    setOpenIndex(openIndex === id ? null : id);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
        <p className="mt-4 text-lg text-gray-600">
          Find answers to common questions about orders, shipping, returns, and more.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {faqs.map((category) => (
          <section key={category.category} className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900">{category.category}</h2>
            <div className="mt-6 divide-y divide-gray-100">
              {category.questions.map((item, idx) => {
                const id = `${category.category}-${idx}`;
                const isOpen = openIndex === id;
                return (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0">
                    <button
                      onClick={() => toggleQuestion(id)}
                      className="flex w-full items-start justify-between gap-4 text-left"
                    >
                      <span className="font-medium text-gray-900">{item.q}</span>
                      <svg
                        className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isOpen && (
                      <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.a}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Still Need Help */}
      <section className="mt-12 rounded-2xl bg-black p-8 text-center text-white">
        <h2 className="text-xl font-semibold">Still Have Questions?</h2>
        <p className="mt-2 text-gray-300">
          Can&apos;t find what you&apos;re looking for? Our support team is here to help.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-gray-100 transition"
          >
            Contact Us
          </Link>
          <a
            href="mailto:support@vogue.com"
            className="inline-flex items-center gap-2 rounded-full border border-white px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition"
          >
            Email Support
          </a>
        </div>
      </section>
    </div>
  );
}
