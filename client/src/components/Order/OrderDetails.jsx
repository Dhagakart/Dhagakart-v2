// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { getOrderDetails, clearErrors } from '../../actions/orderAction';
// import Loader from '../Layouts/Loader';
// import MetaData from '../Layouts/MetaData';
// import { formatPrice } from '../../utils/formatPrice';
// // import { useNavigate } from 'react-router-dom';

// const OrderDetails = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { id } = useParams();

//     const { loading, error, order } = useSelector((state) => state.orderDetails);

//     useEffect(() => {
//         if (error) {
//             alert(error);
//             dispatch(clearErrors());
//         }
//         dispatch(getOrderDetails(id));
//     }, [dispatch, id, error]);

//     const getStatusBadge = (status) => {
//         switch (status?.toLowerCase()) {
//             case 'processing': return 'bg-blue-100 text-blue-800';
//             case 'shipped': return 'bg-purple-100 text-purple-800';
//             case 'delivered': return 'bg-green-100 text-green-800';
//             case 'cancelled': return 'bg-red-100 text-red-800';
//             default: return 'bg-gray-100 text-gray-800';
//         }
//     };

//     // Show loader while loading or if order data is not yet available
//     if (loading || !order) {
//         return <Loader />;
//     }
    
//     // Safely calculate totals only when order.orderItems exists
//     const subtotal = order.orderItems?.reduce((acc, item) => acc + item.quantity * item.price, 0) || 0;
//     const tax = order.taxPrice || subtotal * 0.1; 
//     const shippingCharges = order.shippingPrice || 0;
//     const total = order.totalPrice || (subtotal + tax + shippingCharges);

//     return (
//         <>
//             <MetaData title={`Order #${order._id?.substring(order._id.length - 6).toUpperCase()}`} />
            
//             <div className="bg-gray-50 min-h-screen py-8 mt-10 px-4 sm:px-6 lg:px-8">
//                 <div className="max-w-7xl mx-auto">
//                     <div className="md:flex md:items-center md:justify-between mb-8">
//                         <div className="flex-1 min-w-0">
//                             <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
//                                 Order Details
//                             </h2>
//                         </div>
//                         <div className="mt-4 flex md:mt-0 md:ml-4">
//                             <button
//                                 type="button"
//                                 onClick={() => navigate(-1)}
//                                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//                             >
//                                 Back to Orders
//                             </button>
//                         </div>
//                     </div>

//                     <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//                         {/* Order Header */}
//                         <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//                             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
//                                 <div>
//                                     <h3 className="text-lg leading-6 font-medium text-gray-900">
//                                         Order #{order._id?.substring(order._id.length - 6).toUpperCase()}
//                                     </h3>
//                                     <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                                         Placed on {new Date(order.createdAt).toLocaleDateString()}
//                                     </p>
//                                 </div>
//                                 <div className="mt-4 sm:mt-0">
//                                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order.orderStatus)}`}>
//                                         {order.orderStatus || 'Processing'}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Shipping & Payment Info */}
//                         <div className="border-b border-gray-200">
//                             <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                                 <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
//                                 <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                                     <p>{order.shippingInfo?.name}</p>
//                                     <p>{order.shippingInfo?.address}</p>
//                                     <p>{order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.pincode}</p>
//                                     <p className="mt-2">Phone: {order.shippingInfo?.phoneNo}</p>
//                                 </dd>
//                             </div>
//                             <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                                 <dt className="text-sm font-medium text-gray-500">Payment Information</dt>
//                                 <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                                     <p>Status: 
//                                         <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                             order.paymentInfo?.status === 'succeeded' 
//                                                 ? 'bg-green-100 text-green-800' 
//                                                 : 'bg-yellow-100 text-yellow-800'
//                                         }`}>
//                                             {order.paymentInfo?.status?.toUpperCase() || 'PENDING'}
//                                         </span>
//                                     </p>
//                                 </dd>
//                             </div>
//                         </div>

