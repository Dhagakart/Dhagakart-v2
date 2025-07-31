import React, { useState } from 'react';
import { Backdrop, Fade } from '@mui/material';

const SampleRequestModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(quantity);
  };

  return (
    <Backdrop
      sx={{
        zIndex: 1300,
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
      open={isOpen}
      onClick={onClose}
    >
      <Fade in={isOpen}>
        <div 
          className="bg-white rounded-xl w-full max-w-md overflow-hidden mx-4"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Request a Sample</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 hover:cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <img 
                src={product.images[0]?.url} 
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div>
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-500">Sample Quantity</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Quantity
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg w-40">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-l-lg hover:cursor-pointer"
                >
                  -
                </button>
                <span className="flex-1 text-center font-medium">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-r-lg hover:cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 py-3 bg-[#003366] text-white font-medium rounded-lg hover:bg-[#002855] transition-colors hover:cursor-pointer"
            >
              Continue to Shipping
            </button>
          </div>
        </div>
        </div>
      </Fade>
    </Backdrop>
  );
};

export default SampleRequestModal;
