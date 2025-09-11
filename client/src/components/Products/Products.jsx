import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Pagination from '@mui/material/Pagination';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useSnackbar } from 'notistack';
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { clearErrors, getProducts } from '../../actions/productAction';
import Loader from '../Layouts/Loader';
import Product from './Product';
import { categories } from '../../utils/constants';
import MetaData from '../Layouts/MetaData';
import NotFound from './Not_found.png';
import { Drawer, IconButton, Modal, Box, TextField, Button } from '@mui/material'; // Added Modal, Box, TextField, Button
import FilterListIcon from '@mui/icons-material/FilterList';

// Style for the modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};


const Products = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const location = useLocation();

    // --- START: NEW STATE FOR MODAL ---
    const [queryModalOpen, setQueryModalOpen] = useState(false);
    const [productQuery, setProductQuery] = useState("");
    // --- END: NEW STATE FOR MODAL ---

    const searchParams = new URLSearchParams(location.search);
    const urlCategory = searchParams.get('category') || '';
    const [selectedCategory, setSelectedCategory] = useState(urlCategory);
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [categoryToggle, setCategoryToggle] = useState(true);
    const [subcategoryToggle, setSubcategoryToggle] = useState(true);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const { products, loading, error, productsCount, resultPerPage } = useSelector((state) => state.products);
    const keyword = params.keyword;

    const handleQuerySubmit = () => {
        // For now, this will just log the query.
        // Later, you can add an API call here.
        console.log("User product query:", productQuery);
        enqueueSnackbar("Thank you! Your request has been submitted.", { variant: "success" });
        setProductQuery("");
        setQueryModalOpen(false);
    };

    const clearFilters = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        setSelectedCategory("");
        setSelectedSubcategory("");
        setCurrentPage(1); 
        if (keyword) {
            window.location.href = '/products';
        }
    }

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        const searchKeyword = selectedCategory ? "" : keyword;
        dispatch(getProducts(searchKeyword, selectedCategory || "", [0, 20000000], 0, currentPage, selectedSubcategory || ""));
    }, [dispatch, keyword, selectedCategory, selectedSubcategory, currentPage, error, enqueueSnackbar]);
    
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const urlCategory = searchParams.get('category') || '';
        if (urlCategory && urlCategory !== selectedCategory) {
            setSelectedCategory(urlCategory);
            setSelectedSubcategory("");
            setCurrentPage(1);
        }
    }, [location.search, selectedCategory]);

    useEffect(() => {
        setSelectedSubcategory("");
        setCurrentPage(1);
    }, [selectedCategory]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedSubcategory]);
    
    const sortedProducts = useMemo(() => {
        if (!products) return [];

        const featuredProductName = 'Spun Viscose Yarn 30s – Soft Finish';
        
        return [...products].sort((a, b) => {
            if (a.name === featuredProductName) return -1;
            if (b.name === featuredProductName) return 1;
            return 0;
        });
    }, [products]);

    const renderFilters = () => (
        <div className="flex flex-col bg-white mt-4 rounded-xl shadow-lg w-full max-w-sm mx-auto">
            {/* ...your existing filter JSX... */}
             <div className="flex flex-col gap-4 text-sm">
                <div className="flex flex-col px-6 py-4">
                    <div
                        className="flex justify-between items-center cursor-pointer py-3 group"
                        onClick={() => setCategoryToggle(!categoryToggle)}
                    >
                        <div className="flex items-center gap-4">
                            <h3 className="font-semibold text-gray-700 hover:cursor-pointer">
                                Category
                            </h3>
                            <button
                                className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearFilters(e);
                                }}
                            >
                                Clear All
                            </button>
                        </div>
                        <span className="text-gray-500 group-hover:text-blue-600 transition-transform duration-200 transform">
                            {categoryToggle ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                        </span>
                    </div>
                    {categoryToggle && (
                        <div className="flex flex-col mt-2 md:space-y-2 space-y-1">
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="category-radio-buttons-group"
                                    name="category-radio-buttons"
                                    value={selectedCategory}
                                >
                                    {categories.map((category) => (
                                        <FormControlLabel
                                            key={category.name}
                                            value={category.name}
                                            control={
                                                <Radio
                                                    size="small"
                                                    className="text-blue-600"
                                                    checked={selectedCategory === category.name}
                                                    onChange={() => {
                                                        setSelectedCategory(selectedCategory === category.name ? "" : category.name);
                                                        setSelectedSubcategory("");
                                                        setCurrentPage(1);
                                                    }}
                                                />
                                            }
                                            label={
                                                <span className="text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200">
                                                    {category.name}
                                                </span>
                                            }
                                            className="py-1 hover:bg-blue-50 rounded-md transition-colors duration-150"
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </div>
                    )}
                </div>
                <div className="flex flex-col px-6 py-4 border-t border-gray-100">
                    <div
                        className="flex justify-between items-center cursor-pointer py-3 group"
                        onClick={() => setSubcategoryToggle(!subcategoryToggle)}
                    >
                        <h3 className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                            Subcategory
                        </h3>
                        <span className="text-gray-500 group-hover:text-blue-600 transition-transform duration-200 transform">
                            {subcategoryToggle ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                        </span>
                    </div>
                    {subcategoryToggle && selectedCategory && (
                        <div className="flex flex-col mt-2 md:space-y-2 space-y-1">
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="subcategory-radio-buttons-group"
                                    name="subcategory-radio-buttons"
                                >
                                    {categories
                                        .find(cat => cat.name === selectedCategory)?.subcategories
                                        .map((subcategory) => (
                                            <FormControlLabel
                                                key={subcategory}
                                                value={subcategory}
                                                control={
                                                    <Radio
                                                        size="small"
                                                        className="text-blue-600"
                                                        checked={selectedSubcategory === subcategory}
                                                        onChange={() => {
                                                            setSelectedSubcategory(selectedSubcategory === subcategory ? "" : subcategory);
                                                            if (window.innerWidth < 640) {
                                                                setMobileFilterOpen(false);
                                                            }
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <span className={`text-sm ${selectedSubcategory === subcategory ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                                                        {subcategory}
                                                    </span>
                                                }
                                                className={`py-1 hover:bg-blue-50 rounded-md transition-colors duration-150 ${selectedSubcategory === subcategory ? 'bg-blue-50' : ''}`}
                                            />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </div>
                    )}
                    {subcategoryToggle && !selectedCategory && (
                        <p className="text-xs text-gray-500 py-2 italic">Select a category first</p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <MetaData title="All Products | DhagaKart" />
            <main className="w-full min-h-[90vh] mt-10 md:mb-24 mb-10 px-1.5 md:px-16">
                <div className="min-h-[90vh] flex gap-3 mt-4 m-auto mb-7">
                    <div className="sm:hidden fixed bottom-8 right-8 z-10">
                        {/* ...your mobile filter button... */}
                         <button
                            onClick={() => setMobileFilterOpen(true)}
                            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                            aria-label="Open filters"
                        >
                            <FilterListIcon />
                        </button>
                    </div>

                    <Drawer
                        anchor="left"
                        open={mobileFilterOpen}
                        onClose={() => setMobileFilterOpen(false)}
                        ModalProps={{ keepMounted: true }}
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: '80%',
                                maxWidth: '320px',
                                boxSizing: 'border-box',
                                padding: '16px',
                            },
                        }}
                    >
                        {/* ...your drawer content... */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Filters</h2>
                            <IconButton onClick={() => setMobileFilterOpen(false)}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </IconButton>
                        </div>
                        <div className="overflow-y-auto h-full">
                            {renderFilters()}
                        </div>
                    </Drawer>

                    <div className="hidden sm:flex flex-col mt-2 w-1/5 px-1">
                        {renderFilters()}
                    </div>

                    <div className="flex-1">
                        {!loading && sortedProducts?.length === 0 && (
                            <div className="min-h-[90vh] flex flex-col items-center justify-center gap-3 bg-white shadow-sm rounded-sm">
                                <img draggable="false" className="w-1/2 h-44 object-contain" src={NotFound} alt="Search Not Found" />
                                <h1 className="text-2xl font-medium text-gray-900">No results found!</h1>
                                <p className="text-gray-500">We couldn't find what you're looking for.</p>
                                
                                {/* --- NEW BUTTON ADDED HERE --- */}
                                <button
                                    onClick={() => setQueryModalOpen(true)}
                                    className="mt-4 bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow hover:cursor-pointer"
                                >
                                    Request a Product
                                </button>
                            </div>
                        )}

                        {loading ? <Loader /> : (
                            <div className="w-full bg-white">
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 px-0">
                                    {sortedProducts?.map((product) => (
                                        <div key={product._id} className="w-full flex justify-center h-full">
                                            <div className="w-full max-w-[280px] h-auto flex flex-col border border-gray-200 rounded shadow">
                                                <div className="flex-1 flex flex-col">
                                                    <Product {...product} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {productsCount > resultPerPage && (
                                    <div className="flex justify-center p-4">
                                        <Pagination
                                            count={Math.ceil(productsCount / resultPerPage)}
                                            page={currentPage}
                                            onChange={(e, val) => setCurrentPage(val)}
                                            color="primary"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* --- NEW MODAL COMPONENT ADDED HERE --- */}
            <Modal
                open={queryModalOpen}
                onClose={() => setQueryModalOpen(false)}
                aria-labelledby="product-query-modal-title"
                aria-describedby="product-query-modal-description"
            >
                <Box sx={modalStyle}>
                    <h2 id="product-query-modal-title" className="text-xl font-semibold mb-2">
                        Request a Product
                    </h2>
                    <p id="product-query-modal-description" className="text-sm text-gray-600 mb-4">
                        Let us know what you were looking for, and we'll do our best to get it for you!
                    </p>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Product Details"
                        variant="outlined"
                        value={productQuery}
                        onChange={(e) => setProductQuery(e.target.value)}
                        placeholder="e.g., 2/60s Polyester Yarn, Black Color, 50 cones"
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleQuerySubmit}
                        sx={{ mt: 2, py: 1.5 }}
                        disabled={!productQuery.trim()}
                    >
                        Submit Request
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default Products;