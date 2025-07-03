import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { 
    clearErrors, 
    deleteOrder, 
    getAllOrders, 
    searchOrders, 
} from '../../actions/orderAction';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';
import Actions from './Actions';
import { formatDate } from '../../utils/functions';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
import Sidebar from './Sidebar/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';
import { TextField, Button, Grid, InputAdornment, FormControl, InputLabel, Select, MenuItem, Box, IconButton, Paper } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const OrderTable = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [onMobile, setOnMobile] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchParams, setSearchParams] = useState({
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
    const [sortBy, setSortBy] = useState('-createdAt');

    // Get orders from Redux state with default values
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
    
    // Get order operation states
    const { 
        loading: isDeleting = false, 
        isDeleted = false,
        error: deleteError = null
    } = useSelector((state) => state.order || {});
    
    // Check if we're currently searching (any search parameter has a value)
    const isSearching = useMemo(() => 
        Object.values(searchParams).some(param => 
            param !== '' && param !== null && param !== undefined
        ),
        [searchParams]
    );
    
    // Get orders from the appropriate state slice
    const orders = isSearching ? searchResults : allOrders;
    
    // Log state for debugging
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
    
    // Get pagination info based on whether we're searching or not
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

    // Define fetchOrders with useCallback to prevent recreation on every render
    const fetchOrders = useCallback(async () => {
        const hasSearchParams = Object.values(searchParams).some(param => 
            param !== '' && param !== null && param !== undefined
        );

        try {
            if (hasSearchParams) {
                console.log('Fetching orders with search params:', searchParams);
                // Prepare search parameters
                const params = {
                    ...searchParams,
                    startDate: searchParams.startDate ? searchParams.startDate.toISOString().split('T')[0] : null,
                    endDate: searchParams.endDate ? searchParams.endDate.toISOString().split('T')[0] : null,
                    page,
                    limit,
                    sortBy
                };
                
                // Remove empty params
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
    }, [searchParams, page, limit, sortBy, dispatch, enqueueSnackbar]);

    // Track initial load
    const isInitialMount = useRef(true);

    // Handle all data fetching in a single effect
    useEffect(() => {
        // Skip the initial render to prevent duplicate calls
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        
        console.log('Fetching orders...', { page, limit, sortBy, isSearching });
        fetchOrders();
    }, [page, limit, sortBy, isSearching, fetchOrders]);
    
    // Handle delete order success/error
    useEffect(() => {
        if (deleteError) {
            enqueueSnackbar(deleteError, { variant: 'error' });
            dispatch(clearErrors());
        }
        
        if (isDeleted) {
            enqueueSnackbar('Order deleted successfully', { variant: 'success' });
            dispatch({ type: 'DELETE_ORDER_RESET' });
            // Refresh the orders list after deletion
            fetchOrders();
        }
    }, [dispatch, deleteError, isDeleted, enqueueSnackbar, fetchOrders]);
    
    // Initial data load
    useEffect(() => {
        console.log('Initial load, fetching orders...');
        fetchOrders();
        
        // Cleanup function
        return () => {
            isInitialMount.current = true;
        };
    }, [fetchOrders]); // Add fetchOrders to dependency array
    
    // Reset to first page when search params change
    useEffect(() => {
        if (!isInitialMount.current) {
            setPage(1);
        }
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); // Reset to first page on new search
        // fetchOrders will be called automatically by the main effect
    };

    const handleClearFilters = () => {
        setSearchParams({
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
        setPage(1);
        setSortBy('-createdAt');
        dispatch(getAllOrders({ page: 1, limit, sortBy: '-createdAt' }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (name, date) => {
        setSearchParams(prev => ({
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
            headerName: "Items Qty",
            type: "number",
            minWidth: 100,
            flex: 0.1,
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

// Format orders for the DataGrid
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
            return {
                id: order._id || order.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
                itemsQty: Array.isArray(order.orderItems) ? order.orderItems.length : 0,
                amount: order.totalPrice || 0,
                orderOn: order.createdAt ? formatDate(order.createdAt) : 'N/A',
                status: order.orderStatus || 'N/A',
                customerName: order.shippingInfo?.name || order.shippingInfo?.businessName || 'N/A',
                customerEmail: order.user?.email || order.userEmail || 'N/A',
                paymentMethod: order.paymentInfo?.type || 'N/A',
                // Include raw data for potential use in custom renderers
                _rawData: order,
                // Include additional fields that might be needed
                orderItems: order.orderItems || [],
                shippingInfo: order.shippingInfo || {},
                user: order.user || {}
            };
        } catch (error) {
            console.error('Error formatting order:', error, 'Order data:', order);
            return null;
        }
    }).filter(Boolean); // Filter out any null entries
}, [orders]);

// Debug effect to log important state changes
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

    return (
        <>
            <MetaData title="Admin Orders | DhagaKart" />

            {isLoading && <BackdropLoader />}

            <main className="flex min-h-screen">
                {!onMobile && <Sidebar activeTab="orders" />}
                {toggleSidebar && <Sidebar activeTab="orders" setToggleSidebar={setToggleSidebar} />}

                <div className="w-full min-h-screen">
                    <div className="flex flex-col gap-2 sm:p-4">
                        <button onClick={() => setToggleSidebar(true)} className="sm:hidden bg-gray-700 w-10 h-10 rounded-full shadow text-white flex items-center justify-center">
                            <MenuIcon />
                        </button>
                        <div className="flex flex-col gap-4 mb-4">
                            <h1 className="text-xl font-semibold text-gray-800">Order Management</h1>
                            <Paper elevation={0} className="p-4 border rounded-lg">
                                <form onSubmit={handleSearch}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <TextField
                                                fullWidth
                                                label="Order ID"
                                                name="orderId"
                                                value={searchParams.orderId}
                                                onChange={handleChange}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <TextField
                                                fullWidth
                                                label="Customer Name"
                                                name="customerName"
                                                value={searchParams.customerName}
                                                onChange={handleChange}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <TextField
                                                fullWidth
                                                label="Customer Email"
                                                name="customerEmail"
                                                value={searchParams.customerEmail}
                                                onChange={handleChange}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    value={searchParams.status}
                                                    name="status"
                                                    onChange={handleChange}
                                                    label="Status"
                                                >
                                                    <MenuItem value="">All</MenuItem>
                                                    <MenuItem value="Processing">Processing</MenuItem>
                                                    <MenuItem value="Shipped">Shipped</MenuItem>
                                                    <MenuItem value="Delivered">Delivered</MenuItem>
                                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <TextField
                                                fullWidth
                                                label="Min Amount"
                                                name="minAmount"
                                                type="number"
                                                value={searchParams.minAmount}
                                                onChange={handleChange}
                                                size="small"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <TextField
                                                fullWidth
                                                label="Max Amount"
                                                name="maxAmount"
                                                type="number"
                                                value={searchParams.maxAmount}
                                                onChange={handleChange}
                                                size="small"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="Start Date"
                                                    value={searchParams.startDate}
                                                    onChange={(date) => handleDateChange('startDate', date)}
                                                    renderInput={(params) => (
                                                        <TextField {...params} fullWidth size="small" />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="End Date"
                                                    value={searchParams.endDate}
                                                    onChange={(date) => handleDateChange('endDate', date)}
                                                    renderInput={(params) => (
                                                        <TextField {...params} fullWidth size="small" />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={12} className="flex gap-2 justify-end">
                                            <Button
                                                type="button"
                                                variant="outlined"
                                                color="error"
                                                startIcon={<ClearIcon />}
                                                onClick={handleClearFilters}
                                            >
                                                Clear
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                startIcon={<SearchIcon />}
                                            >
                                                Search
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Paper>
                        </div>
                        <div className="bg-white rounded-lg shadow w-full">
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                rowCount={paginationInfo.totalOrders}
                                pageSize={paginationInfo.limit}
                                page={paginationInfo.currentPage - 1}
                                onPageChange={(newPage) => {
                                    console.log('Page changed to:', newPage + 1);
                                    setPage(newPage + 1);
                                    window.scrollTo(0, 0);
                                }}
                                onPageSizeChange={(newPageSize) => {
                                    console.log('Page size changed to:', newPageSize);
                                    setLimit(newPageSize);
                                    setPage(1); // Reset to first page when page size changes
                                }}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                paginationMode="server"
                                pagination
                                disableSelectionOnClick
                                disableColumnMenu
                                autoHeight
                                loading={isLoading}
                                getRowId={(row) => row._id || row.id}
                                components={{
                                    NoRowsOverlay: () => (
                                        <div className="flex items-center justify-center h-full">
                                            <p>No orders found</p>
                                        </div>
                                    ),
                                    LoadingOverlay: () => (
                                        <div className="flex items-center justify-center h-full">
                                            <p>Loading orders...</p>
                                        </div>
                                    )
                                }}
                                sx={{
                                    '& .MuiDataGrid-main': {
                                        width: '100%',
                                    },
                                    '& .MuiDataGrid-virtualScroller': {
                                        minHeight: '400px',
                                    },
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: '#f9fafb',
                                        borderTopLeftRadius: '8px',
                                        borderTopRightRadius: '8px',
                                    },
                                    '& .MuiDataGrid-footerContainer': {
                                        borderTop: '1px solid #e5e7eb',
                                    },
                                    '& .MuiDataGrid-columnHeader': {
                                        padding: '12px 16px',
                                    },
                                    '& .MuiDataGrid-cell': {
                                        padding: '12px 16px',
                                        borderBottom: '1px solid #f3f4f6',
                                    },
                                    '& .MuiDataGrid-row:hover': {
                                        backgroundColor: '#f9fafb',
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </>
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