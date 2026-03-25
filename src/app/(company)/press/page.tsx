import Link from "next/link";

const pressReleases = [
  {
    id: 1,
    date: "March 15, 2026",
    title: "LUMINA Launches Sustainable Fashion Initiative",
    excerpt: "New collection features 100% recycled materials as part of our commitment to environmental responsibility.",
    category: "Sustainability",
  },
  {
    id: 2,
    date: "February 28, 2026",
    title: "LUMINA Expands to 10 New Markets",
    excerpt: "International expansion brings premium fashion to customers across Asia and South America.",
    category: "Company News",
  },
  {
    id: 3,
    date: "January 10, 2026",
    title: "LUMINA Partners with Celebrity Designer",
    excerpt: "Exclusive collaboration brings limited-edition collection to our customers this spring.",
    category: "Collections",
  },
  {
    id: 4,
    date: "December 5, 2025",
    title: "LUMINA Named Top Fashion E-Commerce Brand",
    excerpt: "Industry recognition highlights our commitment to customer experience and quality.",
    category: "Awards",
  },
  {
    id: 5,
    date: "November 20, 2025",
    title: "LUMINA Reaches 2 Million Customer Milestone",
    excerpt: "Celebrating our growing community of fashion-forward customers worldwide.",
    category: "Company News",
  },
];

const mediaFeatures = [
  { name: "Lumina Magazine", logo: "V" },
  { name: "Elle", logo: "E" },
  { name: "Harper's Bazaar", logo: "HB" },
  { name: "GQ", logo: "GQ" },
  { name: "Forbes", logo: "F" },
  { name: "Business Insider", logo: "BI" },
];

export default function PressPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Press & Media</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            The latest news, announcements, and media resources from LUMINA.
          </p>
        </div>
      </section>

      {/* Media Kit Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-2xl bg-white p-8 shadow-sm md:p-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Media Kit</h2>
              <p className="mt-2 text-gray-600">
                Download our press kit including logos, brand guidelines, and high-resolution images.
              </p>
            </div>
            <button className="shrink-0 rounded-full bg-black px-8 py-3 font-medium text-white hover:bg-gray-800 transition">
              Download Media Kit
            </button>
          </div>
        </div>
      </section>

      {/* Press Releases Section */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900">Press Releases</h2>
        <div className="mt-8 space-y-4">
          {pressReleases.map((release) => (
            <article
              key={release.id}
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-gray-500">{release.date}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {release.category}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">
                {release.title}
              </h3>
              <p className="mt-2 text-gray-600">{release.excerpt}</p>
              <button className="mt-4 text-sm font-medium text-black hover:underline">
                Read More
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Featured In Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">As Featured In</h2>
            <p className="mt-2 text-gray-600">
              LUMINA has been featured in leading publications worldwide.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8 md:grid-cols-6">
            {mediaFeatures.map((media) => (
              <div
                key={media.name}
                className="flex h-16 items-center justify-center rounded-lg bg-gray-100"
              >
                <span className="text-lg font-bold text-gray-400">{media.logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Contact Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-2xl bg-black p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Press Inquiries</h2>
              <p className="mt-4 text-gray-300">
                For press inquiries, interview requests, or media partnerships, please contact
                our communications team.
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div>
                <div className="text-sm text-gray-400">Email</div>
                <a href="mailto:press@vogue.com" className="text-lg font-medium hover:underline">
                  press@vogue.com
                </a>
              </div>
              <div>
                <div className="text-sm text-gray-400">Phone</div>
                <a href="tel:+1-800-123-4567" className="text-lg font-medium hover:underline">
                  +1 (800) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Stay Updated</h2>
          <p className="mt-4 text-gray-600">
            Subscribe to our press newsletter to receive the latest news and announcements.
          </p>
          <form className="mx-auto mt-6 flex max-w-md gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full border border-gray-300 px-5 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
