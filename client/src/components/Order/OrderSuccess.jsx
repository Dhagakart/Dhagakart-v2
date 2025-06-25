import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import { clearCart } from '../../actions/cartAction';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { order } = useSelector((state) => state.newOrder);
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <MetaData title="Order Success | DhagaKart" />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-gray-900">Order Placed Successfully!</h2>
            <p className="mt-2 text-gray-600">
              Thank you for your order. Your order has been placed successfully.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Order ID: {order?._id || 'Loading...'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/orders/me')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate('/')}
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
