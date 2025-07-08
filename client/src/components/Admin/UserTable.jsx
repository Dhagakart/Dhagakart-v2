import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { FiUsers, FiSearch, FiPlus } from 'react-icons/fi';
import { clearErrors, deleteUser, getAllUsers } from '../../actions/userAction';
import { DELETE_USER_RESET } from '../../constants/userConstants';
import Actions from './Actions';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';

const UserTable = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { users, error } = useSelector((state) => state.users);
    const { loading, isDeleted, error: deleteError } = useSelector((state) => state.profile);

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
            enqueueSnackbar("User Deleted Successfully", { variant: "success" });
            dispatch({ type: DELETE_USER_RESET });
        }
        dispatch(getAllUsers());
    }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    }

    const columns = [
        {
            field: "name",
            headerName: "User Details",
            minWidth: 250,
            flex: 1,
            renderCell: (params) => {
                return (
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
                                {params.row.avatar ? (
                                    <img 
                                        src={params.row.avatar} 
                                        alt={params.row.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full w-full text-blue-600 font-medium">
                                        {params.row.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                )}
                            </div>
                            {params.row.status === 'active' && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-ping"></div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{params.row.name}</span>
                                {params.row.role === 'admin' && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Admin
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>{params.row.email}</span>
                                <span className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full text-xs">
                                    {params.row.gender || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            },
        },
        {
            field: "email",
            headerName: "Email",
            minWidth: 200,
            flex: 0.2,
        },
        {
            field: "gender",
            headerName: "Gender",
            minWidth: 100,
            flex: 0.1,
        },
        {
            field: "role",
            headerName: "Role",
            minWidth: 100,
            flex: 0.2,
            renderCell: (params) => {
                const isAdmin = params.row.role === "admin";
                return (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        isAdmin 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                        {isAdmin && (
                            <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                        {params.row.role.charAt(0).toUpperCase() + params.row.role.slice(1)}
                    </span>
                );
            },
        },
        {
            field: "registeredOn",
            headerName: "Registered On",
            type: "date",
            minWidth: 150,
            flex: 0.2,
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 200,
            flex: 0.3,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Actions editRoute={"user"} deleteHandler={deleteUserHandler} id={params.row.id} name={params.row.name} />
                );
            },
        },
    ];

    const rows = [];

    users && users.forEach((item) => {
        rows.unshift({
            id: item._id,
            name: item.name || "Unknown",
            // avatar: item.avatar.url || "",
            email: item.email || "Unknown",
            role: item.role || "Unknown",
            registeredOn: new Date(item.createdAt).toISOString().substring(0, 10),
        });
    });

    const [searchTerm, setSearchTerm] = useState('');

    const filteredRows = rows.filter(row => 
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <MetaData title="Admin Users | DhagaKart" />
            {loading && <BackdropLoader />}

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-lg:mt-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                            <FiUsers className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Users</h1>
                            <p className="text-sm text-gray-500">Manage all registered users</p>
                        </div>
                    </div>
                    
                    <div className="relative max-w-md w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Users</p>
                                <p className="text-2xl font-semibold text-gray-900">{rows.length}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                                <FiUsers className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Admins</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {rows.filter(user => user.role === 'admin').length}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-green-50 text-green-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">New This Month</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {rows.filter(user => {
                                        const userDate = new Date(user.registeredOn);
                                        const currentDate = new Date();
                                        return userDate.getMonth() === currentDate.getMonth() && 
                                               userDate.getFullYear() === currentDate.getFullYear();
                                    }).length}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-medium text-gray-700">User List</h2>
                        <button className="flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition duration-150">
                            <FiPlus className="w-4 h-4" />
                            <span>Add User</span>
                        </button>
                    </div>
                    <div style={{ height: 500 }} className="w-full">
                        <DataGrid
                            rows={filteredRows}
                            columns={columns}
                            pageSize={7}
                            rowsPerPageOptions={[7, 15, 25]}
                            disableSelectionOnClick
                            disableColumnMenu
                            sx={{
                                border: 0,
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: '#f9fafb',
                                    borderBottom: '1px solid #e5e7eb',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                },
                                '& .MuiDataGrid-cell': {
                                    borderBottom: '1px solid #f3f4f6',
                                },
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: '#f9fafb',
                                },
                                '& .MuiTablePagination-root': {
                                    marginRight: '16px',
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserTable;