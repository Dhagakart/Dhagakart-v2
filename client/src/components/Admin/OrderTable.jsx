import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { 
    clearErrors, 
    deleteOrder, 
    getAllOrders,
    searchOrders as searchOrdersAction 
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

    const { orders, totalOrders, totalPages, currentPage, error } = useSelector((state) => state.allOrders);
    const { loading, isDeleted, error: deleteError } = useSelector((state) => state.order);

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
        if (deleteError) {
            enqueueSnackbar(deleteError, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isDeleted) {
            enqueueSnackbar("Deleted Successfully", { variant: "success" });
            dispatch({ type: DELETE_ORDER_RESET });
            fetchOrders();
        }
    }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

    useEffect(() => {
        fetchOrders();
    }, [page, limit, sortBy]);

    const fetchOrders = () => {
        const hasSearchParams = Object.values(searchParams).some(param => 
            param !== '' && param !== null && param !== undefined
        );

        if (hasSearchParams) {
            const params = {
                ...searchParams,
                startDate: searchParams.startDate ? searchParams.startDate.toISOString().split('T')[0] : '',
                endDate: searchParams.endDate ? searchParams.endDate.toISOString().split('T')[0] : '',
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
            dispatch(searchOrdersAction(params));
        } else {
            dispatch(getAllOrders({ page, limit, sortBy }));
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); // Reset to first page on new search
        fetchOrders();
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

    const rows = orders?.map((order) => ({
        id: order._id,
        itemsQty: order.orderItems?.length || 0,
        amount: order.totalPrice || 0,
        orderOn: formatDate(order.createdAt),
        status: order.orderStatus,
        customerName: order.shippingInfo?.businessName || 'N/A',
        customerEmail: order.user?.email || 'N/A',
        paymentMethod: order.paymentInfo?.type || 'N/A'
    })) || [];

    return (
        <>
            <MetaData title="Admin Orders | DhagaKart" />

            {loading && <BackdropLoader />}

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
                                pageSize={limit}
                                page={page - 1}
                                onPageChange={(newPage) => setPage(newPage + 1)}
                                onPageSizeChange={(newPageSize) => setLimit(newPageSize)}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                rowCount={totalOrders || 0}
                                paginationMode="server"
                                disableSelectionOnClick
                                disableColumnMenu
                                autoHeight
                                loading={loading}
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
                                    '& .MuiDataGrid-cell': {
                                        borderBottom: '1px solid #f3f4f6',
                                    },
                                    '& .MuiDataGrid-row:hover': {
                                        backgroundColor: '#f9fafb',
                                    },
                                    '& .MuiDataGrid-footerContainer': {
                                        borderTop: '1px solid #e5e7eb',
                                    },
                                    '& .MuiDataGrid-columnHeader': {
                                        padding: '12px 16px',
                                    },
                                    '& .MuiDataGrid-cell': {
                                        padding: '12px 16px',
                                    },
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