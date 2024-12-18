import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We provide high-quality products with exceptional customer
              service.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>Email: support@example.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 Store St, City, State</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Your Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
