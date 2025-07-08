import React from 'react';
import { Link } from 'react-router-dom';

const FooterBottomBar = ({ year }) => (
  <div className="border-t border-gray-700/50 pt-4 mt-6">
    <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
      <p className="text-sm text-gray-400 mb-4 sm:mb-0">
        Copyright © {year} DhagaKart. All Rights Reserved.
      </p>
      <div className="flex items-center space-x-4 sm:space-x-6">
        <Link
          to="/privacy-policy"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Privacy Policy
        </Link>
        <span className="text-gray-600">|</span>
        <Link
          to="/terms"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Terms of Use
        </Link>
      </div>
    </div>
  </div>
);

export default FooterBottomBar;