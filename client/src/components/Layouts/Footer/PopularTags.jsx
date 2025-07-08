import React from 'react';

const PopularTags = ({ tags }) => (
  <div className="py-2 md:py-0">
    <h3 className="text-lg font-semibold text-white mb-6 tracking-wide uppercase">Popular Tags</h3>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="
            text-xs px-3 py-1.5 rounded-full cursor-pointer transition-all duration-300
            text-[#838E94] bg-[#2a2d30] border border-transparent
            hover:border-blue-500 hover:text-white hover:bg-blue-500/20
            hover:scale-105
          "
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default PopularTags;