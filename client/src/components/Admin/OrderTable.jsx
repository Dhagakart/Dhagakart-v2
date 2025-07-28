import { useEffect, useState, useMemo, useCallback } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
    Box,
    Paper,
    IconButton,
    Typography,
    Card,
    useTheme,
    useMediaQuery,
    Avatar,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    InputAdornment,
    Grid,
    CardHeader,
    CardContent,
    Collapse
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ClearIcon from '@mui/icons-material/Clear';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
    clearErrors,
    deleteOrder,
    getAllOrders,
    searchOrders, // Re-added for search functionality
} from '../../actions/orderAction';
import { DELETE_ORDER_RESET, NEW_ORDER_RECEIVED } from '../../constants/orderConstants';
import Actions from './Actions';
import { formatDate } from '../../utils/functions';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
import Sidebar from './Sidebar/Sidebar';

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

// --- START: Notification Toast Component ---
const NotificationToast = ({ t, order, onClose }) => {
    return (
        <Card elevation={4} sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 2, borderRadius: '12px' }}>
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
            <IconButton size="small" onClick={() => onClose(t.id)} sx={{ color: 'text.secondary' }}>
                <ClearIcon fontSize="small" />
            </IconButton>
        </Card>
    );
};
// --- END: Notification Toast Component ---


