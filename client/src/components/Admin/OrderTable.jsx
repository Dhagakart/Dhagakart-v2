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
  Divider,
  Collapse,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
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

    // Remove limit from state since it's now a constant
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
    const fetchOrders = useCallback(async (searchParamsToUse = null) => {
        const paramsToUse = searchParamsToUse || searchParams;
        const hasSearchParams = paramsToUse && Object.values(paramsToUse).some(param => 
            param !== '' && param !== null && param !== undefined
        );

        try {
            if (hasSearchParams && isSearching) {
                console.log('Fetching orders with search params:', paramsToUse);
                // Prepare search parameters
                const params = {
                    ...paramsToUse,
                    startDate: paramsToUse.startDate ? paramsToUse.startDate.toISOString().split('T')[0] : null,
                    endDate: paramsToUse.endDate ? paramsToUse.endDate.toISOString().split('T')[0] : null,
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
    }, [page, limit, sortBy, dispatch, enqueueSnackbar, isSearching]);

    // Track initial load
    const isInitialMount = useRef(true);
    const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

    // Initial data load and handle pagination/sorting changes
    useEffect(() => {
        // Skip the initial render to prevent duplicate calls
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        
        console.log('Fetching orders...', { page, limit, sortBy, isSearching });
        
        // Only fetch orders when:
        // 1. Not in search mode, OR
        // 2. In search mode but only when search was explicitly triggered
        if (!isSearching) {
            fetchOrders();
        }
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
    


    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); // Reset to first page on new search
        // Only set search params when search is submitted
        setSearchParams({ ...formValues });
        // Pass the form values to fetchOrders
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
        // This will trigger the effect to fetch all orders
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

                <Box component="main" sx={{ flexGrow: 1, px: 3, pb:3, width: { sm: `calc(100% - 240px)` } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {/* <Box>
                                <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    Order Management
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Manage and track customer orders
                                </Typography>
                            </Box> */}
                            <IconButton 
                                onClick={() => setToggleSidebar(true)} 
                                sx={{ display: { sm: 'none' }, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>

                        {/* Search Card */}
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

                        {/* Data Grid */}
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
                                // loading={isLoading}
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
                                            {/* <SearchIcon sx={{ 
                                                fontSize: 48, 
                                                color: 'text.disabled', 
                                                mb: 2 
                                            }} /> */}
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