//                         {/* Order Items Table */}
//                         <div className="px-4 py-5 sm:px-6">
//                             <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                                             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                                             <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
//                                             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {/* FIX: Use optional chaining here too for safety */}
//                                         {order.orderItems?.map((item) => (
//                                             <tr key={item.product}>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center">
//                                                         <img className="h-16 w-16 object-cover rounded-md" src={item.image} alt={item.name} />
//                                                         <div className="ml-4">
//                                                             <Link to={`/product/${item.product}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600">
//                                                                 {item.name}
//                                                             </Link>
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
//                                                     {formatPrice(item.price)}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
//                                                     {`${item.quantity} ${item.unit?.name || item.unit?.unit || ''}`}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
//                                                     {formatPrice(item.price * item.quantity)}
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                     <tfoot className="bg-gray-50">
//                                         <tr>
//                                             <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">Sub-total</td>
//                                             <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">{formatPrice(subtotal)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">SGST (5%)</td>
//                                             <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">{formatPrice(tax / 2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">CGST (5%)</td>
//                                             <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">{formatPrice(tax / 2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">Shipping</td>
//                                             <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">{formatPrice(shippingCharges)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td colSpan="3" className="px-6 py-3 text-right text-lg font-bold text-gray-900">Total</td>
//                                             <td className="px-6 py-3 text-right text-lg font-bold text-gray-900">{formatPrice(total)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td colSpan="4" className="px-6 py-3 text-right">
//                                                 <button
//                                                     onClick={() => navigate(`/track-order?orderId=${order._id}`)}
//                                                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
//                                                 >
//                                                     Track This Order
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     </tfoot>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default OrderDetails;

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getOrderDetails, clearErrors } from '../../actions/orderAction';
import Loader from '../Layouts/Loader';
import MetaData from '../Layouts/MetaData';
import { formatPrice } from '../../utils/formatPrice';
import { Truck } from 'lucide-react'; // Import the Truck icon

const OrderDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { loading, error, order } = useSelector((state) => state.orderDetails);

    useEffect(() => {
        if (error) {
            alert(error); // Consider using a more modern notification system like react-hot-toast
            dispatch(clearErrors());
        }
        dispatch(getOrderDetails(id));
    }, [dispatch, id, error]);

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading || !order) {
        return <Loader />;
    }
    
    // Safely calculate totals
    const subtotal = order.orderItems?.reduce((acc, item) => acc + item.quantity * item.price, 0) || 0;
    const tax = order.taxPrice || subtotal * 0.1; 
    const shippingCharges = subtotal + tax >= 500 ? 0 : 100;
    const total = order.totalPrice || (subtotal + tax + shippingCharges);

    return (
        <>
            <MetaData title={`Order #${order._id?.substring(order._id.length - 6).toUpperCase()}`} />
            
            <div className="bg-gray-50 min-h-screen py-8 mt-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="md:flex md:items-center md:justify-between mb-8">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                Order Details
                            </h2>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Back to Orders
                            </button>
                        </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        {/* Order Header */}
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                <div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Order #{order._id?.substring(order._id.length - 6).toUpperCase()}
                                    </h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order.orderStatus)}`}>
                                        {order.orderStatus || 'Processing'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping & Payment Info */}
                        <div className="border-b border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <p>{order.shippingInfo?.name}</p>
                                        <p>{order.shippingInfo?.address}</p>
                                        <p>{order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.pincode}</p>
                                        <p className="mt-2">Phone: {order.shippingInfo?.phoneNo}</p>
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Payment Information</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <p>Status: 
                                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.paymentInfo?.status === 'succeeded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {order.paymentInfo?.status?.toUpperCase() || 'PENDING'}
                                            </span>
                                        </p>
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Order Items Table */}
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {order.orderItems?.map((item) => (
                                            <tr key={item.product}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <img className="h-16 w-16 object-cover rounded-md" src={item.image} alt={item.name} />
                                                        <div className="ml-4">
                                                            <Link to={`/product/${item.product}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600">{item.name}</Link>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">{formatPrice(item.price)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{item.quantity}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">Sub-total</td>
                                            <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">{formatPrice(subtotal)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">Tax</td>
                                            <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">{formatPrice(tax)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">Shipping</td>
                                            <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">{formatPrice(shippingCharges)}</td>
                                        </tr>
                                        <tr className="border-t-2 border-gray-300">
                                            <td colSpan="3" className="px-6 py-3 text-right text-base font-bold text-gray-900">Total</td>
                                            <td className="px-6 py-3 text-right text-base font-bold text-gray-900">{formatPrice(total)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        
                        {/* --- THIS IS THE NEW LOGIC --- */}
                        {/* Conditionally render the tracking button if tracking info exists */}
                        {(order.vrlInvoiceLink || order.consignmentNumber) && (
                            <div className="px-4 py-4 sm:px-6 bg-gray-50">
                                <div className="flex justify-end">
                                    <Link
                                        to={`/track-order?orderId=${order._id}`}
                                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Truck className="h-5 w-5 mr-2" />
                                        Track This Order
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetails;