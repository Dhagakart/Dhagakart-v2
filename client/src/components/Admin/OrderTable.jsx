import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { clearErrors, deleteOrder, getAllOrders } from '../../actions/orderAction';
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

    const { orders, error } = useSelector((state) => state.allOrders);
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
        }
        dispatch(getAllOrders());
    }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

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

    const rows = [];

    orders && orders.forEach((order) => {
        rows.unshift({
            id: order._id,
            itemsQty: order.orderItems.length,
            amount: order.totalPrice,
            orderOn: formatDate(order.createdAt),
            status: order.orderStatus,
        });
    });

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
                        <h1 className="text-lg font-medium uppercase">orders</h1>
                        <div className="bg-white rounded-lg shadow w-full p-4">
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={10}
                                disableSelectIconOnClick
                                autoHeight
                                disableColumnMenu
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

export default OrderTable;
