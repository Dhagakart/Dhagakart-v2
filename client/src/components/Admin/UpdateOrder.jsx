import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { clearErrors, getOrderDetails, updateOrder } from '../../actions/orderAction';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';
import { formatDate } from '../../utils/functions';
import TrackStepper from '../Order/TrackStepper';
import Loading from './Loading';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar/Sidebar';
import MetaData from '../Layouts/MetaData';

const UpdateOrder = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();

    const [status, setStatus] = useState("");
    const [onMobile, setOnMobile] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);

    const { order, error, loading } = useSelector((state) => state.orderDetails);
    const { isUpdated, error: updateError } = useSelector((state) => state.order);

    useEffect(() => {
        if (window.innerWidth < 600) {
            setOnMobile(true);
        }
    }, []);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (updateError) {
            enqueueSnackbar(updateError, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isUpdated) {
            enqueueSnackbar("Order Updated Successfully", { variant: "success" });
            dispatch({ type: UPDATE_ORDER_RESET });
        }
        dispatch(getOrderDetails(params.id));
    }, [dispatch, error, params.id, isUpdated, updateError, enqueueSnackbar]);

    const updateOrderSubmitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set("status", status);
        dispatch(updateOrder(params.id, formData));
    }

    return (
        <>
            <MetaData title="Admin: Update Order | DhagaKart" />

            {loading ? <Loading /> : (
                <main className="flex min-h-screen bg-gray-50">
                    {!onMobile && <Sidebar activeTab="orders" />}
                    {toggleSidebar && <Sidebar activeTab="orders" setToggleSidebar={setToggleSidebar} />}

                    <div className="w-full min-h-screen">
                        <div className="flex flex-col gap-6 sm:p-8 p-4">
                            <div className="flex items-center justify-between">
                                <button onClick={() => setToggleSidebar(true)} className="sm:hidden bg-gray-700 w-10 h-10 rounded-full shadow text-white flex items-center justify-center hover:bg-gray-600 transition-colors">
                                    <MenuIcon />
                                </button>
                                <div className="flex items-center gap-4">
                                    <h1 className="text-2xl font-bold text-gray-900">Update Order</h1>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        order?.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                                        order?.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {order?.orderStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column - Order Details */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Information</h3>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-gray-500">Name:</span>
                                                    <span className="text-sm text-gray-700">{order?.user?.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-gray-500">Email:</span>
                                                    <span className="text-sm text-gray-700">{order?.user?.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-gray-500">Phone:</span>
                                                    <span className="text-sm text-gray-700">{order?.shippingInfo?.phoneNo}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Address</h3>
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-700">{order?.shippingInfo?.address}</p>
                                                <p className="text-sm text-gray-700">
                                                    {order?.shippingInfo?.city}, {order?.shippingInfo?.state} - {order?.shippingInfo?.pincode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Status Update */}

                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Order Timeline</h3>
                                            <TrackStepper
                                                orderOn={order.createdAt}
                                                shippedAt={order.shippedAt}
                                                deliveredAt={order.deliveredAt}
                                                activeStep={
                                                    order.orderStatus === "Delivered" ? 2 : order.orderStatus === "Shipped" ? 1 : 0
                                                }
                                            />
                                        </div>

                                        <form onSubmit={updateOrderSubmitHandler} className="space-y-4">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Update Status</h3>
                                            
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-500 mb-1">Current Status</p>
                                                <p className="font-medium text-gray-900">
                                                    {order.orderStatus === "Shipped" && (`Shipped on ${formatDate(order.shippedAt)}`)}
                                                    {order.orderStatus === "Processing" && (`Ordered on ${formatDate(order.createdAt)}`)}
                                                    {order.orderStatus === "Delivered" && (`Delivered on ${formatDate(order.deliveredAt)}`)}
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="relative w-full">
                                                    <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Update Status To
                                                    </label>
                                                    <select
                                                        id="status-select"
                                                        value={status}
                                                        onChange={(e) => setStatus(e.target.value)}
                                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
                                                        required
                                                    >
                                                        <option value="">Select Status</option>
                                                        {order.orderStatus === "Processing" && (
                                                            <option value="Shipped" className="text-blue-600">Mark as Shipped</option>
                                                        )}
                                                        {order.orderStatus === "Shipped" && (
                                                            <option value="Delivered" className="text-green-600">Mark as Delivered</option>
                                                        )}
                                                        {order.orderStatus === "Delivered" && (
                                                            <option value="Delivered" disabled className="text-gray-400">Order Already Delivered</option>
                                                        )}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 pointer-events-none">
                                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <button 
                                                type="submit" 
                                                disabled={!status}
                                                className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-colors ${
                                                    status 
                                                        ? 'bg-primary-orange hover:bg-orange-600' 
                                                        : 'bg-gray-300 cursor-not-allowed'
                                                }`}
                                            >
                                                Update Status
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items Section */}
                            <div className="mt-6">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                    <div className="p-6 border-b border-gray-100">
                                        <h3 className="text-xl font-semibold text-gray-900">Order Items</h3>
                                    </div>

                                    <div className="divide-y divide-gray-100">
                                        {order.orderItems && order.orderItems.map((item) => {
                                            const { _id, image, name, price, quantity } = item;

                                            return (
                                                <div key={_id} className="p-6 hover:bg-gray-50 transition-colors">
                                                    <div className="flex flex-col sm:flex-row">
                                                        <div className="flex-1 flex items-center gap-4">
                                                            <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                                                                <img 
                                                                    src={image} 
                                                                    alt={name} 
                                                                    className="w-full h-full object-contain"
                                                                    draggable="false"
                                                                />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-lg font-medium text-gray-900">{name}</h4>
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    Quantity: {quantity}
                                                                </p>
                                                                <div className="mt-2 flex items-center gap-2">
                                                                    <span className="text-sm font-medium text-gray-900">
                                                                        ₹{(quantity * price).toLocaleString()}
                                                                    </span>
                                                                    <span className="text-sm text-gray-500">
                                                                        ({quantity} × ₹{price.toLocaleString()})
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </main>
            )}
        </>
    );
};

export default UpdateOrder;
