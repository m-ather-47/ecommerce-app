import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">About VOGUE</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Redefining modern fashion with timeless elegance and sustainable practices since 2015.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            <div className="mt-6 space-y-4 text-gray-600">
              <p>
                VOGUE was founded with a simple vision: to create fashion that empowers individuals
                to express their authentic selves. What started as a small boutique in New York City
                has grown into a global fashion destination.
              </p>
              <p>
                We believe that great style shouldn&apos;t come at the expense of quality or ethics.
                Every piece in our collection is thoughtfully designed and responsibly sourced,
                ensuring you look and feel good in what you wear.
              </p>
              <p>
                Today, we&apos;re proud to serve millions of customers worldwide, united by a shared
                appreciation for modern elegance and conscious consumption.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/5] rounded-2xl bg-gray-200"></div>
            <div className="aspect-[4/5] translate-y-8 rounded-2xl bg-gray-300"></div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Quality First</h3>
              <p className="mt-3 text-gray-600">
                We never compromise on quality. Every stitch, every fabric, every detail is carefully
                considered to ensure lasting excellence.
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Sustainability</h3>
              <p className="mt-3 text-gray-600">
                We&apos;re committed to reducing our environmental footprint through responsible sourcing
                and eco-friendly practices.
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Community</h3>
              <p className="mt-3 text-gray-600">
                Fashion brings people together. We celebrate diversity and inclusivity in everything
                we create and every story we tell.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">2015</div>
            <div className="mt-2 text-sm text-gray-600">Year Founded</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">50+</div>
            <div className="mt-2 text-sm text-gray-600">Countries Served</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">2M+</div>
            <div className="mt-2 text-sm text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">500+</div>
            <div className="mt-2 text-sm text-gray-600">Team Members</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold">Join the VOGUE Family</h2>
          <p className="mt-4 text-gray-300">
            Discover our latest collections and be part of the fashion revolution.
          </p>
          <div className="mt-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-medium text-black hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
