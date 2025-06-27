import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getOrderDetails, clearErrors } from '../../actions/orderAction';
import Loader from '../Layouts/Loader';
import MetaData from '../Layouts/MetaData';
import { formatPrice } from '../../utils/formatPrice';

const OrderDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { loading, error, order } = useSelector((state) => state.orderDetails);

    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(clearErrors());
        }

        dispatch(getOrderDetails(id));
    }, [dispatch, id, error]);

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <Loader />;

    // Calculate subtotal from order items if itemsPrice is not available
    const calculateSubtotal = () => {
        if (order?.itemsPrice !== undefined && order.itemsPrice !== null) {
            return order.itemsPrice;
        }
        
        if (order?.orderItems?.length) {
            return order.orderItems.reduce((sum, item) => {
                const price = Number(item.price) || 0;
                const qty = Number(item.quantity) || 0;
                return sum + (price * qty);
            }, 0);
        }
        
        return 0;
    };
    
    const subtotal = calculateSubtotal();

    return (
        <>
            <MetaData title={`Order #${order?._id?.substring(order._id.length - 6).toUpperCase() || 'Details'}`} />
            
            <div className="bg-gray-50 min-h-screen py-8 mt-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
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
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Back to Orders
                            </button>
                        </div>
                    </div>

                    {order && (
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

                            <div className="border-b border-gray-200">
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <p>{order.shippingInfo?.name}</p>
                                        <p>{order.shippingInfo?.address}</p>
                                        <p>{order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.pincode}</p>
                                        <p>{order.shippingInfo?.country}</p>
                                        <p className="mt-2">Phone: {order.shippingInfo?.phoneNo}</p>
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Payment Information</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <p>Method: {order.paymentInfo?.type || 'N/A'}</p>
                                        <p>Status: 
                                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                order.paymentInfo?.status === 'succeeded' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.paymentInfo?.status?.toUpperCase() || 'PENDING'}
                                            </span>
                                        </p>
                                        {order.paymentInfo?.id && (
                                            <p>Transaction ID: {order.paymentInfo.id}</p>
                                        )}
                                    </dd>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Product
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Quantity
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {order.orderItems?.map((item) => (
                                                <tr key={item._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-16 w-16">
                                                                <img 
                                                                    className="h-16 w-16 object-cover rounded-md" 
                                                                    src={item.image} 
                                                                    alt={item.name} 
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <Link 
                                                                    to={`/product/${item.product}`}
                                                                    className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                        {formatPrice(item.price)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                            <tr>
                                                <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                                                    Subtotal
                                                </td>
                                                <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                                    {formatPrice(subtotal)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                                                    Shipping
                                                </td>
                                                <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                                    {order.shippingPrice > 0 ? formatPrice(order.shippingPrice) : 'Free'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                                                    Tax
                                                </td>
                                                <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                                    {formatPrice(order.taxPrice || 0)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3" className="px-6 py-3 text-right text-lg font-bold text-gray-900">
                                                    Total
                                                </td>
                                                <td className="px-6 py-3 text-right text-lg font-bold text-gray-900">
                                                    {formatPrice(order.totalPrice)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default OrderDetails;