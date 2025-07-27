import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    InputAdornment,
    Grid,
    Paper,
    IconButton,
    Typography,
    Card,
    CardHeader,
    CardContent,
    Collapse,
    useTheme,
    useMediaQuery,
    Avatar // Added for the new notification UI
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'; // Added for the new notification UI
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
    clearErrors,
    deleteOrder,
    getAllOrders,
    searchOrders,
} from '../../actions/orderAction';
import { DELETE_ORDER_RESET, NEW_ORDER_RECEIVED } from '../../constants/orderConstants';
import Actions from './Actions';
import { formatDate } from '../../utils/functions';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
import Sidebar from './Sidebar/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';

// --- START: Imports for Real-Time Notifications ---
import { io } from "socket.io-client";
import toast from 'react-hot-toast';
import notificationSound from './notification.mp3';

// Global variables for sound management
let audioContext = null;
let audioSource = null;
let audioElement = null;
let activeNotifications = new Set();
// --- END: Imports for Real-Time Notifications ---

const OrderTable = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [onMobile, setOnMobile] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 10; // Constant page size
    const [formValues, setFormValues] = useState({
        orderId: '',
        customerName: '',
        customerEmail: '',
        productName: '',
        minAmount: '',
        maxAmount: '',
        status: '',
        startDate: null,
        endDate: null,
        paymentMethod: ''
    });

    const [searchParams, setSearchParams] = useState({});
    const [sortBy, setSortBy] = useState('-createdAt');

    const {
        orders: allOrders = [],
        totalOrders: allTotalOrders = 0,
        totalPages: allTotalPages = 1,
        currentPage: allCurrentPage = 1,
        limit: allLimit = 10,
        error: allOrdersError,
        loading: allOrdersLoading = false
    } = useSelector((state) => state.allOrders || {});

    const {
        orders: searchResults = [],
        pagination: searchPagination = {
            currentPage: 1,
            totalPages: 1,
            totalOrders: 0,
            limit: 10
        },
        loading: searchLoading = false,
        error: searchError
    } = useSelector((state) => state.searchOrders || {});

    const {
        loading: isDeleting = false,
        isDeleted = false,
        error: deleteError = null
    } = useSelector((state) => state.order || {});

    const isSearching = useMemo(() =>
        Object.values(searchParams).some(param =>
            param !== '' && param !== null && param !== undefined
        ),
        [searchParams]
    );

    const orders = isSearching ? searchResults : allOrders;

    const startNotificationSound = async () => {
        if (audioElement) return; // Already playing
        
        try {
            // Create audio context if it doesn't exist
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            
            // Create audio element
            audioElement = new Audio(notificationSound);
            audioElement.loop = true;
            
            // Create media element source
            audioSource = audioContext.createMediaElementSource(audioElement);
            audioSource.connect(audioContext.destination);
            
            // Try to play the audio
            try {
                await audioContext.resume();
                await audioElement.play();
                console.log("Notification sound started");
            } catch (playError) {
                console.error("Audio play failed:", playError);
                // If autoplay was prevented, show a message to the user
                toast('🔔 Click anywhere to enable sound notifications', {
                    duration: 3000,
                    position: 'bottom-right'
                });
            }
        } catch (error) {
            console.error("Audio initialization failed:", error);
        }
    };
    
    const stopNotificationSound = () => {
        if (audioElement) {
            try {
                audioElement.pause();
                audioElement.currentTime = 0;
                if (audioSource) {
                    audioSource.disconnect();
                }
                if (audioContext && audioContext.state !== 'closed') {
                    audioContext.close();
                }
            } catch (error) {
                console.error("Error stopping sound:", error);
            } finally {
                audioElement = null;
                audioSource = null;
                audioContext = null;
            }
        }
    };
    
    const handleNotificationClose = (id) => {
        activeNotifications.delete(id);
        if (activeNotifications.size === 0) {
            stopNotificationSound();
        }
        toast.dismiss(id);
    };

    // --- Real-Time Notification Logic ---
    useEffect(() => {
        // const BACKEND_URL = 'http://localhost:4000';
        const BACKEND_URL = 'https://dhagakart.onrender.com';
        const socket = io(BACKEND_URL);

        socket.on("connect", () => {
            console.log("Socket.io connection established.");
        });

        socket.on("newOrder", (order) => {
            console.log("--- New Order Event Received on Frontend ---", order);
            
            const notificationId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            activeNotifications.add(notificationId);
            
            if (activeNotifications.size === 1) {
                startNotificationSound();
            }
            
            // --- UPDATED NOTIFICATION UI ---
            toast.custom(
                (t) => (
                    <Card 
                        elevation={4} 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            p: 2, 
                            gap: 2,
                            borderRadius: '12px',
                            // A subtle animation for appearing
                            animation: t.visible ? 'fadeIn 0.3s ease-out' : 'fadeOut 0.3s ease-in forwards',
                            '@keyframes fadeIn': { from: { opacity: 0, transform: 'translateY(-20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                            '@keyframes fadeOut': { from: { opacity: 1 }, to: { opacity: 0 } }
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
                                From: {order.shippingInfo.businessName}
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={() => handleNotificationClose(t.id)}
                            sx={{ color: 'text.secondary' }}
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    </Card>
                ),
                {
                    id: notificationId,
                    duration: Infinity,
                    style: {
                        background: 'transparent',
                        padding: 0,
                        margin: '8px 0',
                        boxShadow: 'none'
                    },
                }
            );
            
            dispatch({
                type: NEW_ORDER_RECEIVED,
                payload: order,
            });
        });

        socket.on("disconnect", () => {
            console.log("Socket.io connection disconnected.");
        });

        return () => {
            socket.disconnect();
        };
    }, [dispatch]);
    // --- END: Real-Time Notification Logic ---


    useEffect(() => {
        console.log('OrderTable state:', {
            allOrders,
            searchResults,
            searchPagination,
            isSearching,
            searchParams,
            pagination: {
                currentPage: isSearching ? searchPagination.currentPage : allCurrentPage,
                totalPages: isSearching ? searchPagination.totalPages : allTotalPages,
                totalOrders: isSearching ? searchPagination.totalOrders : allTotalOrders
            }
        });
    }, [allOrders, searchResults, searchPagination, isSearching, searchParams, allCurrentPage, allTotalPages, allTotalOrders]);

    const paginationInfo = useMemo(() => ({
        currentPage: isSearching ? (searchPagination.currentPage || 1) : (allCurrentPage || 1),
        totalPages: isSearching ? (searchPagination.totalPages || 1) : (allTotalPages || 1),
        totalOrders: isSearching ? (searchPagination.totalOrders || 0) : (allTotalOrders || 0),
        limit: isSearching ? (searchPagination.limit || 10) : (allLimit || 10)
    }), [isSearching, searchPagination, allCurrentPage, allTotalPages, allTotalOrders, allLimit]);

    const error = searchError || allOrdersError;
    const isLoading = allOrdersLoading || searchLoading;

    useEffect(() => {
        if (window.innerWidth < 600) {
            setOnMobile(true);
        }
    }, []);

    const fetchOrders = useCallback(async (searchParamsToUse = null) => {
        const paramsToUse = searchParamsToUse || searchParams;
        const hasSearchParams = paramsToUse && Object.values(paramsToUse).some(param =>
            param !== '' && param !== null && param !== undefined
        );

        try {
            if (hasSearchParams && isSearching) {
                console.log('Fetching orders with search params:', paramsToUse);
                const params = {
                    ...paramsToUse,
                    startDate: paramsToUse.startDate ? paramsToUse.startDate.toISOString().split('T')[0] : null,
                    endDate: paramsToUse.endDate ? paramsToUse.endDate.toISOString().split('T')[0] : null,
                    page,
                    limit,
                    sortBy
                };

                Object.keys(params).forEach(key => {
                    if (params[key] === '' || params[key] === null || params[key] === undefined) {
                        delete params[key];
                    }
                });

                console.log('Searching with params:', params);
                await dispatch(searchOrders(params));
            } else {
                console.log('Fetching all orders with pagination:', { page, limit, sortBy });
                await dispatch(getAllOrders({
                    page,
                    limit,
                    sortBy
                }));
            }
        } catch (error) {
            console.error('Error in fetchOrders:', error);
            enqueueSnackbar(error.message || 'An error occurred while fetching orders', {
                variant: 'error'
            });
        }
    }, [page, limit, sortBy, dispatch, enqueueSnackbar, isSearching, searchParams]);

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (!isSearching) {
            fetchOrders();
        }
    }, [page, sortBy, isSearching, fetchOrders]);

    useEffect(() => {
        if (deleteError) {
            enqueueSnackbar(deleteError, { variant: 'error' });
            dispatch(clearErrors());
        }

        if (isDeleted) {
            enqueueSnackbar('Order deleted successfully', { variant: 'success' });
            dispatch({ type: DELETE_ORDER_RESET });
            fetchOrders();
        }
    }, [dispatch, deleteError, isDeleted, enqueueSnackbar, fetchOrders]);

    useEffect(() => {
        console.log('Initial load, fetching orders...');
        fetchOrders();

        return () => {
            isInitialMount.current = true;
        };
    }, [fetchOrders]);


    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearchParams({ ...formValues });
        fetchOrders(formValues);
    };

    const handleClearFilters = () => {
        const emptyForm = {
            orderId: '',
            customerName: '',
            customerEmail: '',
            productName: '',
            minAmount: '',
            maxAmount: '',
            status: '',
            startDate: null,
            endDate: null,
            paymentMethod: ''
        };
        setFormValues(emptyForm);
        setSearchParams({});
        setPage(1);
        setSortBy('-createdAt');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (name, date) => {
        setFormValues(prev => ({
            ...prev,
            [name]: date
        }));
    };

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
    }

    const columns = [
        {
            field: "id",
            headerName: "Order ID",
            minWidth: 200,
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <>
                        {
                            params.row.status === "Delivered" ? (
                                <span className="text-sm bg-green-100 p-1 px-2 font-medium rounded-full text-green-800">{params.row.status}</span>
                            ) : params.row.status === "Shipped" ? (
                                <span className="text-sm bg-yellow-100 p-1 px-2 font-medium rounded-full text-yellow-800">{params.row.status}</span>
                            ) : (
                                <span className="text-sm bg-purple-100 p-1 px-2 font-medium rounded-full text-purple-800">{params.row.status}</span>
                            )
                        }
                    </>
                )
            },
        },
        {
            field: "itemsQty",
            headerName: "Qty & Units",
            minWidth: 120,
            flex: 0.15,
            renderCell: (params) => {
                const orderItems = params.row.orderItems || [];
                
                return (
                    <div className="w-full">
                        {orderItems.map((item, idx) => {
                            const unitName = item.unit?.name || 'unit';
                            const quantity = item.quantity || 0;
                            const itemText = `${quantity} ${unitName}${quantity !== 1 ? 's' : ''}`;
                            
                            return (
                                <div 
                                    key={idx} 
                                    className="text-sm whitespace-nowrap"
                                    title={itemText}
                                >
                                    {itemText}
                                </div>
                            );
                        })}
                    </div>
                );
            },
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 200,
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <span>₹{params.row.amount.toLocaleString()}</span>
                );
            },
        },
        {
            field: "orderOn",
            headerName: "Order On",
            type: "date",
            minWidth: 200,
            flex: 0.5,
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 100,
            flex: 0.3,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Actions editRoute={"order"} deleteHandler={deleteOrderHandler} id={params.row.id} />
                );
            },
        },
    ];

    const rows = useMemo(() => {
        if (!Array.isArray(orders)) {
            console.warn('Orders is not an array:', orders);
            return [];
        }

        return orders.map((order) => {
            if (!order) {
                console.warn('Encountered null/undefined order in orders array');
                return null;
            }

            try {
                // Calculate total items and units
                const itemsQty = Array.isArray(order.orderItems) ? order.orderItems.length : 0;
                
                // Prepare order items with unit information
                const orderItems = (order.orderItems || []).map(item => ({
                    ...item,
                    unit: item.unit || {
                        name: 'unit',
                        minQty: 1,
                        increment: 1,
                        isDefault: true,
                        price: item.price,
                        cuttedPrice: item.cuttedPrice
                    }
                }));

                return {
                    id: order._id || order.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
                    itemsQty,
                    amount: order.totalPrice || 0,
                    orderOn: order.createdAt ? formatDate(order.createdAt) : 'N/A',
                    status: order.orderStatus || 'N/A',
                    customerName: order.shippingInfo?.name || order.shippingInfo?.businessName || 'N/A',
                    customerEmail: order.user?.email || order.userEmail || 'N/A',
                    paymentMethod: order.paymentInfo?.type || 'N/A',
                    _rawData: order,
                    orderItems,
                    shippingInfo: order.shippingInfo || {},
                    user: order.user || {}
                };
            } catch (error) {
                console.error('Error formatting order:', error, 'Order data:', order);
                return null;
            }
        }).filter(Boolean);
    }, [orders]);

    useEffect(() => {
        console.group('OrderTable Debug Info');
        console.log('Orders count:', orders?.length || 0);
        console.log('Rows count:', rows.length);
        console.log('Pagination:', paginationInfo);
        console.log('Is searching:', isSearching);

        if (isSearching) {
            console.log('Search params:', searchParams);
            if (searchResults.length > 0) {
                console.log('First search result:', searchResults[0]);
            } else {
                console.log('No search results');
            }
        } else if (allOrders.length > 0) {
            console.log('First order in allOrders:', allOrders[0]);
        }

        if (rows.length > 0) {
            console.log('First row data:', rows[0]);
        }

        console.groupEnd();
    }, [orders, rows, paginationInfo, isSearching, searchResults, allOrders, searchParams]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchExpanded, setSearchExpanded] = useState(false);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MetaData title="Admin Orders | DhagaKart" />
            {isLoading && <BackdropLoader />}

            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
                {!onMobile && <Sidebar activeTab="orders" />}
                {toggleSidebar && <Sidebar activeTab="orders" setToggleSidebar={setToggleSidebar} />}

                <Box component="main" sx={{ flexGrow: 1, px: 1, pb: 3, width: { sm: `calc(100% - 240px)` } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        </Box>

                        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                            <CardHeader
                                title={
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Typography variant="h6" component="div">
                                            Search Orders
                                        </Typography>
                                        <IconButton
                                            onClick={() => setSearchExpanded(!searchExpanded)}
                                            size="small"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            {searchExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                    </Box>
                                }
                                sx={{
                                    bgcolor: 'background.paper',
                                    py: 1,
                                    '& .MuiCardHeader-content': {
                                        width: '100%'
                                    }
                                }}
                            />

                            <Collapse in={searchExpanded} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <form onSubmit={handleSearch}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <TextField
                                                    fullWidth
                                                    label="Order ID"
                                                    name="orderId"
                                                    value={formValues.orderId}
                                                    onChange={handleChange}
                                                    size="small"
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <SearchIcon color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <TextField
                                                    fullWidth
                                                    label="Customer Name"
                                                    name="customerName"
                                                    value={formValues.customerName}
                                                    onChange={(e) => {
                                                        const newFormValues = { ...formValues };
                                                        newFormValues.customerName = e.target.value;
                                                        setFormValues(newFormValues);
                                                    }}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <TextField
                                                    fullWidth
                                                    label="Customer Email"
                                                    name="customerEmail"
                                                    type="email"
                                                    value={formValues.customerEmail}
                                                    onChange={(e) => {
                                                        const newFormValues = { ...formValues };
                                                        newFormValues.customerEmail = e.target.value;
                                                        setFormValues(newFormValues);
                                                    }}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <FormControl fullWidth size="small" variant="outlined">
                                                    <InputLabel>Order Status</InputLabel>
                                                    <Select
                                                        value={formValues.status}
                                                        name="status"
                                                        onChange={handleChange}
                                                        label="Order Status"
                                                    >
                                                        <MenuItem value="">All Status</MenuItem>
                                                        <MenuItem value="Processing">Processing</MenuItem>
                                                        <MenuItem value="Shipped">Shipped</MenuItem>
                                                        <MenuItem value="Delivered">Delivered</MenuItem>
                                                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <TextField
                                                    fullWidth
                                                    label="Min Amount"
                                                    name="minAmount"
                                                    type="number"
                                                    value={formValues.minAmount}
                                                    onChange={handleChange}
                                                    size="small"
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                                    }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <TextField
                                                    fullWidth
                                                    label="Max Amount"
                                                    name="maxAmount"
                                                    type="number"
                                                    value={formValues.maxAmount}
                                                    onChange={handleChange}
                                                    size="small"
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                                    }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <FormControl fullWidth size="small" variant="outlined">
                                                    <InputLabel>Payment Method</InputLabel>
                                                    <Select
                                                        value={formValues.paymentMethod}
                                                        name="paymentMethod"
                                                        onChange={handleChange}
                                                        label="Payment Method"
                                                    >
                                                        <MenuItem value="">All Methods</MenuItem>
                                                        <MenuItem value="COD">Cash on Delivery</MenuItem>
                                                        <MenuItem value="Card">Credit/Debit Card</MenuItem>
                                                        <MenuItem value="UPI">UPI</MenuItem>
                                                        <MenuItem value="Netbanking">Net Banking</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <DatePicker
                                                    label="Start Date"
                                                    value={formValues.startDate}
                                                    onChange={(date) => handleDateChange('startDate', date)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            size="small"
                                                            variant="outlined"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <DatePicker
                                                    label="End Date"
                                                    value={formValues.endDate}
                                                    onChange={(date) => handleDateChange('endDate', date)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            size="small"
                                                            variant="outlined"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                                                <Button
                                                    type="button"
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<ClearIcon />}
                                                    onClick={handleClearFilters}
                                                    disabled={isLoading}
                                                >
                                                    Clear Filters
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<SearchIcon />}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? 'Searching...' : 'Search Orders'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </CardContent>
                            </Collapse>
                        </Card>

                        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', width: '100%' }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={limit}
                                paginationMode="server"
                                pagination
                                page={page - 1}
                                onPageChange={(newPage) => setPage(newPage + 1)}
                                rowCount={paginationInfo.totalOrders}
                                disableSelectionOnClick
                                disableColumnMenu={false}
                                autoHeight
                                getRowId={(row) => row._id || row.id}
                                components={{
                                    Toolbar: GridToolbar,
                                    NoRowsOverlay: () => (
                                        <Box sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            p: 3
                                        }}>
                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                No orders found
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" align="center">
                                                Try adjusting your search or filter criteria
                                            </Typography>
                                        </Box>
                                    ),
                                }}
                                sx={{
                                    border: 'none',
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: theme.palette.background.paper,
                                        borderTopLeftRadius: '8px',
                                        borderTopRightRadius: '8px',
                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                    },
                                    '& .MuiDataGrid-columnHeader': {
                                        padding: '12px 16px',
                                        '&:focus, &:focus-within': {
                                            outline: 'none',
                                        },
                                        '& .MuiDataGrid-columnHeaderTitle': {
                                            fontWeight: 600,
                                        },
                                    },
                                    '& .MuiDataGrid-cell': {
                                        padding: '12px 16px',
                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                        '&:focus, &:focus-within': {
                                            outline: 'none',
                                        },
                                    },
                                    '& .MuiDataGrid-row': {
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: theme.palette.action.selected,
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.selected,
                                            },
                                        },
                                    },
                                    '& .MuiDataGrid-footerContainer': {
                                        borderTop: `1px solid ${theme.palette.divider}`,
                                        backgroundColor: theme.palette.background.paper,
                                        borderBottomLeftRadius: '8px',
                                        borderBottomRightRadius: '8px',
                                    },
                                    '& .MuiTablePagination-root': {
                                        marginRight: '16px',
                                    },
                                    '& .MuiDataGrid-toolbarContainer': {
                                        padding: '8px 16px',
                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                        backgroundColor: theme.palette.background.paper,
                                    },
                                }}
                            />
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

function OrderTableWrapper() {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <OrderTable />
        </LocalizationProvider>
    );
}

export default OrderTableWrapper;
