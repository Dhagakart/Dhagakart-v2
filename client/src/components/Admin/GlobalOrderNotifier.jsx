import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import toast from 'react-hot-toast';

import { Card, Box, Typography, IconButton, Avatar } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ClearIcon from '@mui/icons-material/Clear';

import { NEW_ORDER_RECEIVED } from '../../constants/orderConstants';
import notificationSound from './notification.mp3'; // Ensure this path is correct

// A Set to keep track of active toast IDs to manage the sound
const activeNotifications = new Set();
let audio; // A single audio instance

// --- Reusable Notification Toast Component ---
const NotificationToast = ({ t, order, onNotificationClick, onClose }) => {
    return (
        <Card 
            elevation={6} 
            onClick={onNotificationClick}
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2, 
                gap: 2, 
                borderRadius: '12px',
                cursor: 'pointer',
                minWidth: '320px',
                '&:hover': {
                    backgroundColor: 'grey.50'
                }
            }}
        >
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                <NotificationsActiveIcon sx={{ color: 'white' }} />
            </Avatar>
            <Box flexGrow={1}>
                <Typography variant="subtitle2" component="div" sx={{ fontWeight: 'bold' }}>
                    New Order Received!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    From: {order.shippingInfo.businessName || 'A Customer'}
                </Typography>
            </Box>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onClose(t.id); }} sx={{ color: 'text.secondary' }}>
                <ClearIcon fontSize="small" />
            </IconButton>
        </Card>
    );
};

const GlobalOrderNotifier = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const audioRef = useRef(null);

    // Initialize the audio element once
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(notificationSound);
            audioRef.current.loop = true;
        }
        audio = audioRef.current;
    }, []);

    const playSound = () => {
        audio?.play().catch(error => console.error("Audio play failed:", error));
    };

    const stopSound = () => {
        audio?.pause();
        if(audio) audio.currentTime = 0;
    };

    // This function is now ONLY called by the 'X' button
    const handleNotificationClose = (id) => {
        activeNotifications.delete(id);
        if (activeNotifications.size === 0) {
            stopSound();
        }
        toast.dismiss(id);
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            // const SOCKET_URL = 'https://dhagakart.onrender.com';
            const SOCKET_URL = 'http://localhost:4000';
            const socket = io(SOCKET_URL);

            socket.on("connect", () => console.log("Global Socket.io connection established for Admin."));

            socket.on("newOrder", (order) => {
                dispatch({ type: NEW_ORDER_RECEIVED, payload: order });
                
                const notificationId = `order-${Date.now()}`;
                activeNotifications.add(notificationId);
                
                if (activeNotifications.size > 0) {
                    playSound();
                }

                toast.custom(
                    (t) => (
                        <NotificationToast 
                            t={t} 
                            order={order} 
                            onClose={handleNotificationClose} // For the 'X' button
                            // --- MODIFICATION: Main click now ONLY navigates ---
                            onNotificationClick={() => {
                                navigate('/admin/orders');
                                // The toast is NOT closed here, forcing explicit dismissal via the 'X' button.
                            }}
                        />
                    ),
                    { 
                        id: notificationId, 
                        duration: Infinity,
                        position: 'top-right' 
                    }
                );
            });

            socket.on("disconnect", () => console.log("Global Socket.io connection disconnected."));

            // Cleanup on component unmount or user change
            return () => {
                socket.disconnect();
                stopSound();
                activeNotifications.clear();
            };
        }
    }, [user, dispatch, navigate]);

    // This component renders nothing itself
    return null;
};

export default GlobalOrderNotifier;