import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { clearErrors, deleteProduct, getAdminProducts } from '../../actions/productAction';
import Rating from '@mui/material/Rating';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';
import Actions from './Actions';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
import Dashboard from './Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar/Sidebar';

const ProductTable = () => {
    const [onMobile, setOnMobile] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);

    useEffect(() => {
        if (window.innerWidth < 600) {
            setOnMobile(true);
        }
    }, [])

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { products, error } = useSelector((state) => state.products);
    const { loading, isDeleted, error: deleteError } = useSelector((state) => state.product);

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
            enqueueSnackbar("Product Deleted Successfully", { variant: "success" });
            dispatch({ type: DELETE_PRODUCT_RESET });
        }
        dispatch(getAdminProducts());
    }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
    }

    const columns = [
        {
            field: "id",
            headerName: "Product ID",
            minWidth: 100,
            flex: 0.5,
        },
        {
            field: "name",
            headerName: "Product",
            minWidth: 250,
            flex: 1.5,
            renderCell: (params) => {
                return (
                    <div className="flex items-center gap-3 w-full">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                            <img 
                                draggable="false" 
                                src={params.row.image} 
                                alt={params.row.name} 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/50';
                                }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-normal text-gray-900 truncate">{params.row.name}</p>
                            <p className="text-xs text-gray-500">{params.row.category}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            field: "category",
            headerName: "Category",
            minWidth: 120,
            flex: 0.3,
            renderCell: (params) => (
                <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {params.row.category}
                </span>
            ),
        },
        {
            field: "stock",
            headerName: "Stock",
            type: "number",
            headerAlign: "left",
            align: "left",
            minWidth: 70,
            flex: 0.1,
            renderCell: (params) => {
                return (
                    <>
                        {
                            params.row.stock < 10 ? (
                                <span className="font-medium text-red-700 rounded-full bg-red-200 p-1 w-6 h-6 flex items-center justify-center">{params.row.stock}</span>
                            ) : (
                                <span className="">{params.row.stock}</span>
                            )
                        }
                    </>
                )
            },
        },
        {
            field: "price",
            headerName: "Price",
            type: "number",
            minWidth: 100,
            headerAlign: "left",
            align: "left",
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <span>₹{params.row.price.toLocaleString()}</span>
                );
            },
        },
        {
            field: "cprice",
            headerName: "Cutted Price",
            type: "number",
            minWidth: 100,
            headerAlign: "left",
            align: "left",
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <span>₹{params.row.cprice.toLocaleString()}</span>
                );
            },
        },
        {
            field: "rating",
            headerName: "Rating",
            type: "number",
            minWidth: 100,
            flex: 0.1,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => {
                return <Rating readOnly value={params.row.rating} size="small" precision={0.5} />
            }
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
                    <Actions editRoute={"product"} deleteHandler={deleteProductHandler} id={params.row.id} />
                );
            },
        },
    ];

    const rows = [];

    products && products.forEach((item) => {
        rows.unshift({
            id: item._id,
            name: item.name,
            image: item.images[0].url,
            category: item.category,
            stock: item.stock,
            price: item.price,
            cprice: item.cuttedPrice,
            rating: item.ratings,
        });
    });

    return (
        <>
            <MetaData title="Admin Products | DhagaKart" />

            {loading && <BackdropLoader />}

            <main className="flex h-auto bg-gray-50">
                {!onMobile && <Sidebar activeTab="products" />}
                {toggleSidebar && <Sidebar activeTab="products" setToggleSidebar={setToggleSidebar} />}

                <div className="w-full h-auto">
                    <div className="flex flex-col gap-6 sm:p-8 p-4">
                        <div className="flex items-center justify-between">
                            <button 
                                onClick={() => setToggleSidebar(true)} 
                                className="sm:hidden bg-gray-700 w-10 h-10 rounded-full shadow text-white flex items-center justify-center hover:bg-gray-600 transition-colors"
                            >
                                <MenuIcon />
                            </button>
                            {/* <h1 className="text-2xl font-bold text-gray-900">Products</h1> */}
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                {/* <h2 className="text-lg font-semibold text-gray-700">Products</h2> */}
                                <span className="text-sm text-gray-500 bg-gray-100 px-2.5 rounded-full">
                                    {rows.length} {rows.length === 1 ? 'item' : 'items'}
                                </span>
                            </div>
                            <Link 
                                to="/admin/new_product" 
                                className="py-2.5 px-4 rounded-lg font-medium text-white bg-[#003366] hover:bg-[#003366]/90 transition-colors flex items-center gap-2"
                            >
                                <span>+</span> Add New Product
                            </Link>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={10}
                                rowsPerPageOptions={[10, 25, 50]}
                                disableSelectionOnClick
                                autoHeight
                                sx={{
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: '#f9fafb',
                                        borderBottom: '1px solid #e5e7eb',
                                    },
                                    '& .MuiDataGrid-cell': {
                                        borderBottom: '1px solid #f3f4f6',
                                    },
                                    '& .MuiDataGrid-row': {
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                        },
                                    },
                                    '& .MuiDataGrid-footerContainer': {
                                        borderTop: '1px solid #e5e7eb',
                                        backgroundColor: '#f9fafb',
                                    },
                                    '& .MuiDataGrid-virtualScroller': {
                                        minHeight: '300px'
                                    },
                                    border: 0,
                                    borderRadius: '12px',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ProductTable;