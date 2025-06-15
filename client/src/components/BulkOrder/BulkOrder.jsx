import React, { useState, useEffect, useCallback } from 'react';
import { FiUpload, FiMapPin, FiSearch, FiX, FiFile } from 'react-icons/fi';
import api from '../../utils/api';

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
  const [profession, setProfession] = useState('Architect');
  const [address, setAddress] = useState('');
  const [comments, setComments] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState({});
  const [showDropdown, setShowDropdown] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [pincode, setPincode] = useState('');
  const [pincodeDetails, setPincodeDetails] = useState(null);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

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

  const fetchPincodeDetails = async pin => {
    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      setPincodeError('Please enter a valid 6-digit pincode');
      return;
    }
    setIsPincodeLoading(true);
    setPincodeError('');
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const [result] = await res.json();
      if (result.Status === 'Success' && result.PostOffice.length) {
        const po = result.PostOffice[0];
        setPincodeDetails({ city: po.District, state: po.State, country: po.Country });
        setAddress(`${po.District}, ${po.State}`);
      } else {
        setPincodeError('No details found for this pincode');
        setPincodeDetails(null);
      }
    } catch {
      setPincodeError('Failed to fetch pincode details');
      setPincodeDetails(null);
    } finally {
      setIsPincodeLoading(false);
    }
  };

  const handlePincodeChange = e => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);
    if (val.length === 6) fetchPincodeDetails(val);
    else if (pincodeDetails) {
      setPincodeDetails(null);
      setPincodeError('');
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsFetchingLocation(true);
    setPincodeError('');
    const saved = localStorage.getItem('locationData');
    if (!saved) {
      setPincodeError('Location data not found. Enable it in the header.');
      setIsFetchingLocation(false);
      return;
    }
    try {
      const loc = JSON.parse(saved);
      setUserLocation(loc);
      if (loc.pincode !== 'NA') {
        setPincode(loc.pincode);
        await fetchPincodeDetails(loc.pincode);
      }
      if (!address.trim()) {
        setAddress(`${loc.city}${loc.state ? ', ' + loc.state : ''}`);
      }
    } catch {
      setPincodeError('Failed to parse location data.');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  // load saved location
  useEffect(() => {
    const saved = localStorage.getItem('locationData');
    if (saved) {
      try { setUserLocation(JSON.parse(saved)); }
      catch {}
    }
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    const formatted = products
      .filter(p => p.productId && p.qty)
      .map(p => ({ product: p.product, productId: p.productId, quantity: +p.qty }));
    if (!formatted.length) {
      alert('Add at least one product with quantity');
      return;
    }
    const payload = { products: formatted, profession, address, comments };
    console.log('Submit:', payload);
    // api.post('/bulk-order', payload)...
  };

  return (
    <div className="min-h-[90vh] max-w-7xl mx-auto mt-10 py-8 px-16">
      <div>
        <div className="py-6 px-8">
          <h1 className="text-3xl font-semibold text-gray-900 text-center">Get a Quote instantly</h1>
          <p className="text-gray-600 mt-1 text-center">Share your BBQ/Product Requirement to Dhagakart</p>
        </div>

        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl pb-8 px-8">
          
          {/* Product Details */}
          <div className="py-6">
            <h2 className="text-xl font-medium text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Product Details
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {/* Upload */}
              <div className="col-span-2">
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

              {/* Products & Comments */}
              <div className="col-span-1">
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

          {/* Delivery Address */}
          <div className="py-6">
            <h2 className="text-xl font-medium text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Delivery Address
            </h2>

            {/* PIN Code */}
            <div className="mb-4">
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="pincode"
                  placeholder="Enter 6-digit PIN code"
                  className={`w-full max-w-xs rounded-md px-4 py-2 text-sm focus:outline-none border border-gray-300 ${
                    pincodeError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  value={pincode}
                  onChange={handlePincodeChange}
                  maxLength={6}
                  disabled={isPincodeLoading}
                />
                {isPincodeLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
                  </div>
                )}
              </div>
              {pincodeError && <p className="mt-1 text-sm text-red-600">{pincodeError}</p>}
              {pincodeDetails && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
                  Location: {pincodeDetails.city}, {pincodeDetails.state}, {pincodeDetails.country}
                </div>
              )}
            </div>

            {/* Full Address & Use Current Location */}
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Full Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                placeholder="House/Flat No., Building, Street, Area"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
              <div className="mt-4 flex items-center">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isFetchingLocation || !userLocation}
                  className={`inline-flex items-center text-sm font-medium transition-colors ${
                    userLocation ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 cursor-not-allowed'
                  }`}
                  title={
                    userLocation
                      ? 'Use your current location'
                      : 'Enable location access in the header'
                  }
                >
                  {isFetchingLocation ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2" />
                      Fetching location...
                    </>
                  ) : (
                    <>
                      <FiMapPin className="w-4 h-4 mr-1" />
                      Use my current location
                    </>
                  )}
                </button>
                {pincode === userLocation?.pincode && (
                  <span className="ml-2 text-xs text-green-600">
                    ✓ {userLocation.city}, {userLocation.state}
                  </span>
                )}
              </div>
              {!userLocation && (
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="mt-1 text-xs text-blue-600 hover:text-blue-800 hover:underline focus:outline-none text-left"
                >
                  Click to enable location access
                </button>
              )}
            </div>
          </div>

          {/* Profession */}
          <div className="py-6">
            <h2 className="text-xl font-medium text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Choose your Profession <span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {professions.map((prof) => (
                <div key={prof} className="relative">
                  <input
                    type="radio"
                    id={`profession-${prof}`}
                    name="profession"
                    className="absolute opacity-0 w-0 h-0 peer"
                    checked={profession === prof}
                    onChange={() => setProfession(prof)}
                  />
                  <label
                    htmlFor={`profession-${prof}`}
                    className={`flex items-center justify-center w-full px-4 py-3 text-sm rounded-md border cursor-pointer transition-all duration-200 ${
                      profession === prof
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium shadow-sm ring-1 ring-blue-200'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {prof === 'Fabricator' ? (
                      <span className="whitespace-nowrap">{prof}</span>
                    ) : (
                      prof
                    )}
                  </label>
                </div>
              ))}
            </div>
            {!profession && (
              <p className="mt-2 text-sm text-red-500">Please select your profession</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="w-full bg-[#003366] hover:cursor-pointer text-white py-3 px-6 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
