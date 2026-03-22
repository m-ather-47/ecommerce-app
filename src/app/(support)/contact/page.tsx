"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Message Sent!</h2>
          <p className="mt-2 text-gray-600">
            Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
          </p>
          <button
            onClick={() => {
              setForm({ name: "", email: "", subject: "", message: "" });
              setSubmitted(false);
            }}
            className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-4 text-lg text-gray-600">
          Have a question or need help? We&apos;re here for you.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {/* Contact Methods */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">Email</h3>
            <p className="mt-1 text-sm text-gray-600">Our team typically responds within 24 hours.</p>
            <a href="mailto:support@vogue.com" className="mt-3 inline-block text-sm font-medium text-black hover:underline">
              support@vogue.com
            </a>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">Phone</h3>
            <p className="mt-1 text-sm text-gray-600">Mon-Fri from 8am to 6pm EST</p>
            <a href="tel:+1-800-123-4567" className="mt-3 inline-block text-sm font-medium text-black hover:underline">
              +1 (800) 123-4567
            </a>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">Headquarters</h3>
            <p className="mt-1 text-sm text-gray-600">Visit our main office</p>
            <p className="mt-3 text-sm font-medium text-black">
              123 Fashion Ave<br />
              New York, NY 10001
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Send us a message</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <select
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="">Select a topic</option>
                <option value="order">Order Inquiry</option>
                <option value="shipping">Shipping Question</option>
                <option value="returns">Returns & Exchanges</option>
                <option value="product">Product Information</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black resize-none"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-black py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
