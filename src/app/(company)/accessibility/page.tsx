import Link from "next/link";

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Accessibility Statement</h1>
      <p className="mt-4 text-gray-600">Last updated: March 1, 2026</p>

      <div className="mt-12 space-y-8">
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Our Commitment</h2>
          <div className="mt-4 space-y-4 text-gray-600">
            <p>
              VOGUE is committed to ensuring digital accessibility for people with disabilities.
              We are continually improving the user experience for everyone and applying the
              relevant accessibility standards.
            </p>
            <p>
              We strive to ensure that our website conforms to the Web Content Accessibility
              Guidelines (WCAG) 2.1 Level AA standards.
            </p>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Accessibility Features</h2>
          <div className="mt-4 space-y-4 text-gray-600">
            <p>Our website includes the following accessibility features:</p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong className="text-gray-900">Keyboard Navigation:</strong> All functionality
                is accessible via keyboard.
              </li>
              <li>
                <strong className="text-gray-900">Screen Reader Compatibility:</strong> Our site
                is designed to work with popular screen readers.
              </li>
              <li>
                <strong className="text-gray-900">Alternative Text:</strong> Images include
                descriptive alt text.
              </li>
              <li>
                <strong className="text-gray-900">Color Contrast:</strong> Text and background
                colors meet WCAG contrast requirements.
              </li>
              <li>
                <strong className="text-gray-900">Resizable Text:</strong> Text can be resized
                up to 200% without loss of functionality.
              </li>
              <li>
                <strong className="text-gray-900">Form Labels:</strong> All form fields have
                associated labels for screen readers.
              </li>
              <li>
                <strong className="text-gray-900">Focus Indicators:</strong> Visible focus
                indicators for keyboard navigation.
              </li>
              <li>
                <strong className="text-gray-900">Skip Links:</strong> Skip navigation links
                to bypass repetitive content.
              </li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Assistive Technology</h2>
          <div className="mt-4 space-y-4 text-gray-600">
            <p>
              Our website is designed to be compatible with the following assistive technologies:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>Screen readers (JAWS, NVDA, VoiceOver)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Browser Compatibility</h2>
          <div className="mt-4 space-y-4 text-gray-600">
            <p>
              For the best experience, we recommend using the latest versions of the following
              browsers:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>Google Chrome</li>
              <li>Mozilla Firefox</li>
              <li>Apple Safari</li>
              <li>Microsoft Edge</li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Known Limitations</h2>
          <div className="mt-4 space-y-4 text-gray-600">
            <p>
              While we strive for full accessibility, some content may have limitations:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                Some older PDF documents may not be fully accessible. We are working to
                remediate these.
              </li>
              <li>
                Some third-party content or features may not fully meet accessibility standards.
              </li>
              <li>
                Video content is being updated with closed captions and transcripts.
              </li>
            </ul>
            <p>
              We are actively working to address these limitations and improve accessibility
              across our entire website.
            </p>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Feedback</h2>
          <div className="mt-4 space-y-4 text-gray-600">
            <p>
              We welcome your feedback on the accessibility of our website. If you encounter
              any accessibility barriers or have suggestions for improvement, please contact us:
            </p>
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <p>
                <strong className="text-gray-900">Email:</strong>{" "}
                <a href="mailto:accessibility@vogue.com" className="text-black hover:underline">
                  accessibility@vogue.com
                </a>
              </p>
              <p className="mt-2">
                <strong className="text-gray-900">Phone:</strong>{" "}
                <a href="tel:+1-800-123-4567" className="text-black hover:underline">
                  +1 (800) 123-4567
                </a>
              </p>
              <p className="mt-2">
                <strong className="text-gray-900">Address:</strong> 123 Fashion Ave, New York, NY 10001
              </p>
            </div>
            <p>
              We aim to respond to accessibility feedback within 2 business days and to resolve
              issues as quickly as possible.
            </p>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Alternative Shopping Methods</h2>
          <div className="mt-4 space-y-4 text-gray-600">
            <p>
              If you have difficulty using our website, we offer alternative ways to shop:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong className="text-gray-900">Phone Orders:</strong> Call us at
                +1 (800) 123-4567 to place an order with a customer service representative.
              </li>
              <li>
                <strong className="text-gray-900">Email Orders:</strong> Send your order details
                to orders@vogue.com.
              </li>
            </ul>
            <p>
              Our customer service team is trained to assist customers with disabilities and
              will be happy to help with any aspect of your shopping experience.
            </p>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Ongoing Efforts</h2>
          <div className="mt-4 space-y-4 text-gray-600">
            <p>
              We are committed to continuous improvement of our website&apos;s accessibility.
              Our efforts include:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>Regular accessibility audits by third-party experts</li>
              <li>Ongoing training for our web development team</li>
              <li>Integration of accessibility testing into our development process</li>
              <li>Regular review and updates to this accessibility statement</li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl bg-gray-100 p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Need Assistance?</h2>
          <p className="mt-2 text-gray-600">
            Our team is here to help with any accessibility concerns or questions.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 transition"
          >
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  );
}
