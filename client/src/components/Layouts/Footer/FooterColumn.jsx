import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const FooterColumn = ({ title, links, browseLink }) => {
  return (
    <div className="py-2 md:py-0">
      <h3 className="text-lg font-semibold text-white tracking-wide uppercase mb-6">{title}</h3>
      <ul className="space-y-4 text-sm">
        {links.map((item, idx) => (
          <li key={idx} className="group">
            <Link to={item.href || '#'} className="flex items-center text-gray-400 hover:text-white hover:pl-1 transition-all duration-300">
              {item.label}
            </Link>
          </li>
        ))}
        {browseLink && (
          <li className="mt-4">
            <Link
              to={browseLink.href}
              className="text-[#60A5FA] hover:text-white font-semibold flex items-center text-sm transition-colors duration-300 group"
            >
              {browseLink.label}
              <FaArrowRight className="ml-2 text-xs transition-transform transform group-hover:translate-x-1" />
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default FooterColumn;