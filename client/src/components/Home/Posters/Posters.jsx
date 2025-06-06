import React from 'react';
import Poster1 from './Poster1.png';
import Poster2 from './Poster2.png';
import Poster3 from './Poster3.png';

const Posters = () => {
  return (
    <div className="w-full h-[300px] flex justify-center items-center gap-6">
      {/* ─────────────── Card #1 ─────────────── */}
      <div className="w-1/3 h-full bg-[#F9FBFE] rounded-xl border border-gray-200 flex items-center px-6">
        {/* Text on the left */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800">
            Request a Quote
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Order in bulk with ease
          </p>
          <button className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
            Upload Here
          </button>
        </div>

        {/* Image on the right */}
        <div className="flex-shrink-0 ml-4">
          <img
            src={Poster1}
            alt="Request a Quote"
            className="h-[200px] object-contain"
          />
        </div>
      </div>

      {/* ─────────────── Card #2 ─────────────── */}
      <div className="w-1/3 h-full bg-[#F9FBFE] rounded-xl border border-gray-200 flex items-center px-6">
        {/* Text on the left */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800">
            Building Products
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            at wholesome Price
          </p>
          <button className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
            Explore Now
          </button>
        </div>

        {/* Image on the right */}
        <div className="flex-shrink-0 ml-4">
          <img
            src={Poster2}
            alt="Building Products"
            className="h-[200px] object-contain"
          />
        </div>
      </div>

      {/* ─────────────── Card #3 ─────────────── */}
      <div className="w-1/3 h-full bg-[#F9FBFE] rounded-xl border border-gray-200 flex items-center px-6">
        {/* Text on the left */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800">
            Credit Finance
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Flexible Financing
          </p>
          <button className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
            Learn More about it
          </button>
        </div>

        {/* Image on the right */}
        <div className="flex-shrink-0 ml-4">
          <img
            src={Poster3}
            alt="Credit Finance"
            className="h-[200px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Posters;
