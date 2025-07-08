import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import { FaEye, FaFileAlt, FaTimes } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';
import { useSnackbar } from 'notistack';

import MetaData from '../Layouts/MetaData';
import Sidebar from './Sidebar/Sidebar';
import {
  getAllQuotes,
  getQuoteDetails,
  clearQuoteErrors,
} from '../../actions/quoteActions';

// Helper Functions
export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return { color: 'warning', label: 'Pending' };
    case 'processing':
      return { color: 'info', label: 'Processing' };
    case 'completed':
      return { color: 'success', label: 'Completed' };
    case 'rejected':
      return { color: 'error', label: 'Rejected' };
    default:
      return { color: 'default', label: 'Unknown' };
  }
};

// Modal Component
const QuoteDialog = ({ open, onClose, quote }) => {
  const status = getStatusColor(quote?.status);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Quote Details</Typography>
          <IconButton onClick={onClose}>
            <FaTimes />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {quote ? (
          <Box display="flex" flexDirection="column" gap={3}>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
              <Info label="Quote ID" value={quote._id} />
              <Info
                label="Status"
                value={<Chip label={status.label} color={status.color} size="small" />}
              />
              <Info label="Created At" value={formatDate(quote.createdAt)} />
              <Info
                label="User"
                value={
                  <>
                    {quote.user?.name || 'Guest'}
                    <Typography variant="body2" color="text.secondary">
                      {quote.user?.email}
                    </Typography>
                  </>
                }
              />
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Products
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {quote.products?.map((product, i) => (
                  <Paper key={i} variant="outlined" sx={{ p: 1.5 }}>
                    <Typography>{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {product.quantity}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>

            {quote.comments && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Comments
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                  {quote.comments}
                </Typography>
              </Box>
            )}

            {quote.file && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Attachments
                </Typography>
                <Button
                  href={quote.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<FaFileAlt />}
                  sx={{ textTransform: 'none' }}
                >
                  {quote.fileName || 'View Attachment'}
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Reusable label-value block
const Info = ({ label, value }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography>{value || 'N/A'}</Typography>
  </Box>
);

// Main Component
const Quotes = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { quotes = [], loading, error } = useSelector((state) => state.quoteList);
  const { quote } = useSelector((state) => state.quoteDetails);

  const [onMobile, setOnMobile] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 600;
      setOnMobile(isMobile);
      if (!isMobile) {
        setToggleSidebar(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearQuoteErrors());
    }
    dispatch(getAllQuotes());
  }, [dispatch, error]);

  const handleViewQuote = (id) => {
    setSelectedQuoteId(id);
    dispatch(getQuoteDetails(id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedQuoteId(null);
  };

  const rows = quotes.map((q) => ({
    id: q._id,
    user: q.user,
    products: q.products,
    status: q.status,
    createdAt: q.createdAt,
  }));

  const columns = [
    { field: 'id', headerName: 'Quote ID', flex: 1, minWidth: 180 },
    {
      field: 'user',
      headerName: 'User',
      flex: 1,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Box>
          <Typography variant="body2">{row.user?.name || 'Guest'}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.user?.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'products',
      headerName: 'Products',
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }) => (
        <Box>
          {row.products?.map((p, i) => (
            <Typography key={i} variant="caption">{`${p.quantity}x ${p.name}`}</Typography>
          ))}
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 120,
      renderCell: ({ value }) => {
        const { color, label } = getStatusColor(value);
        return <Chip label={label} color={color} size="small" />;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 0.8,
      minWidth: 160,
      renderCell: ({ value }) => formatDate(value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.4,
      sortable: false,
      renderCell: ({ row }) => (
        <Button size="small" variant="outlined" onClick={() => handleViewQuote(row.id)} startIcon={<FaEye />}>
          View
        </Button>
      ),
    },
  ];

  return (
    <Box className="flex min-h-screen">
      <MetaData title="All Quotes - Admin" />
      {!onMobile && <Sidebar activeTab="quotes" />}
      {toggleSidebar && <Sidebar activeTab="quotes" setToggleSidebar={setToggleSidebar} />}
      
      {onMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setToggleSidebar(true)}
            className="bg-blue-600 w-14 h-14 rounded-full shadow-lg text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
            aria-label="Open menu"
          >
            <MenuIcon className="w-7 h-7" />
          </button>
        </div>
      )}

      <div className="w-full sm:w-4/5 sm:ml-72 min-h-screen">
        <div className="flex flex-col gap-6 sm:m-8 p-2 pb-6 overflow-hidden">
          {/* <Typography variant="h5" gutterBottom>
            All Quotes
          </Typography> */}
          <Paper elevation={3} sx={{ height: 600, p: 2 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              autoHeight
              loading={loading}
            />
          </Paper>
        </div>
      </div>

      <QuoteDialog open={open} onClose={handleClose} quote={quote} />
    </Box>
  );
};

export default Quotes;
