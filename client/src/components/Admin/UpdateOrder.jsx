// import { useSnackbar } from 'notistack';
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, Link } from 'react-router-dom';
// import { clearErrors, getOrderDetails, updateOrder } from '../../actions/orderAction';
// import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';
// import { formatDate } from '../../utils/functions';
// import TrackStepper from '../Order/TrackStepper';
// import Loading from './Loading';
// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import MenuIcon from '@mui/icons-material/Menu';
// import Sidebar from './Sidebar/Sidebar';
// import MetaData from '../Layouts/MetaData';
// import { Select, MenuItem, TextField } from '@mui/material';

// const UpdateOrder = () => {
//     const dispatch = useDispatch();
//     const { enqueueSnackbar } = useSnackbar();
//     const params = useParams();

//     const [status, setStatus] = useState("");
//     const [vrlInvoiceLink, setVrlInvoiceLink] = useState("");
//     const [consignmentNumber, setConsignmentNumber] = useState("");
//     const [onMobile, setOnMobile] = useState(false);
//     const [toggleSidebar, setToggleSidebar] = useState(false);

//     const { order, error, loading } = useSelector((state) => state.orderDetails);
//     const { isUpdated, error: updateError } = useSelector((state) => state.order);

//     useEffect(() => {
//         if (window.innerWidth < 600) {
//             setOnMobile(true);
//         }
//     }, []);

//     // Set initial values when order data is loaded
//     useEffect(() => {
//         if (order) {
//             setVrlInvoiceLink(order.vrlInvoiceLink || '');
//             setConsignmentNumber(order.consignmentNumber || '');
//         }
//     }, [order]);

//     useEffect(() => {
//         if (error) {
//             enqueueSnackbar(error, { variant: "error" });
//             dispatch(clearErrors());
//         }
//         if (updateError) {
//             enqueueSnackbar(updateError, { variant: "error" });
//             dispatch(clearErrors());
//         }
//         if (isUpdated) {
//             enqueueSnackbar("Order Updated Successfully", { variant: "success" });
//             dispatch({ type: UPDATE_ORDER_RESET });
//         }
//         dispatch(getOrderDetails(params.id));
//     }, [dispatch, error, params.id, isUpdated, updateError, enqueueSnackbar]);

//     const updateOrderSubmitHandler = (e) => {
//         e.preventDefault();

//         const myForm = new FormData();
//         myForm.set("status", status);
        
//         // Add VRL shipping details to the form data
//         if (vrlInvoiceLink) myForm.set("vrlInvoiceLink", vrlInvoiceLink);
//         if (consignmentNumber) myForm.set("consignmentNumber", consignmentNumber);

//         dispatch(updateOrder(params.id, myForm));
//     };

//     return (
//         <>
//             <MetaData title="Admin: Update Order | DhagaKart" />

//             {loading ? <Loading /> : (
//                 <main className="min-h-screen bg-gray-100 transition-all duration-300">
//                     <div className="flex">
//                         {!onMobile && <Sidebar activeTab="orders" />}
//                         {toggleSidebar && (
//                             <div className="fixed inset-0 z-50 animate-slideInLeft">
//                                 <Sidebar activeTab="orders" setToggleSidebar={setToggleSidebar} />
//                             </div>
//                         )}

//                         <div className="flex-1 p-4 sm:p-8 bg-[#F8F9FA]">
//                             <div className="max-w-7xl mx-auto">
//                                 {/* Header Section */}
//                                 <div className="flex items-center justify-between mb-8">
//                                     <button 
//                                         onClick={() => setToggleSidebar(true)} 
//                                         className="sm:hidden p-2 rounded-full bg-[#003366] text-white hover:bg-[#002244] transition-colors"
//                                     >
//                                         <MenuIcon className="w-6 h-6" />
//                                     </button>
//                                     <div className="flex items-center gap-4">
//                                         <Link to="/admin/orders" className="text-[#003366] hover:text-[#002244]">
//                                             <ArrowBackIosIcon className="w-5 h-5" />
//                                         </Link>
//                                         <h1 className="text-2xl sm:text-3xl font-bold text-[#003366]">Update Order #{params.id}</h1>
//                                         <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
//                                             order?.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
//                                             order?.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
//                                             'bg-amber-100 text-amber-800'
//                                         }`}>
//                                             {order?.orderStatus}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                                     {/* Left Column - Order Details */}
//                                     <div className="lg:col-span-2 space-y-6">
//                                         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
//                                             <h2 className="text-xl font-semibold text-[#003366] mb-6 pb-2 border-b border-gray-100">Order Details</h2>
//                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                                 <div>
//                                                     <h3 className="text-lg font-medium text-[#003366] mb-3">Customer Information</h3>
//                                                     <div className="space-y-3">
//                                                         <div className="flex items-center gap-2">
//                                                             <span className="text-sm font-medium text-gray-600 w-24">Name:</span>
//                                                             <span className="text-sm text-gray-800 font-medium">{order?.user?.name}</span>
//                                                         </div>
//                                                         <div className="flex items-center gap-2">
//                                                             <span className="text-sm font-medium text-gray-600 w-24">Email:</span>
//                                                             <span className="text-sm text-gray-800">{order?.user?.email}</span>
//                                                         </div>
//                                                         <div className="flex items-center gap-2">
//                                                             <span className="text-sm font-medium text-gray-600 w-24">Phone:</span>
//                                                             <span className="text-sm text-gray-800">{order?.shippingInfo?.phoneNo}</span>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div>
//                                                     <h3 className="text-lg font-medium text-[#003366] mb-3">Shipping Address</h3>
//                                                     <div className="space-y-2">
//                                                         <p className="text-sm text-gray-800">{order?.shippingInfo?.address}</p>
//                                                         <p className="text-sm text-gray-800">
//                                                             {order?.shippingInfo?.city}, {order?.shippingInfo?.state} - {order?.shippingInfo?.pincode}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* Order Items */}
//                                         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//                                             <div className="p-6 border-b border-gray-100">
//                                                 <h3 className="text-xl font-semibold text-[#003366]">Order Items</h3>
//                                             </div>
//                                             <div className="divide-y divide-gray-100">
//                                                 {order.orderItems && order.orderItems.map((item) => (
//                                                     <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
//                                                         <div className="flex flex-col sm:flex-row items-center gap-4">
//                                                             <div className="w-24 h-24 flex items-center justify-center bg-white rounded-lg border border-gray-200 p-2">
//                                                                 <img 
//                                                                     src={item.image} 
//                                                                     alt={item.name} 
//                                                                     className="max-w-full max-h-full object-contain"
//                                                                     draggable="false"
//                                                                 />
//                                                             </div>
//                                                             <div className="flex-1 w-full">
//                                                                 <h4 className="text-base font-medium text-gray-900">{item.name}</h4>
//                                                                 <p className="text-sm text-gray-500 mt-1">
//                                                                     {item.quantity} {item.unit?.name ? item.unit.name : 'unit'}{item.quantity > 1 ? 's' : ''}
//                                                                 </p>
//                                                                 <div className="mt-2 flex items-center gap-2">
//                                                                     <span className="text-base font-semibold text-[#003366]">
//                                                                         ₹{(item.quantity * item.price).toLocaleString('en-IN')}
//                                                                     </span>
//                                                                     <span className="text-sm text-gray-500">
//                                                                         ({item.quantity} × ₹{item.price.toLocaleString('en-IN')})
//                                                                     </span>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Right Column - Status Update */}
//                                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-4">
//                                         <h3 className="text-xl font-semibold text-[#003366] mb-6 pb-2 border-b border-gray-100">Order Status</h3>
//                                         <div className="space-y-6">
//                                             <div>
//                                                 <h4 className="text-sm font-medium text-gray-600 mb-3">Order Timeline</h4>
//                                                 <TrackStepper
//                                                     orderOn={order?.createdAt || ''}
//                                                     shippedAt={order?.shippedAt || ''}
//                                                     deliveredAt={order?.deliveredAt || ''}
//                                                     activeStep={
//                                                         order?.orderStatus === "Delivered" ? 2 : 
//                                                         order?.orderStatus === "Shipped" ? 1 : 0
//                                                     }
//                                                 />
//                                             </div>

//                                             <form onSubmit={updateOrderSubmitHandler} className="space-y-4">
//                                                 <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
//                                                     <p className="text-xs text-gray-500 mb-1">Current Status</p>
//                                                     <p className="text-sm font-medium text-[#003366]">
//                                                         {order?.orderStatus === "Shipped" && `Shipped on ${formatDate(order?.shippedAt)}`}
//                                                         {order?.orderStatus === "Processing" && `Ordered on ${formatDate(order?.createdAt)}`}
//                                                         {order?.orderStatus === "Delivered" && `Delivered on ${formatDate(order?.deliveredAt)}`}
//                                                     </p>
//                                                 </div>

//                                                 {/* VRL Shipping Details */}
//                                                 <div className="mt-6 pt-6 border-t border-gray-100">
//                                                     <h4 className="text-sm font-medium text-gray-700 mb-3">VRL Shipping Details</h4>
                                                    
//                                                     <div className="space-y-4">
//                                                         <div>
//                                                             <label htmlFor="consignment-number" className="block text-sm font-medium text-gray-700 mb-1">
//                                                                 Consignment Number
//                                                             </label>
//                                                             <TextField
//                                                                 id="consignment-number"
//                                                                 fullWidth
//                                                                 size="small"
//                                                                 value={consignmentNumber}
//                                                                 onChange={(e) => setConsignmentNumber(e.target.value)}
//                                                                 placeholder="Enter consignment number"
//                                                                 variant="outlined"
//                                                             />
//                                                         </div>
                                                        
//                                                         <div>
//                                                             <label htmlFor="vrl-invoice-link" className="block text-sm font-medium text-gray-700 mb-1">
//                                                                 VRL Invoice Link
//                                                             </label>
//                                                             <TextField
//                                                                 id="vrl-invoice-link"
//                                                                 fullWidth
//                                                                 size="small"
//                                                                 type="url"
//                                                                 value={vrlInvoiceLink}
//                                                                 onChange={(e) => setVrlInvoiceLink(e.target.value)}
//                                                                 placeholder="https://example.com/invoice/123"
//                                                                 variant="outlined"
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div className="pt-4">
//                                                     <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-2">
//                                                         Update Status To
//                                                     </label>
//                                                     <Select
//                                                         id="status-select"
//                                                         value={status}
//                                                         onChange={(e) => setStatus(e.target.value)}
//                                                         displayEmpty
//                                                         fullWidth
//                                                         size="small"
//                                                         required
//                                                         sx={{
//                                                             '& .MuiOutlinedInput-root': {
//                                                                 '&:hover fieldset': { borderColor: '#003366' },
//                                                                 '&.Mui-focused fieldset': { borderColor: '#003366' }
//                                                             }
//                                                         }}
//                                                     >
//                                                         <MenuItem value=""><em>Select Status</em></MenuItem>
//                                                         {order?.orderStatus === "Processing" && (
//                                                             <MenuItem value="Shipped">Mark as Shipped</MenuItem>
//                                                         )}
//                                                         {order?.orderStatus === "Shipped" && (
//                                                             <MenuItem value="Delivered">Mark as Delivered</MenuItem>
//                                                         )}
//                                                         {order?.orderStatus === "Delivered" && (
//                                                             <MenuItem value="Delivered" disabled>Order Already Delivered</MenuItem>
//                                                         )}
//                                                         {!order?.orderStatus && (
//                                                             <MenuItem value="" disabled>Loading status...</MenuItem>
//                                                         )}
//                                                     </Select>
//                                                 </div>

//                                                 <button 
//                                                     type="submit" 
//                                                     disabled={!status}
//                                                     className={`w-full py-2.5 px-4 rounded-md font-medium text-white transition-colors ${
//                                                         status 
//                                                             ? 'bg-[#003366] hover:bg-[#002244]' 
//                                                             : 'bg-gray-300 cursor-not-allowed'
//                                                     }`}
//                                                 >
//                                                     Update Status
//                                                 </button>
//                                             </form>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <style jsx>{`
//                         @keyframes slideInLeft {
//                             from {
//                                 transform: translateX(-100%);
//                             }
//                             to {
//                                 transform: translateX(0);
//                             }
//                         }
//                         .animate-slideInLeft {
//                             animation: slideInLeft 0.3s ease-out;
//                         }
//                     `}</style>
//                 </main>
//             )}
//         </>
//     );
// };

// export default UpdateOrder;
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { clearErrors, getOrderDetails, updateOrder } from '../../actions/orderAction';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';
import { formatDate } from '../../utils/functions';
import TrackStepper from '../Order/TrackStepper';
import Loading from './Loading';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar/Sidebar';
import MetaData from '../Layouts/MetaData';
import { Select, MenuItem, TextField, Button } from '@mui/material';

