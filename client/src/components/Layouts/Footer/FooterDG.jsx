import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const FooterDG = () => {
  // Hard-code “2024” to match the screenshot exactly
  const year = 2025;

  // The exact list of popular tags in the same order
  const popularTags = [
    'Game', 'iPhone', 'TV', 'Asus Laptops',
    'Macbook', 'SSD', 'Graphics Card',
    'Power Bank', 'Smart TV', 'Speaker',
    'Tablet', 'Microwave', 'Samsung'
  ];

  return (
    <footer
      // Exact background color from screenshot: #191C1F
      style={{ backgroundColor: '#191C1F' }}
      className="text-[#838E94] pt-16 pb-8 px-20"
    >
      <div className="container mx-auto">
        {/* ===== Top Section: 4 Columns ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* 1) Company Info */}
          <div className="space-y-4">
            {/* “DhagaKart” in pure white */}
            <h3 className="text-2xl font-bold text-white">DhagaKart</h3>

            {/* Contact lines in exact #838E94 (mid-gray) */}
            <div className="space-y-2 text-sm">
              <p>Customer Supports:</p>
              <p>(629) 555-0129</p>
              <p>4517 Washington Ave. Manchester,</p>
              <p>Kentucky 39495</p>
              <p>info@kinbo.com</p>
            </div>
          </div>

          {/* 2) Top Category */}
          <div>
            {/* Heading in white */}
            <h3 className="text-lg font-semibold text-white mb-4">
              TOP CATEGORY
            </h3>

            <ul className="space-y-3 text-sm">
              {[
                'Computer & Laptop',
                'SmartPhone',
                'Headphone',
                'Accessories',
                'Camera & Photo',
                'TV & Homes'
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to="#"
                    // Default text in #838E94; on hover → white
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}

              {/* “Browse All Product →” in a slightly lighter blue */}
              <li>
                <Link
                  to="#"
                  className="
                    text-[#60A5FA]       /* approximate Tailwind blue-400 */
                    hover:text-[#3B82F6] /* Tailwind blue-500 on hover */
                    flex items-center
                    text-sm
                    transition-colors
                  "
                >
                  Browse All Product
                  <FaArrowRight className="ml-2 text-xs" />
                </Link>
              </li>
            </ul>
          </div>

          {/* 3) Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              QUICK LINKS
            </h3>

            <ul className="space-y-3 text-sm">
              {[
                'Shop Product',
                'Shopping Cart',      // corrected spelling
                'Wishlist',
                'Compare',
                'Track Order',
                'Customer Help',
                'About Us'
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to="#"
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4) Popular Tag */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              POPULAR TAG
            </h3>

            {/* We use a 3-column grid on small screens, 4-column on large, to match the exact layout */}
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
              {popularTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="
                    text-xs
                    px-3
                    py-1
                    rounded-[5px]
                    cursor-pointer
                    transition-colors
                    text-[#838E94]         /* tag text = mid-gray */
                    border
                    border-[#464D52]       /* exact border color from screenshot */
                    hover:border-[#3B82F6]  /* Tailwind blue-500 on hover */
                    hover:text-[#3B82F6]    /* Tailwind blue-500 on hover text */
                    flex
                    justify-center
                    items-center
                  "
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Bottom Bar (with top border) ===== */}
        <div className="border-t border-[#464D52] pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Left: All right reserved @2024 in mid-gray */}
            <p className="text-sm text-[#838E94]">
              All right reserved @{year}
            </p>

            {/* Right: Privacy Policy • Term & Condtion */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link
                to="/privacy-policy"
                className="text-sm text-[#838E94] hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>

              {/* Bullet “•” in the same mid-gray */}
              <span className="text-[#838E94]">•</span>

              <Link
                to="/terms"
                className="text-sm text-[#838E94] hover:text-white transition-colors"
              >
                Term &amp; Condtion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterDG;
