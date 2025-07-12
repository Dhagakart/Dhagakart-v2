import React from 'react';
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import Logo from './Dhagakartlogofooter.png';

const CompanyInfo = () => (
  <div className="space-y-6 py-2 md:py-0">
    <h3 className="text-3xl font-bold text-white tracking-wider">
      <img src={Logo} alt="DhagaKart Logo" className="h-10 w-auto" />
    </h3>
    <div className="space-y-3 text-sm text-[#a0abb3]">
      <p className="flex items-start">
        <FaMapMarkerAlt className="mr-3 mt-1 text-blue-400 flex-shrink-0" />
        <span>BHIVE Work Space, BTM Layout Bangalore, Karnataka</span>
      </p>
      <p className="flex items-center">
        <FaPhone className="mr-3 text-blue-400" />
        <span>+91 9019944101</span>
      </p>
      <p className="flex items-center">
        <FaEnvelope className="mr-3 text-blue-400" />
        <span>info@dhagakart.com</span>
      </p>
    </div>
  </div>
);

export default CompanyInfo;