const UpdateOrder = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();

    const [status, setStatus] = useState("");
    const [vrlInvoiceLink, setVrlInvoiceLink] = useState("");
    const [consignmentNumber, setConsignmentNumber] = useState("");
    const [toggleSidebar, setToggleSidebar] = useState(false);

    const { order, error, loading } = useSelector((state) => state.orderDetails);
    const { isUpdated, error: updateError } = useSelector((state) => state.order);

    useEffect(() => {
        // Fetch order details only when the component mounts or the ID changes
        if (params.id) {
            dispatch(getOrderDetails(params.id));
        }
    }, [dispatch, params.id]);

    useEffect(() => {
        // This effect populates the local state once the order data is fetched from Redux
        if (order && order._id === params.id) {
            setStatus(order.orderStatus || '');
            setVrlInvoiceLink(order.vrlInvoiceLink || '');
            setConsignmentNumber(order.consignmentNumber || '');
        }
    }, [order, params.id]);

    useEffect(() => {
        // This effect handles notifications and state resets after an update
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
            // Re-fetch details after a successful update to get the latest data
            dispatch(getOrderDetails(params.id));
        }
    }, [dispatch, error, params.id, isUpdated, updateError, enqueueSnackbar]);

    const updateOrderSubmitHandler = (e) => {
        e.preventDefault();

        const updateData = {
            status,
            vrlInvoiceLink,
            consignmentNumber,
        };

        dispatch(updateOrder(params.id, updateData));
    };

    return (
        <>
            <MetaData title="Admin: Update Order | DhagaKart" />

            {loading ? <Loading /> : (
                <main className="min-h-screen bg-gray-100">
                    <div className="flex">
                        <Sidebar activeTab="orders" />
                        
                        {/* Mobile Sidebar can be added here if needed */}

                        <div className="flex-1 p-4 sm:p-8 bg-[#F8F9FA]">
                            <div className="max-w-7xl mx-auto">
                                {/* Header Section */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <Link to="/admin/orders" className="text-[#003366] hover:text-[#002244]">
                                            <ArrowBackIosIcon />
                                        </Link>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-[#003366]">Update Order #{params.id}</h1>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column - Order Details */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Customer Info and Shipping Address */}
                                        <div className="bg-white rounded-xl shadow-sm p-6">
                                            <h2 className="text-xl font-semibold text-[#003366] mb-4">Customer & Shipping</h2>
                                            <p><b>Name:</b> {order?.user?.name}</p>
                                            <p><b>Email:</b> {order?.user?.email}</p>
                                            <p><b>Phone:</b> {order?.shippingInfo?.phoneNo}</p>
                                            <p><b>Address:</b> {`${order?.shippingInfo?.address}, ${order?.shippingInfo?.city}, ${order?.shippingInfo?.state} - ${order?.shippingInfo?.pincode}`}</p>
                                        </div>
                                        {/* Order Items */}
                                        <div className="bg-white rounded-xl shadow-sm p-6">
                                            <h3 className="text-xl font-semibold text-[#003366] mb-4">Order Items</h3>
                                            <div className="divide-y">
                                                {order?.orderItems?.map((item) => (
                                                    <div key={item.product} className="flex items-center gap-4 py-2">
                                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-contain"/>
                                                        <div className="flex-1">
                                                            <Link to={`/product/${item.product}`} className="font-medium hover:underline">{item.name}</Link>
                                                            <p className="text-sm text-gray-600">{item.quantity} x ₹{item.price.toLocaleString('en-IN')} = <b>₹{(item.quantity * item.price).toLocaleString('en-IN')}</b></p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Status Update */}
                                    <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-4">
                                        <h3 className="text-xl font-semibold text-[#003366] mb-4">Update Status & Tracking</h3>
                                        <form onSubmit={updateOrderSubmitHandler} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                                                <Select value={status} onChange={(e) => setStatus(e.target.value)} fullWidth size="small">
                                                    <MenuItem value="Processing">Processing</MenuItem>
                                                    <MenuItem value="Shipped">Shipped</MenuItem>
                                                    <MenuItem value="Delivered">Delivered</MenuItem>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Consignment Number</label>
                                                <TextField fullWidth size="small" value={consignmentNumber} onChange={(e) => setConsignmentNumber(e.target.value)} placeholder="Enter consignment number" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">VRL Invoice Link</label>
                                                <TextField fullWidth size="small" type="url" value={vrlInvoiceLink} onChange={(e) => setVrlInvoiceLink(e.target.value)} placeholder="https://example.com/invoice/123" />
                                            </div>
                                            <Button type="submit" variant="contained" fullWidth>
                                                Update Order
                                            </Button>
                                        </form>
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