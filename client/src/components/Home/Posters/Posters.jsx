import React from 'react';
import poster1 from './poster1.png';
import poster2 from './poster2.png';
import poster3 from './poster3.png';
import { Link } from 'react-router-dom';

const Posters = () => {
  const cards = [
    {
      image: poster1,
      title: "Request a Quote",
      description: "Order in bulk with ease",
      buttonText: "Upload Here",
      bgColor: "bg-gray-50",
      link: '/bulkorder'
    },
    {
      image: poster2,
      title: "Building Products",
      description: "at wholesome Price",
      buttonText: "Explore Now",
      bgColor: "bg-gray-50", 
      link: '/products'
    },
    {
      image: poster3,
      title: "Credit Finance",
      description: "Flexible Financing",
      buttonText: "Learn More about it",
      bgColor: "bg-gray-50",
      link: '/reqcredits'
    }
  ];

  return (
    <div className="w-full py-12 bg-white">
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div 
              key={index}
              className={`${card.bgColor} rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full`}
            >
              <div className="flex h-full">
                {/* Text and Button Section */}
                <div className="flex flex-col justify-between p-6 w-1/2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {card.description}
                    </p>
                  </div>
                  <Link
                    to={card.link}
                    className={`px-4 py-2 text-sm font-medium rounded-md border border-[#003366] hover:cursor-pointer hover:border-[#003366]/90 transition-all text-[#003366] duration-200 self-start`}
                  >
                    {card.buttonText}
                  </Link>
                </div>
                
                {/* Image Section */}
                <div className="w-1/2 flex items-end justify-end">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-48 h-48 object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Posters;
