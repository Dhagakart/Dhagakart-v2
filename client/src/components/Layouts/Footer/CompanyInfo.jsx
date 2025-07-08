import React from 'react';
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

const CompanyInfo = () => (
  <div className="space-y-6 py-2 md:py-0">
    <h3 className="text-3xl font-bold text-white tracking-wider">DhagaKart</h3>
    <div className="space-y-3 text-sm text-[#a0abb3]">
      <p className="flex items-start">
        <FaMapMarkerAlt className="mr-3 mt-1 text-blue-400 flex-shrink-0" />
        <span>4517 Washington Ave. Manchester, Kentucky 39495</span>
      </p>
      <p className="flex items-center">
        <FaPhone className="mr-3 text-blue-400" />
        <span>(629) 555-0129</span>
      </p>
      <p className="flex items-center">
        <FaEnvelope className="mr-3 text-blue-400" />
        <span>info@dhagakart.com</span>
      </p>
    </div>
  </div>
);

export default CompanyInfo;