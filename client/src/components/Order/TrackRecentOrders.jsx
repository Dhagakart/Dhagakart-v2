import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import { getUserRecentOrders } from '../../actions/orderActions';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import { Typography } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import './TrackRecentOrders.css';

const TrackRecentOrders = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error, userOrders } = useSelector((state) => state.recentOrders);
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        if (error) {
            alert.error(error);
        }

        // Fetch user's recent orders
        dispatch(getUserRecentOrders(5, 30)); // Get last 5 orders from the past 30 days
    }, [dispatch, alert, error]);

    // Format date to a readable format
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get status color based on order status
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return '#4caf50'; // Green
            case 'shipped':
            case 'in transit':
            case 'out for delivery':
                return '#2196f3'; // Blue
            case 'processing':
                return '#ff9800'; // Orange
            case 'cancelled':
            case 'returned':
            case 'refunded':
                return '#f44336'; // Red
            default:
                return '#9e9e9e'; // Grey
        }
    };

    return (
        <>
            <MetaData title="Track Recent Orders" />
            
            {loading ? (
                <Loader />
            ) : (
                <div className="trackRecentOrdersPage">
                    <Typography component="h1" variant="h4" className="trackRecentOrdersHeading">
                        Track Your Recent Orders
                    </Typography>

                    {userOrders && userOrders.length === 0 ? (
                        <div className="noOrdersFound">
                            <Typography>No recent orders found.</Typography>
                            <Link to="/products" className="continueShoppingBtn">
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="ordersContainer">
                            {userOrders && userOrders.map((order) => (
                                <div key={order._id} className="orderCard">
                                    <div className="orderHeader">
                                        <div className="orderId">
                                            <Typography variant="h6">
                                                Order #{order._id}
                                            </Typography>
                                            <Link to={`/order/${order._id}`} className="orderDetailsLink">
                                                <LaunchIcon /> View Details
                                            </Link>
                                        </div>
                                        <div className="orderDate">
                                            <Typography>Placed on: {formatDate(order.createdAt)}</Typography>
                                        </div>
                                    </div>

                                    <div className="orderStatus" style={{ borderLeft: `4px solid ${getStatusColor(order.orderStatus)}` }}>
                                        <Typography variant="subtitle1" style={{ color: getStatusColor(order.orderStatus) }}>
                                            {order.orderStatus}
                                        </Typography>
                                        <Typography variant="body2">
                                            Expected Delivery: {order.deliveredAt ? formatDate(order.deliveredAt) : 'Calculating...'}
                                        </Typography>
                                    </div>

                                    <div className="orderItemsPreview">
                                        {order.orderItems.slice(0, 3).map((item) => (
                                            <div key={item._id} className="orderItemPreview">
                                                <img src={item.image} alt={item.name} className="orderItemImage" />
                                                <div className="orderItemDetails">
                                                    <Typography variant="body1">{item.name}</Typography>
                                                    <Typography variant="body2">Qty: {item.quantity}</Typography>
                                                    <Typography variant="body2">₹{item.price.toFixed(2)}</Typography>
                                                </div>
                                            </div>
                                        ))}
                                        {order.orderItems.length > 3 && (
                                            <Typography variant="body2" className="moreItemsText">
                                                +{order.orderItems.length - 3} more item(s)
                                            </Typography>
                                        )}
                                    </div>

                                    <div className="orderTracking">
                                        <Typography variant="h6" className="trackingTitle">Tracking Updates</Typography>
                                        {order.trackingEvents && order.trackingEvents.length > 0 ? (
                                            <div className="timeline">
                                                {order.trackingEvents.map((event, index) => (
                                                    <div key={index} className="timeline-event">
                                                        <div className="timeline-dot"></div>
                                                        <div className="timeline-content">
                                                            <Typography variant="subtitle2">{event.status}</Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                {formatDate(event.timestamp)}
                                                            </Typography>
                                                            {event.location && (
                                                                <Typography variant="caption" display="block" color="textSecondary">
                                                                    {event.location}
                                                                </Typography>
                                                            )}
                                                            {event.description && (
                                                                <Typography variant="body2" className="event-description">
                                                                    {event.description}
                                                                </Typography>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <Typography variant="body2" className="noTrackingText">
                                                No tracking updates available yet.
                                            </Typography>
                                        )}
                                    </div>

                                    <div className="orderFooter">
                                        <Typography variant="h6" className="orderTotal">
                                            Total: ₹{order.totalPrice.toFixed(2)}
                                        </Typography>
                                        <div className="orderActions">
                                            <Link to={`/order/${order._id}`} className="viewOrderBtn">
                                                View Order
                                            </Link>
                                            <Link to={`/order/invoice/${order._id}`} className="invoiceBtn" target="_blank">
                                                Download Invoice
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default TrackRecentOrders;
