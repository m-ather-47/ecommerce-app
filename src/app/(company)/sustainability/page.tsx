import Link from "next/link";

const initiatives = [
  {
    title: "Sustainable Materials",
    description: "We source 60% of our materials from certified sustainable sources, including organic cotton, recycled polyester, and responsibly sourced wool.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
      </svg>
    ),
  },
  {
    title: "Carbon Neutral Shipping",
    description: "All our shipments are carbon neutral. We offset 100% of shipping emissions through verified carbon offset programs.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    title: "Ethical Manufacturing",
    description: "We partner with factories that meet our strict standards for fair wages, safe working conditions, and worker rights.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: "Recycling Program",
    description: "Send us your old VOGUE items and we will recycle them responsibly. You will receive store credit for participating.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
];

const goals = [
  { year: "2025", goal: "100% sustainable packaging", status: "achieved" },
  { year: "2026", goal: "75% sustainable materials", status: "in_progress" },
  { year: "2027", goal: "Carbon neutral operations", status: "planned" },
  { year: "2030", goal: "Zero waste to landfill", status: "planned" },
];

export default function SustainabilityPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Sustainability</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Fashion that looks good and does good. Our commitment to a sustainable future.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">Our Commitment</h2>
          <p className="mt-6 text-lg text-gray-600">
            At VOGUE, we believe that fashion and sustainability can coexist. We&apos;re committed
            to reducing our environmental impact while creating beautiful, high-quality products
            that you&apos;ll love for years to come.
          </p>
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold text-gray-900">Our Initiatives</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {initiatives.map((initiative) => (
              <div
                key={initiative.title}
                className="rounded-2xl bg-gray-50 p-8"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
                  {initiative.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">{initiative.title}</h3>
                <p className="mt-3 text-gray-600">{initiative.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-gray-900">Our Progress</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
          We&apos;re making steady progress toward our sustainability goals.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {goals.map((goal) => (
            <div
              key={goal.year}
              className={`rounded-2xl p-6 ${
                goal.status === "achieved"
                  ? "bg-green-50 border-2 border-green-200"
                  : goal.status === "in_progress"
                  ? "bg-yellow-50 border-2 border-yellow-200"
                  : "bg-gray-50 border-2 border-gray-200"
              }`}
            >
              <div className="text-2xl font-bold text-gray-900">{goal.year}</div>
              <p className="mt-2 text-sm text-gray-600">{goal.goal}</p>
              <div className="mt-4">
                {goal.status === "achieved" && (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Achieved
                  </span>
                )}
                {goal.status === "in_progress" && (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-yellow-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    In Progress
                  </span>
                )}
                {goal.status === "planned" && (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    Planned
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div>
              <div className="text-4xl font-bold">60%</div>
              <div className="mt-2 text-sm text-gray-400">Sustainable Materials</div>
            </div>
            <div>
              <div className="text-4xl font-bold">100%</div>
              <div className="mt-2 text-sm text-gray-400">Recycled Packaging</div>
            </div>
            <div>
              <div className="text-4xl font-bold">45%</div>
              <div className="mt-2 text-sm text-gray-400">Carbon Reduction</div>
            </div>
            <div>
              <div className="text-4xl font-bold">0</div>
              <div className="mt-2 text-sm text-gray-400">Animal Testing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recycling Program CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-2xl bg-gray-100 p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Join Our Recycling Program</h2>
              <p className="mt-4 text-gray-600">
                Give your old VOGUE items a second life. Send them to us and we&apos;ll recycle
                them responsibly. You&apos;ll receive store credit as a thank you for helping
                us close the loop.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-8 py-3 font-medium text-white hover:bg-gray-800 transition"
              >
                Learn More
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-green-100">
                <svg className="h-24 w-24 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
