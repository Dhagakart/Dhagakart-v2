import React, { useState } from 'react';
import { ArrowLeft, Package, Box, Truck, CheckCircle, MapPin, Edit, Clock, Check, X, Star, ChevronDown, MessageSquare } from 'lucide-react';
import RatingModal from './RatingModal';

const TrackOrder = () => {
  // State for rating modal
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);


  // Mock data
  const order = {
    id: 'DHG-ORD-78945',
    products: [
      {
        id: 1,
        name: 'Wireless Bluetooth Earbuds',
        price: '₹1,299',
        quantity: 1,
        subtotal: '₹1,299',
        image: 'https://via.placeholder.com/60',
      },
      {
        id: 2,
        name: 'Smartphone Case',
        price: '₹499',
        quantity: 2,
        subtotal: '₹998',
        image: 'https://via.placeholder.com/60',
      },
    ],
    total: '₹2,297',
    placedAt: 'June 12, 2025',
    expectedArrival: 'June 18, 2025',
    timeline: [
      { completed: true, icon: <Check className="h-4 w-4" />, label: 'Ordered' },
      { completed: true, icon: <Check className="h-4 w-4" />, label: 'Packed' },
      { completed: true, icon: <Truck className="h-4 w-4" />, label: 'Shipped' },
      { completed: false, icon: <Clock className="h-4 w-4" />, label: 'In Transit' },
      { completed: false, icon: <CheckCircle className="h-4 w-4" />, label: 'Delivered' },
    ],
    activities: [
      { 
        icon: <CheckCircle className="h-5 w-5 text-green-500" />, 
        text: 'Order placed', 
        date: 'June 12, 2025, 10:30 AM' 
      },
      { 
        icon: <CheckCircle className="h-5 w-5 text-green-500" />, 
        text: 'Order confirmed', 
        date: 'June 12, 2025, 10:35 AM' 
      },
      { 
        icon: <CheckCircle className="h-5 w-5 text-green-500" />, 
        text: 'Order processed', 
        date: 'June 12, 2025, 11:45 AM' 
      },
      { 
        icon: <Truck className="h-5 w-5 text-blue-500" />, 
        text: 'Shipped via Delhivery', 
        date: 'June 13, 2025, 2:15 PM' 
      },
    ],
    billingAddress: {
      name: 'John Doe',
      street: '123 Tech Park, 2nd Cross',
      city: 'Bangalore, Karnataka 560001',
      phone: '+91 98765 43210',
      email: 'john.doe@example.com'
    },
    shippingAddress: {
      name: 'John Doe',
      street: '123 Tech Park, 2nd Cross',
      city: 'Bangalore, Karnataka 560001',
      phone: '+91 98765 43210',
      email: 'john.doe@example.com'
    },
    notes: 'Please deliver after 6 PM. Leave at the security if not at home.'
  };

  const {
    id,
    products,
    total,
    placedAt,
    expectedArrival,
    timeline,
    activities,
    billingAddress,
    shippingAddress,
    notes
  } = order;

  const handleSubmitRating = (data) => {
    // Here you would typically send the rating and feedback to your backend
    console.log('Rating submitted:', data);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button className="flex items-center text-gray-600 hover:text-gray-800 hover:cursor-pointer">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Orders
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
        <button 
          onClick={() => setIsRatingModalOpen(true)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:cursor-pointer hover:underline"
        >
          Leave a rating
        </button>
      </div>

      {/* Order Summary */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">#{id}</h3>
          <p className="text-sm text-gray-500">{products.length} Products &middot; Placed on {placedAt}</p>
        </div>
        <div className="text-2xl font-bold text-gray-900">{total}</div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Order expected arrival {expectedArrival}</p>
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-4 h-1 bg-gray-200 z-0">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
              style={{ 
                width: `${(timeline.filter(step => step.completed).length / (timeline.length - 1)) * 100}%`,
                maxWidth: '100%' 
              }}
            />
          </div>
          
          {/* Timeline steps */}
          <div className="relative z-10 flex justify-between w-full">
            {timeline.map((step, i) => {
              const isCompleted = step.completed;
              const isLast = i === timeline.length - 1;
              
              return (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      isCompleted 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      React.cloneElement(step.icon, { className: 'h-4 w-4' })
                    )}
                  </div>
                  <span 
                    className={`mt-2 text-xs whitespace-nowrap ${
                      isCompleted ? 'text-blue-600 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Activity */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Order Activity</h4>
        <ul className="space-y-4">
          {activities.map((act, i) => (
            <li key={i} className="flex items-start space-x-3">
              <div className="mt-1">
                {act.icon}
              </div>
              <div>
                <p className="text-sm text-gray-900">{act.text}</p>
                <p className="text-xs text-gray-500">{act.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Product List */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Products ({products.length})</h4>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr className="text-xs text-gray-500 text-left">
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products.map((p, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-3 flex items-center space-x-3">
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />
                    <span className="text-sm text-gray-900">{p.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{p.price}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">x{p.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{p.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Addresses & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h5 className="text-sm font-semibold text-gray-700">Billing Address</h5>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:cursor-pointer">
              <Edit className="h-4 w-4 inline mr-1" />
              Edit
            </button>
          </div>
          <address className="not-italic text-sm text-gray-600">
            {billingAddress.name}<br />
            {billingAddress.street}<br />
            {billingAddress.city}<br />
            Phone: {billingAddress.phone}<br />
            Email: {billingAddress.email}
          </address>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h5 className="text-sm font-semibold text-gray-700">Shipping Address</h5>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:cursor-pointer">
              <Edit className="h-4 w-4 inline mr-1" />
              Edit
            </button>
          </div>
          <address className="not-italic text-sm text-gray-600">
            {shippingAddress.name}<br />
            {shippingAddress.street}<br />
            {shippingAddress.city}<br />
            Phone: {shippingAddress.phone}<br />
            Email: {shippingAddress.email}
          </address>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-gray-700">Order Notes</h5>
          <p className="text-sm text-gray-600">{notes || '—'}</p>
        </div>
      </div>

      {/* Rating Section - Removed as it's now handled by the RatingModal */}

      {/* Rating Modal */}
      <RatingModal 
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
};

export default TrackOrder;