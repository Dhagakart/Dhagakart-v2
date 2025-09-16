import WebFont from 'webfontloader';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Layouts/Footer/Footer';
import Header from './components/Layouts/Header/Header';
import Login from './components/User/Login';
import Register from './components/User/Register';
import { Routes, Route, useLocation } from 'react-router-dom';
import { loadUser } from './actions/userAction';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import UpdateProfile from './components/User/UpdateProfile';
import UpdatePassword from './components/User/UpdatePassword';
import ForgotPassword from './components/User/ForgotPassword';
import ResetPassword from './components/User/ResetPassword';
import AccountDG from './components/User/AccountDG';
import ProtectedRoute from './Routes/ProtectedRoute.jsx';
import Home from './components/Home/Home';
import Products from './components/Products/Products';
import Cart from './components/Cart/Cart';
import SampleCart from './components/Cart/SampleCart.jsx'
import Shipping from './components/Cart/Shipping';
import SampleShipping from './components/Cart/SampleShipping';
import OrderConfirm from './components/Cart/OrderConfirm';
import Payment from './components/Cart/Payment';
import OrderStatus from './components/Cart/OrderStatus';
import OrderSuccess from './components/Cart/OrderSuccess';
import MyOrders from './components/Order/MyOrders';
import OrderDetails from './components/Order/OrderDetails';
import Dashboard from './components/Admin/Dashboard';
import MainData from './components/Admin/MainData';
import OrderTable from './components/Admin/OrderTable';
import UpdateOrder from './components/Admin/UpdateOrder';
import ProductTable from './components/Admin/ProductTable';
import NewProduct from './components/Admin/NewProduct';
import UpdateProduct from './components/Admin/UpdateProduct';
import UserTable from './components/Admin/UserTable';
import UpdateUser from './components/Admin/UpdateUser';
import ReviewsTable from './components/Admin/ReviewsTable';
import Quotes from './components/Admin/Quotes';
import Wishlist from './components/Wishlist/Wishlist';
import NotFound from './components/NotFound';
import ReqCredits from './components/ReqCredits/ReqCredits';
import BulkOrder from './components/BulkOrder/BulkOrder';
import QuoteSuccess from './components/BulkOrder/QuoteSuccess';
import LoginDG from './components/User/LoginDG';
import OtpDG from './components/User/OtpDG.jsx';
import LoginDG2 from './components/User/LoginDG2';
import HeaderDG from './components/Layouts/Header/HeaderDG';
import RegisterSuccess from './components/User/RegisterSuccess';
import ForgotPasswordDG from './components/User/ForgotPasswordDG';
import FooterDG from './components/Layouts/Footer/FooterDG';
import ProductDetailsDG from './components/ProductDetails/ProductDetailsDG';
import Sitemap from './components/Sitemap/Sitemap';

// --- MODIFICATION: Import the new global notifier component ---
import GlobalOrderNotifier from './components/Admin/GlobalOrderNotifier';

function App() {
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    useEffect(() => {
        WebFont.load({
            google: {
                families: ["Roboto:300,400,500,600,700"]
            },
        });
    }, []);

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }, [pathname]);

    const isAdminRoute = pathname.startsWith('/admin/');

    return (
        <>
            <HeaderDG />
            {/* --- MODIFICATION: Add the notifier component to the global layout --- */}
            {/* It will automatically handle logic for admin users */}
            <GlobalOrderNotifier />
            <main className="-mt-8">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/register/success" element={<RegisterSuccess />} />
                    <Route path="/oauth-complete-registration" element={<Register />} />
                    <Route path="/loginDG" element={<LoginDG />} />
                    <Route path="/otpDG" element={<OtpDG />} />
                    <Route path="/loginDG2" element={<LoginDG2 />} />
                    <Route path="/password/forgot" element={<ForgotPasswordDG />} />
                    <Route path="/product/:id" element={<ProductDetailsDG />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:keyword" element={<Products />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/sample-cart" element={<SampleCart />} />
                    
                    {/* Protected Routes */}
                    <Route path="/shipping" element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
                    <Route path="/sample-shipping" element={<ProtectedRoute><SampleShipping /></ProtectedRoute>} />
                    <Route path="/order/confirm" element={<ProtectedRoute><OrderConfirm /></ProtectedRoute>} />
                    <Route path="/process/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                    <Route path="/orders/success" element={<OrderSuccess success={true} />} />
                    <Route path="/orders/failed" element={<OrderSuccess success={false} />} />
                    <Route path="/order/:id" element={<ProtectedRoute><OrderStatus /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                    <Route path="/order_details/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
                    <Route path="/account" element={<ProtectedRoute><AccountDG /></ProtectedRoute>}>
                        <Route index element={<AccountDG defaultTab="profile" />} />
                        <Route path="profile" element={<AccountDG defaultTab="profile" />} />
                        <Route path="orders" element={<AccountDG defaultTab="orders" />} />
                        {/* <Route path="track-order" element={<AccountDG defaultTab="track-order" />} /> */}
                        <Route path="rfqs" element={<AccountDG defaultTab="rfqs" />} />
                    </Route>
                    <Route path="/account/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
                    <Route path="/password/update" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
                    <Route path="/password/reset/:token" element={<ResetPassword />} />
                    <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}><Dashboard activeTab={0}><MainData /></Dashboard></ProtectedRoute>} />
                    <Route path="/admin/orders" element={<ProtectedRoute isAdmin={true}><Dashboard activeTab={1}><OrderTable /></Dashboard></ProtectedRoute>} />
                    <Route path="/admin/order/:id" element={<ProtectedRoute isAdmin={true}><Dashboard activeTab={1}><UpdateOrder /></Dashboard></ProtectedRoute>} />
                    <Route path="/admin/products" element={<ProtectedRoute isAdmin={true}><Dashboard activeTab={2}><ProductTable /></Dashboard></ProtectedRoute>} />
                    <Route path="/admin/new_product" element={<ProtectedRoute isAdmin={true}><Dashboard activeTab={3}><NewProduct /></Dashboard></ProtectedRoute>} />
                    <Route path="/admin/product/:id" element={<ProtectedRoute isAdmin={true}><Dashboard activeTab={2}><UpdateProduct /></Dashboard></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute isAdmin={true}><Dashboard activeTab={4}><UserTable /></Dashboard></ProtectedRoute>} />
                    <Route path="/admin/user/:id" element={<ProtectedRoute isAdmin={true}><Dashboard activeTab={4}><UpdateUser /></Dashboard></ProtectedRoute>} />
                    <Route path="/admin/reviews" element={<ProtectedRoute isAdmin={true}><Dashboard activeTab={5}><ReviewsTable /></Dashboard></ProtectedRoute>} />
                    <Route path="/admin/quotes" element={<ProtectedRoute isAdmin={true}><Dashboard activeTab={6}><Quotes /></Dashboard></ProtectedRoute>} />

                    {/* Other Routes */}
                    <Route path="/reqcredits" element={<ReqCredits />} />
                    <Route path="/bulkorder" element={<BulkOrder />} />
                    <Route path="/quote/success" element={<QuoteSuccess />} />
                    <Route path="/sitemap" element={<Sitemap />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Toaster position="bottom-right" />
            {!isAdminRoute && <FooterDG />}
        </>
    );
}

export default App;