const OrderTable = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [onMobile, setOnMobile] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 10; // Constant page size
    
    // --- START: State for Search Functionality ---
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
    const [searchExpanded, setSearchExpanded] = useState(false);
    // --- END: State for Search Functionality ---
    
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

    // --- START: Selector for Search Results ---
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
    // --- END: Selector for Search Results ---

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
        if (audioElement) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            audioElement = new Audio(notificationSound);
            audioElement.loop = true;
            audioSource = audioContext.createMediaElementSource(audioElement);
            audioSource.connect(audioContext.destination);
            await audioContext.resume();
            await audioElement.play();
        } catch (error) {
            console.error("Audio initialization failed:", error);
            toast('🔔 Click anywhere to enable sound notifications', { duration: 3000, position: 'bottom-right' });
        }
    };
    
    const stopNotificationSound = () => {
        if (audioElement) {
            try {
                audioElement.pause();
                audioElement.currentTime = 0;
                if (audioSource) audioSource.disconnect();
                if (audioContext && audioContext.state !== 'closed') audioContext.close();
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
        if (activeNotifications.size === 0) stopNotificationSound();
        toast.dismiss(id);
    };

    useEffect(() => {
        const BACKEND_URL = 'https://dhagakart.onrender.com';
        const socket = io(BACKEND_URL);
        socket.on("connect", () => console.log("Socket.io connection established."));
        socket.on("newOrder", (order) => {
            const notificationId = `order-${Date.now()}`;
            activeNotifications.add(notificationId);
            if (activeNotifications.size === 1) startNotificationSound();
            toast.custom(
                (t) => <NotificationToast t={t} order={order} onClose={handleNotificationClose} />,
                { id: notificationId, duration: Infinity, style: { background: 'transparent', padding: 0, margin: '8px 0', boxShadow: 'none' } }
            );
            dispatch({ type: NEW_ORDER_RECEIVED, payload: order });
        });
        socket.on("disconnect", () => console.log("Socket.io connection disconnected."));
        return () => socket.disconnect();
    }, [dispatch]);

    const paginationInfo = useMemo(() => ({
        currentPage: isSearching ? (searchPagination.currentPage || 1) : (allCurrentPage || 1),
        totalPages: isSearching ? (searchPagination.totalPages || 1) : (allTotalPages || 1),
        totalOrders: isSearching ? (searchPagination.totalOrders || 0) : (allTotalOrders || 0),
        limit: isSearching ? (searchPagination.limit || 10) : (allLimit || 10)
    }), [isSearching, searchPagination, allCurrentPage, allTotalPages, allTotalOrders, allLimit]);

    const isLoading = allOrdersLoading || searchLoading || isDeleting;
    const error = searchError || allOrdersError;

    useEffect(() => {
        if (window.innerWidth < 600) setOnMobile(true);
    }, []);

    const fetchOrders = useCallback(async (searchParamsToUse = null) => {
        const paramsToUse = searchParamsToUse || searchParams;
        const hasSearchParams = Object.values(paramsToUse).some(p => p !== '' && p !== null);

        try {
            if (hasSearchParams) {
                const params = {
                    ...paramsToUse,
                    startDate: paramsToUse.startDate ? paramsToUse.startDate.toISOString().split('T')[0] : null,
                    endDate: paramsToUse.endDate ? paramsToUse.endDate.toISOString().split('T')[0] : null,
                    page, limit, sortBy
                };

                // FIX: Rename frontend field names to match backend API query parameters
                if (params.customerName) {
                    params.name = params.customerName;
                    delete params.customerName;
                }
                if (params.customerEmail) {
                    params.email = params.customerEmail;
                    delete params.customerEmail;
                }

                Object.keys(params).forEach(key => (params[key] === '' || params[key] === null) && delete params[key]);
                await dispatch(searchOrders(params));
            } else {
                await dispatch(getAllOrders({ page, limit, sortBy }));
            }
        } catch (err) {
            enqueueSnackbar(err.message || 'An error occurred', { variant: 'error' });
        }
    }, [page, limit, sortBy, dispatch, enqueueSnackbar, searchParams]);
    
    useEffect(() => {
        fetchOrders();
    }, [page, sortBy, fetchOrders]);

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

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
    }

    // --- START: Handlers for Search Functionality ---
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearchParams({ ...formValues });
        fetchOrders(formValues);
    };

    const handleClearFilters = () => {
        const emptyForm = {
            orderId: '', customerName: '', customerEmail: '', productName: '',
            minAmount: '', maxAmount: '', status: '', startDate: null,
            endDate: null, paymentMethod: ''
        };
        setFormValues(emptyForm);
        setSearchParams({});
        setPage(1);
        setSortBy('-createdAt');
        // After clearing, fetch all orders again
        dispatch(getAllOrders({ page: 1, limit, sortBy: '-createdAt' }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, date) => {
        setFormValues(prev => ({ ...prev, [name]: date }));
    };
    // --- END: Handlers for Search Functionality ---

    const theme = useTheme();

    const columns = [
        {
            field: "id",
            headerName: "Order Details",
            minWidth: 250,
            flex: 1,
            renderCell: ({ row }) => {
                if (row.isHeader) {
                    return (
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: theme.palette.text.primary }}>
                            {row.displayDate}
                        </Typography>
                    );
                }
                return row.id;
            }
        },
        {
            field: "time",
            headerName: "Time",
            minWidth: 120,
            flex: 0.2,
            renderCell: ({ row }) => {
                if (row.isHeader) return null;
                return <span>{row.time}</span>;
            }
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.3,
            renderCell: ({ row }) => !row.isHeader && (
                row.status === "Delivered" ? (
                    <span className="text-sm bg-green-100 p-1 px-2 font-medium rounded-full text-green-800">{row.status}</span>
                ) : row.status === "Shipped" ? (
                    <span className="text-sm bg-yellow-100 p-1 px-2 font-medium rounded-full text-yellow-800">{row.status}</span>
                ) : (
                    <span className="text-sm bg-purple-100 p-1 px-2 font-medium rounded-full text-purple-800">{row.status}</span>
                )
            ),
        },
        {
            field: "itemsQty",
            headerName: "Qty & Units",
            minWidth: 120,
            flex: 0.25,
            renderCell: ({ row }) => !row.isHeader && (
                <div className="w-full">
                    {(row.orderItems || []).map((item, idx) => {
                        const unitName = item.unit?.name || 'unit';
                        const quantity = item.quantity || 0;
                        const itemText = `${quantity} ${unitName}${quantity !== 1 ? 's' : ''}`;
                        return <div key={idx} className="text-sm whitespace-nowrap" title={itemText}>{itemText}</div>;
                    })}
                </div>
            ),
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 150,
            flex: 0.2,
            renderCell: ({ row }) => !row.isHeader && <span>₹{row.amount.toLocaleString()}</span>,
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 100,
            flex: 0.2,
            sortable: false,
            renderCell: ({ row }) => !row.isHeader && <Actions editRoute={"order"} deleteHandler={deleteOrderHandler} id={row.id} />,
        },
    ];

    const rows = useMemo(() => {
        if (!Array.isArray(orders)) return [];
        
        const grouped = orders.reduce((acc, order) => {
            const date = new Date(order.createdAt).toDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(order);
            return acc;
        }, {});

        const newRows = [];
        for (const date in grouped) {
            newRows.push({
                id: `header-${date}`,
                isHeader: true,
                displayDate: date,
            });
            grouped[date].forEach(order => {
                newRows.push({
                    id: order._id,
                    isHeader: false,
                    status: order.orderStatus || 'N/A',
                    amount: order.totalPrice || 0,
                    time: new Date(order.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    }),
                    orderItems: (order.orderItems || []).map(item => ({
                        ...item,
                        unit: item.unit || { name: 'unit' }
                    })),
                });
            });
        }
        return newRows;
    }, [orders]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MetaData title="Admin Orders | DhagaKart" />
            {isLoading && <BackdropLoader />}

            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
                {!onMobile && <Sidebar activeTab="orders" />}
                {toggleSidebar && <Sidebar activeTab="orders" setToggleSidebar={setToggleSidebar} />}

                <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, width: { sm: `calc(100% - 240px)` } }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                        All Orders
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Manage and track all customer orders from this central dashboard.
                    </Typography>

                    {/* --- START: Search UI --- */}
                    <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
                        <CardHeader
                            title={
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography variant="h6" component="div">Search Filters</Typography>
                                    <IconButton onClick={() => setSearchExpanded(!searchExpanded)} size="small">
                                        {searchExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                </Box>
                            }
                            sx={{ py: 1, '& .MuiCardHeader-content': { width: '100%' } }}
                        />
                        <Collapse in={searchExpanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <form onSubmit={handleSearch}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField fullWidth label="Order ID" name="orderId" value={formValues.orderId} onChange={handleChange} size="small" />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField fullWidth label="Customer Name" name="customerName" value={formValues.customerName} onChange={handleChange} size="small" />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField fullWidth label="Customer Email" name="customerEmail" type="email" value={formValues.customerEmail} onChange={handleChange} size="small" />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Order Status</InputLabel>
                                                <Select value={formValues.status} name="status" onChange={handleChange} label="Order Status">
                                                    <MenuItem value="">All</MenuItem>
                                                    <MenuItem value="Processing">Processing</MenuItem>
                                                    <MenuItem value="Shipped">Shipped</MenuItem>
                                                    <MenuItem value="Delivered">Delivered</MenuItem>
                                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <DatePicker label="Start Date" value={formValues.startDate} onChange={(date) => handleDateChange('startDate', date)} renderInput={(params) => <TextField {...params} fullWidth size="small" />} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <DatePicker label="End Date" value={formValues.endDate} onChange={(date) => handleDateChange('endDate', date)} renderInput={(params) => <TextField {...params} fullWidth size="small" />} />
                                        </Grid>
                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                                            <Button variant="outlined" color="error" startIcon={<ClearIcon />} onClick={handleClearFilters} disabled={isLoading}>Clear</Button>
                                            <Button type="submit" variant="contained" startIcon={<SearchIcon />} disabled={isLoading}>
                                                {isLoading ? 'Searching...' : 'Search'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </CardContent>
                        </Collapse>
                    </Card>
                    {/* --- END: Search UI --- */}
                    
                    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', width: '100%' }}>
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
                            getRowId={(row) => row.id}
                            getRowClassName={({ row }) => row.isHeader ? 'date-header-row' : ''}
                            components={{
                                Toolbar: GridToolbar,
                                NoRowsOverlay: () => (
                                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
                                        <Typography variant="h6" color="text.secondary" gutterBottom>No orders found</Typography>
                                        <Typography variant="body2" color="text.secondary" align="center">There are currently no orders to display.</Typography>
                                    </Box>
                                ),
                            }}
                            sx={{
                                border: 'none',
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: 'grey.100',
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                },
                                '& .MuiDataGrid-columnHeader': {
                                    padding: '12px 16px',
                                    '&:focus, &:focus-within': { outline: 'none' },
                                    '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600, color: 'text.secondary' },
                                },
                                '& .MuiDataGrid-cell': {
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    '&:focus, &:focus-within': { outline: 'none' },
                                },
                                '& .MuiDataGrid-row:not(.date-header-row)': {
                                    '&:hover': { backgroundColor: theme.palette.action.hover },
                                },
                                '& .date-header-row': {
                                    backgroundColor: theme.palette.grey[200],
                                    '& .MuiDataGrid-cell': {
                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                    },
                                    '&:hover': {
                                        backgroundColor: theme.palette.grey[300],
                                    }
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    borderTop: `1px solid ${theme.palette.divider}`,
                                    backgroundColor: 'grey.100',
                                },
                                '& .MuiDataGrid-toolbarContainer': {
                                    padding: '8px 16px',
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                },
                            }}
                        />
                    </Paper>
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
