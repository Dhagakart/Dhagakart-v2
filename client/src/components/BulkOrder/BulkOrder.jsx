import React, { useState, useEffect, useCallback } from 'react';
import { FiUpload, FiSearch, FiX, FiFile } from 'react-icons/fi';
import api from '../../utils/api';
import Loader from '../Layouts/Loader';

// Debounce helper
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const professions = [
  'Contractor',
  'Architect',
  'Interior Designer',
  'Builder',
  'Purchase Manager',
  'Retailer',
  'Dealer/Distributor',
  'Fabricator',
  'Other Construction Pro',
  'Home Owner',
  'None of the Above',
  'Fabricator',
];

const BulkOrder = () => {
  const [products, setProducts] = useState([{ product: '', qty: '', productId: '' }]);

  const [comments, setComments] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState({});
  const [showDropdown, setShowDropdown] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced product search
  const searchProducts = useCallback(
    debounce(async (query, idx) => {
      if (!query.trim()) {
        setSearchResults(prev => ({ ...prev, [idx]: [] }));
        return;
      }
      setLoading(prev => ({ ...prev, [idx]: true }));
      try {
        const { data } = await api.get(`/products?keyword=${encodeURIComponent(query)}`);
        setSearchResults(prev => ({ ...prev, [idx]: data.products || [] }));
        setShowDropdown(prev => ({ ...prev, [idx]: true }));
      } catch (err) {
        console.error(err);
        setSearchResults(prev => ({ ...prev, [idx]: [] }));
      } finally {
        setLoading(prev => ({ ...prev, [idx]: false }));
      }
    }, 300),
    []
  );

  const handleAddProduct = e => {
    e.preventDefault();
    setProducts(prev => [...prev, { product: '', qty: '', productId: '' }]);
  };

  const handleProductChange = (idx, field, val) => {
    setProducts(prev => {
      const nxt = [...prev];
      nxt[idx][field] = val;
      return nxt;
    });
    if (field === 'product') searchProducts(val, idx);
    else setShowDropdown(prev => ({ ...prev, [idx]: false }));
  };

  const selectProduct = (idx, prod) => {
    setProducts(prev => {
      const nxt = [...prev];
      nxt[idx] = { product: prod.name, productId: prod._id, qty: nxt[idx].qty };
      return nxt;
    });
    setShowDropdown(prev => ({ ...prev, [idx]: false }));
  };

  const clearSearch = idx => {
    setProducts(prev => {
      const nxt = [...prev];
      nxt[idx].product = '';
      nxt[idx].productId = '';
      return nxt;
    });
    setSearchResults(prev => ({ ...prev, [idx]: [] }));
    setShowDropdown(prev => ({ ...prev, [idx]: false }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size should be less than 50MB');
      return;
    }
    
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    const inp = document.getElementById('file-upload');
    if (inp) inp.value = '';
  };



  const handleSubmit = async e => {
    e.preventDefault();
    
    // Format products for the API
    const formattedProducts = products
      .filter(p => p.product && p.qty)
      .map(({ product, qty }) => ({
        name: product || 'Product',
        quantity: Number(qty) || 1
      }));

    if (!formattedProducts.length) {
      alert('Please add at least one product with quantity');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Add products as a JSON string
      formData.append('products', JSON.stringify(formattedProducts));
      
      // Add comments if provided
      if (comments) {
        formData.append('comments', comments);
      }
      
      // Add file if selected
      if (selectedFile) {
        // Use the original file object directly
        formData.append('file', selectedFile);
      }
      
      // Log the form data for debugging
      console.log('Form Data Entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
      }
      
      // Submit the form data with proper headers
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true,
        timeout: 120000, // 120 second timeout for file uploads
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        }
      };
      
      console.log('Sending request to /quote/new...');
      const { data } = await api.post('/quote/new', formData, config);
      
      // Show success message
      alert('Your quote request has been submitted successfully!');
      
      // Reset form
      setProducts([{ product: '', qty: '', productId: '' }]);
      setComments('');
      setSelectedFile(null);
      setFilePreview(null);
      
    } catch (error) {
      console.error('Error submitting quote request:', error);
      let errorMessage = 'Failed to submit quote request. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] max-w-7xl mx-auto mt-10 py-8 px-16">
      <div>
        <div className="py-6 px-8">
          <h1 className="text-3xl font-semibold text-gray-900 text-center">Get a Quote instantly</h1>
          <p className="text-gray-600 mt-1 text-center">Share your BBQ/Product Requirement to Dhagakart</p>
        </div>

        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl pb-8 px-8">
          
          {/* Product Details */}
          <div className="pt-6">
            <h2 className="text-xl font-medium text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Product Details
            </h2>
            <div className="flex items-stretch">
              {/* Upload */}
              <div className="flex-1 pr-8">
                {!selectedFile ? (
                  <label className="block w-full h-80 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center justify-center">
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    />
                    <div className="text-center p-4">
                      <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                        <FiUpload className="text-blue-600 w-6 h-6" />
                      </div>
                      <p className="mt-2 text-gray-700 font-medium">Upload Document</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Drag and drop files here or click to browse
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="w-full border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-50 p-2 rounded-lg">
                          {filePreview ? (
                            <img
                              src={filePreview}
                              alt="Preview"
                              className="h-16 w-16 object-cover rounded"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-blue-100 rounded flex items-center justify-center">
                              <FiFile className="text-blue-500 w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-gray-400 hover:text-gray-500 hover:cursor-pointer"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  <span className="font-medium">Formats:</span> JPG, PNG, PDF, DOC, XLS (Max 5MB)
                </p>
              </div>

              {/* Divider with OR */}
              <div className="relative flex items-center justify-center px-4">
                <div className="absolute inset-y-0 w-px bg-gray-300 left-1/2 -translate-x-1/2"></div>
                <div className="relative z-10 bg-white px-3 py-1 text-sm text-gray-500 border border-gray-300 rounded-full">
                  OR
                </div>
              </div>

              {/* Products & Comments */}
              <div className="flex-1 pl-8">
                <div>
                  <h3 className="text-gray-800 font-medium mb-3">Add Products</h3>
                  {products.map((item, idx) => (
                    <div key={idx} className="flex space-x-3 mb-3">
                      <div className="relative flex-1">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Search Product or Category"
                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={item.product}
                            onChange={e => handleProductChange(idx, 'product', e.target.value)}
                          />
                          {item.product && (
                            <button
                              type="button"
                              onClick={() => clearSearch(idx)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 hover:cursor-pointer"
                            >
                              <FiX className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        {showDropdown[idx] && (
                          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto sm:text-sm">
                            {loading[idx] ? (
                              <div className="px-4 py-2 text-gray-500">Searching...</div>
                            ) : searchResults[idx]?.length ? (
                              searchResults[idx].map(prod => (
                                <div
                                  key={prod._id}
                                  className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm text-gray-700"
                                  onClick={() => selectProduct(idx, prod)}
                                >
                                  <div className="font-medium">{prod.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {prod.category} • ₹{prod.price}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-gray-500">No products found</div>
                            )}
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Qty"
                        className="w-20 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={item.qty}
                        onChange={e => handleProductChange(idx, 'qty', e.target.value)}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="inline-flex items-center text-blue-600 text-sm font-medium hover:text-blue-800 mt-2 hover:cursor-pointer"
                  >
                    <span className="text-lg mr-1">+</span> Add Another Product
                  </button>
                </div>
                <div className="mt-6">
                  <h3 className="text-gray-800 font-medium mb-2">Add Comments</h3>
                  <textarea
                    placeholder="(Optional)"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Submit */}
          <div className="mt-3 pt-3 w-full flex justify-center items-center border-t border-gray-200">
            <button
              type="submit"
              className="w-1/3 bg-[#003366] hover:cursor-pointer text-white py-3 px-6 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkOrder;
