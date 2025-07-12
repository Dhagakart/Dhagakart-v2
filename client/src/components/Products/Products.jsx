// import FormControl from '@mui/material/FormControl';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Pagination from '@mui/material/Pagination';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import Slider from '@mui/material/Slider';
// import { useSnackbar } from 'notistack';
// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { clearErrors, getProducts } from '../../actions/productAction';
// import Loader from '../Layouts/Loader';
// import MinCategory from '../Layouts/MinCategory';
// import Product from './Product';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import StarIcon from '@mui/icons-material/Star';
// import { categories } from '../../utils/constants';
// import MetaData from '../Layouts/MetaData';
// import { getRandomProducts } from '../../utils/functions';
// import { useLocation } from 'react-router-dom';
// import NotFound from './Not_found.png'

// const Products = () => {

//     const dispatch = useDispatch();
//     const { enqueueSnackbar } = useSnackbar();
//     const params = useParams();
//     const location = useLocation();

//     const [selectedCategory, setSelectedCategory] = useState("");
//     const [selectedSubcategory, setSelectedSubcategory] = useState("");

//     // pagination
//     const [currentPage, setCurrentPage] = useState(1);

//     // filter toggles
//     const [categoryToggle, setCategoryToggle] = useState(true);
//     const [subcategoryToggle, setSubcategoryToggle] = useState(true);

//     const { products, loading, error, productsCount, resultPerPage } = useSelector((state) => state.products);
//     const keyword = params.keyword;

//     const priceHandler = (e, newPrice) => {
//         setPrice(newPrice);
//     }

//     const clearFilters = () => {
//         setSelectedCategory("");
//         setSelectedSubcategory("");
//         setCurrentPage(1); // Reset to first page when clearing filters
//     }

//     useEffect(() => {
//         if (error) {
//             enqueueSnackbar(error, { variant: "error" });
//             dispatch(clearErrors());
//         }
//         // Pass selected category and subcategory to filter products
//         dispatch(getProducts(keyword, selectedCategory || "", [0, 200000], 0, currentPage, selectedSubcategory || ""));
//     }, [dispatch, keyword, selectedCategory, selectedSubcategory, currentPage, error, enqueueSnackbar]);
    
//     // Reset subcategory and page when category changes
//     useEffect(() => {
//         setSelectedSubcategory("");
//         setCurrentPage(1);
//     }, [selectedCategory]);
    
//     // Reset page when subcategory changes
//     useEffect(() => {
//         setCurrentPage(1);
//     }, [selectedSubcategory]);

//     return (
//         <>
//             <MetaData title="All Products | DhagaKart" />

//             {/* <MinCategory /> */}
//             <main className="w-full min-h-[90vh] mt-10 px-16">

//                 {/* <!-- row --> */}
//                 <div className="min-h-[90vh] flex gap-3 mt-4 m-auto mb-7">

//                     {/* <!-- sidebar column  --> */}
//                     <div className="hidden sm:flex flex-col mt-2 w-1/5 px-1">

//                         {/* <!-- nav tiles --> */}
//                         <div className="flex flex-col bg-white mt-4 rounded-xl shadow-lg w-full max-w-sm mx-auto">

//                             <div className="flex flex-col gap-4 text-sm">

//                                 {/* Category filter */}
//                                 <div className="flex flex-col px-6 py-4">
//                                     <div
//                                         className="flex justify-between items-center cursor-pointer py-3 group"
//                                         onClick={() => setCategoryToggle(!categoryToggle)}
//                                     >
//                                         <div className="flex items-center gap-4">
//                                             <h3 className="font-semibold text-gray-700 hover:cursor-pointer">
//                                                 Category
//                                             </h3>
//                                             <button
//                                                 className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
//                                                 onClick={(e) => {
//                                                     e.stopPropagation(); // Prevent toggling category when clicking Clear All
//                                                     clearFilters();
//                                                 }}
//                                             >
//                                                 Clear All
//                                             </button>
//                                         </div>
//                                         <span className="text-gray-500 group-hover:text-blue-600 transition-transform duration-200 transform">
//                                             {categoryToggle ? (
//                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
//                                                 </svg>
//                                             ) : (
//                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                                                 </svg>
//                                             )}
//                                         </span>
//                                     </div>

//                                     {categoryToggle && (
//                                         <div className="flex flex-col mt-2 space-y-2">
//                                             <FormControl>
//                                                 <RadioGroup
//                                                     aria-labelledby="category-radio-buttons-group"
//                                                     onChange={(e) => setCategory(e.target.value)}
//                                                     name="category-radio-buttons"
//                                                     value={selectedCategory}
//                                                 >
//                                                     {categories.map((category, i) => (
//                                                         <FormControlLabel
//                                                             key={category.name}
//                                                             value={category.name}
//                                                             control={
//                                                                 <Radio
//                                                                     size="small"
//                                                                     className="text-blue-600"
//                                                                     checked={selectedCategory === category.name}
//                                                                     onChange={() => {
//                                                                         setSelectedCategory(category.name);
//                                                                         setSelectedSubcategory("");
//                                                                     }}
//                                                                 />
//                                                             }
//                                                             label={
//                                                                 <span className="text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200">
//                                                                     {category.name}
//                                                                 </span>
//                                                             }
//                                                             className="py-1 hover:bg-blue-50 rounded-md transition-colors duration-150"
//                                                         />
//                                                     ))}
//                                                 </RadioGroup>
//                                             </FormControl>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* SubCategory filter */}
//                                 <div className="flex flex-col px-6 py-4 border-t border-gray-100">
//                                     <div
//                                         className="flex justify-between items-center cursor-pointer py-3 group"
//                                         onClick={() => setSubcategoryToggle(!subcategoryToggle)}
//                                     >
//                                         <h3 className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
//                                             Subcategory
//                                         </h3>
//                                         <span className="text-gray-500 group-hover:text-blue-600 transition-transform duration-200 transform">
//                                             {subcategoryToggle ? (
//                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
//                                                 </svg>
//                                             ) : (
//                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                                                 </svg>
//                                             )}
//                                         </span>
//                                     </div>

//                                     {subcategoryToggle && selectedCategory && (
//                                         <div className="flex flex-col mt-2 space-y-2">
//                                             <FormControl>
//                                                 <RadioGroup
//                                                     aria-labelledby="subcategory-radio-buttons-group"
//                                                     name="subcategory-radio-buttons"
//                                                 >
//                                                     {categories
//                                                         .find(cat => cat.name === selectedCategory)?.subcategories
//                                                         .map((subcategory, i) => (
//                                                             <FormControlLabel
//                                                                 key={subcategory}
//                                                                 value={subcategory}
//                                                                 control={
//                                                                     <Radio
//                                                                         size="small"
//                                                                         className="text-blue-600"
//                                                                         checked={selectedSubcategory === subcategory}
//                                                                         onChange={() => {
//                                                                             setSelectedSubcategory(selectedSubcategory === subcategory ? "" : subcategory);
//                                                                         }}
//                                                                     />
//                                                                 }
//                                                                 label={
//                                                                     <span className={`text-sm ${selectedSubcategory === subcategory ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
//                                                                         {subcategory}
//                                                                     </span>
//                                                                 }
//                                                                 className={`py-1 hover:bg-blue-50 rounded-md transition-colors duration-150 ${selectedSubcategory === subcategory ? 'bg-blue-50' : ''}`}
//                                                             />
//                                                         ))
//                                                     }
//                                                 </RadioGroup>
//                                             </FormControl>
//                                         </div>
//                                     )}
//                                     {subcategoryToggle && !selectedCategory && (
//                                         <p className="text-xs text-gray-500 py-2 italic">Select a category first</p>
//                                     )}
//                                 </div>

//                             </div>

//                         </div>
//                         {/* <!-- nav tiles --> */}

//                     </div>
//                     {/* <!-- sidebar column  --> */}

//                     {/* <!-- search column --> */}
//                     <div className="flex-1">

//                         {!loading && products?.length === 0 && (
//                             <div className="min-h-[90vh] flex flex-col items-center justify-center gap-3 bg-white shadow-sm rounded-sm">
//                                 <img draggable="false" className="w-1/2 h-44 object-contain" src={NotFound} alt="Search Not Found" />
//                                 <h1 className="text-2xl font-medium text-gray-900">No results found!</h1>
//                             </div>
//                         )}

//                         {loading ? <Loader /> : (
//                             <div className="w-full bg-white">
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
//                                     {products?.map((product) => (
//                                         <div key={product._id} className="flex justify-center">
//                                             <Product {...product} />
//                                         </div>
//                                     ))}
//                                 </div>
//                                 {productsCount > resultPerPage && (
//                                     <div className="flex justify-center p-4">
//                                         <Pagination
//                                             count={Math.ceil(productsCount / resultPerPage)}
//                                             page={currentPage}
//                                             onChange={(e, val) => setCurrentPage(val)}
//                                             color="primary"
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                     {/* <!-- search column --> */}
//                 </div >
//                 {/* <!-- row --> */}

//             </main >
//         </>
//     );
// };

// export default Products;

// import FormControl from '@mui/material/FormControl';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Pagination from '@mui/material/Pagination';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import Slider from '@mui/material/Slider';
// import { useSnackbar } from 'notistack';
// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { clearErrors, getProducts } from '../../actions/productAction';
// import Loader from '../Layouts/Loader';
// import MinCategory from '../Layouts/MinCategory';
// import Product from './Product';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import StarIcon from '@mui/icons-material/Star';
// import { categories } from '../../utils/constants';
// import MetaData from '../Layouts/MetaData';
// import { getRandomProducts } from '../../utils/functions';
// import { useLocation } from 'react-router-dom';
// import NotFound from './Not_found.png'

// const Products = () => {

//     const dispatch = useDispatch();
//     const { enqueueSnackbar } = useSnackbar();
//     const params = useParams();
//     const location = useLocation();

//     const [selectedCategory, setSelectedCategory] = useState("");
//     const [selectedSubcategory, setSelectedSubcategory] = useState("");

//     // pagination
//     const [currentPage, setCurrentPage] = useState(1);

//     // filter toggles
//     const [categoryToggle, setCategoryToggle] = useState(true);
//     const [subcategoryToggle, setSubcategoryToggle] = useState(true);

//     const { products, loading, error, productsCount, resultPerPage } = useSelector((state) => state.products);
//     const keyword = params.keyword;

//     const priceHandler = (e, newPrice) => {
//         setPrice(newPrice);
//     }

//     const clearFilters = () => {
//         setSelectedCategory("");
//         setSelectedSubcategory("");
//         setCurrentPage(1); // Reset to first page when clearing filters
//     }

//     useEffect(() => {
//         if (error) {
//             enqueueSnackbar(error, { variant: "error" });
//             dispatch(clearErrors());
//         }
//         // Pass selected category and subcategory to filter products
//         dispatch(getProducts(keyword, selectedCategory || "", [0, 200000], 0, currentPage, selectedSubcategory || ""));
//     }, [dispatch, keyword, selectedCategory, selectedSubcategory, currentPage, error, enqueueSnackbar]);
    
//     // Reset subcategory and page when category changes
//     useEffect(() => {
//         setSelectedSubcategory("");
//         setCurrentPage(1);
//     }, [selectedCategory]);
    
//     // Reset page when subcategory changes
//     useEffect(() => {
//         setCurrentPage(1);
//     }, [selectedSubcategory]);

//     return (
//         <>
//             <MetaData title="All Products | DhagaKart" />

//             {/* <MinCategory /> */}
//             <main className="w-full min-h-[90vh] mt-10 px-16">

//                 {/* <!-- row --> */}
//                 <div className="min-h-[90vh] flex gap-3 mt-4 m-auto mb-7">

//                     {/* <!-- sidebar column  --> */}
//                     <div className="hidden sm:flex flex-col mt-2 w-1/5 px-1">

//                         {/* <!-- nav tiles --> */}
//                         <div className="flex flex-col bg-white mt-4 rounded-xl shadow-lg w-full max-w-sm mx-auto">

//                             <div className="flex flex-col gap-4 text-sm">

//                                 {/* Category filter */}
//                                 <div className="flex flex-col px-6 py-4">
//                                     <div
//                                         className="flex justify-between items-center cursor-pointer py-3 group"
//                                         onClick={() => setCategoryToggle(!categoryToggle)}
//                                     >
//                                         <div className="flex items-center gap-4">
//                                             <h3 className="font-semibold text-gray-700 hover:cursor-pointer">
//                                                 Category
//                                             </h3>
//                                             <button
//                                                 className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
//                                                 onClick={(e) => {
//                                                     e.stopPropagation(); // Prevent toggling category when clicking Clear All
//                                                     clearFilters();
//                                                 }}
//                                             >
//                                                 Clear All
//                                             </button>
//                                         </div>
//                                         <span className="text-gray-500 group-hover:text-blue-600 transition-transform duration-200 transform">
//                                             {categoryToggle ? (
//                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
//                                                 </svg>
//                                             ) : (
//                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                                                 </svg>
//                                             )}
//                                         </span>
//                                     </div>

//                                     {categoryToggle && (
//                                         <div className="flex flex-col mt-2 space-y-2">
//                                             <FormControl>
//                                                 <RadioGroup
//                                                     aria-labelledby="category-radio-buttons-group"
//                                                     onChange={(e) => setCategory(e.target.value)}
//                                                     name="category-radio-buttons"
//                                                     value={selectedCategory}
//                                                 >
//                                                     {categories.map((category, i) => (
//                                                         <FormControlLabel
//                                                             key={category.name}
//                                                             value={category.name}
//                                                             control={
//                                                                 <Radio
//                                                                     size="small"
//                                                                     className="text-blue-600"
//                                                                     checked={selectedCategory === category.name}
//                                                                     onChange={() => {
//                                                                         setSelectedCategory(category.name);
//                                                                         setSelectedSubcategory("");
//                                                                     }}
//                                                                 />
//                                                             }
//                                                             label={
//                                                                 <span className="text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200">
//                                                                     {category.name}
//                                                                 </span>
//                                                             }
//                                                             className="py-1 hover:bg-blue-50 rounded-md transition-colors duration-150"
//                                                         />
//                                                     ))}
//                                                 </RadioGroup>
//                                             </FormControl>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* SubCategory filter */}
//                                 <div className="flex flex-col px-6 py-4 border-t border-gray-100">
//                                     <div
//                                         className="flex justify-between items-center cursor-pointer py-3 group"
//                                         onClick={() => setSubcategoryToggle(!subcategoryToggle)}
//                                     >
//                                         <h3 className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
//                                             Subcategory
//                                         </h3>
//                                         <span className="text-gray-500 group-hover:text-blue-600 transition-transform duration-200 transform">
//                                             {subcategoryToggle ? (
//                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
//                                                 </svg>
//                                             ) : (
//                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                                                 </svg>
//                                             )}
//                                         </span>
//                                     </div>

//                                     {subcategoryToggle && selectedCategory && (
//                                         <div className="flex flex-col mt-2 space-y-2">
//                                             <FormControl>
//                                                 <RadioGroup
//                                                     aria-labelledby="subcategory-radio-buttons-group"
//                                                     name="subcategory-radio-buttons"
//                                                 >
//                                                     {categories
//                                                         .find(cat => cat.name === selectedCategory)?.subcategories
//                                                         .map((subcategory, i) => (
//                                                             <FormControlLabel
//                                                                 key={subcategory}
//                                                                 value={subcategory}
//                                                                 control={
//                                                                     <Radio
//                                                                         size="small"
//                                                                         className="text-blue-600"
//                                                                         checked={selectedSubcategory === subcategory}
//                                                                         onChange={() => {
//                                                                             setSelectedSubcategory(selectedSubcategory === subcategory ? "" : subcategory);
//                                                                         }}
//                                                                     />
//                                                                 }
//                                                                 label={
//                                                                     <span className={`text-sm ${selectedSubcategory === subcategory ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
//                                                                         {subcategory}
//                                                                     </span>
//                                                                 }
//                                                                 className={`py-1 hover:bg-blue-50 rounded-md transition-colors duration-150 ${selectedSubcategory === subcategory ? 'bg-blue-50' : ''}`}
//                                                             />
//                                                         ))
//                                                     }
//                                                 </RadioGroup>
//                                             </FormControl>
//                                         </div>
//                                     )}
//                                     {subcategoryToggle && !selectedCategory && (
//                                         <p className="text-xs text-gray-500 py-2 italic">Select a category first</p>
//                                     )}
//                                 </div>

//                             </div>

//                         </div>
//                         {/* <!-- nav tiles --> */}

//                     </div>
//                     {/* <!-- sidebar column  --> */}

//                     {/* <!-- search column --> */}
//                     <div className="flex-1">

//                         {!loading && products?.length === 0 && (
//                             <div className="min-h-[90vh] flex flex-col items-center justify-center gap-3 bg-white shadow-sm rounded-sm">
//                                 <img draggable="false" className="w-1/2 h-44 object-contain" src={NotFound} alt="Search Not Found" />
//                                 <h1 className="text-2xl font-medium text-gray-900">No results found!</h1>
//                             </div>
//                         )}

//                         {loading ? <Loader /> : (
//                             <div className="w-full bg-white">
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
//                                     {products?.map((product) => (
//                                         <div key={product._id} className="flex justify-center">
//                                             <Product {...product} />
//                                         </div>
//                                     ))}
//                                 </div>
//                                 {productsCount > resultPerPage && (
//                                     <div className="flex justify-center p-4">
//                                         <Pagination
//                                             count={Math.ceil(productsCount / resultPerPage)}
//                                             page={currentPage}
//                                             onChange={(e, val) => setCurrentPage(val)}
//                                             color="primary"
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                     {/* <!-- search column --> */}
//                 </div >
//                 {/* <!-- row --> */}

//             </main >
//         </>
//     );
// };

// export default Products;

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Pagination from '@mui/material/Pagination';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slider from '@mui/material/Slider';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { clearErrors, getProducts } from '../../actions/productAction';
import Loader from '../Layouts/Loader';
import MinCategory from '../Layouts/MinCategory';
import Product from './Product';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import StarIcon from '@mui/icons-material/Star';
import { categories } from '../../utils/constants';
import MetaData from '../Layouts/MetaData';
import { getRandomProducts } from '../../utils/functions';
import { useLocation } from 'react-router-dom';
import NotFound from './Not_found.png';
import { Drawer, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const Products = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const location = useLocation();

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");

    // pagination
    const [currentPage, setCurrentPage] = useState(1);

    // filter toggles
    const [categoryToggle, setCategoryToggle] = useState(true);
    const [subcategoryToggle, setSubcategoryToggle] = useState(true);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const { products, loading, error, productsCount, resultPerPage } = useSelector((state) => state.products);
    const keyword = params.keyword;

    const priceHandler = (e, newPrice) => {
        setPrice(newPrice);
    }

    const clearFilters = () => {
        setSelectedCategory("");
        setSelectedSubcategory("");
        setCurrentPage(1); // Reset to first page when clearing filters
    }

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        // Pass selected category and subcategory to filter products
        dispatch(getProducts(keyword, selectedCategory || "", [0, 200000], 0, currentPage, selectedSubcategory || ""));
    }, [dispatch, keyword, selectedCategory, selectedSubcategory, currentPage, error, enqueueSnackbar]);
    
    // Reset subcategory and page when category changes
    useEffect(() => {
        setSelectedSubcategory("");
        setCurrentPage(1);
    }, [selectedCategory]);
    
    // Reset page when subcategory changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedSubcategory]);

    const renderFilters = () => (
        <div className="flex flex-col bg-white mt-4 rounded-xl shadow-lg w-full max-w-sm mx-auto">
            <div className="flex flex-col gap-4 text-sm">
                {/* Category filter */}
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
                                    clearFilters();
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
                        <div className="flex flex-col mt-2 space-y-2">
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="category-radio-buttons-group"
                                    onChange={(e) => setCategory(e.target.value)}
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
                                                        setSelectedCategory(category.name);
                                                        setSelectedSubcategory("");
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

                {/* SubCategory filter */}
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
                        <div className="flex flex-col mt-2 space-y-2">
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
                                                            // Close the drawer on mobile when a subcategory is selected
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

            {/* <MinCategory /> */}
            <main className="w-full min-h-[90vh] mt-10 px-4 sm:px-16">
                {/* <!-- row --> */}
                <div className="min-h-[90vh] flex gap-3 mt-4 m-auto mb-7">
                    {/* Mobile Filter Button */}
                    <div className="sm:hidden fixed bottom-8 right-8 z-10">
                        <button
                            onClick={() => setMobileFilterOpen(true)}
                            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                            aria-label="Open filters"
                        >
                            <FilterListIcon />
                        </button>
                    </div>

                    {/* Mobile Filter Drawer */}
                    <Drawer
                        anchor="left"
                        open={mobileFilterOpen}
                        onClose={() => setMobileFilterOpen(false)}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: '80%',
                                maxWidth: '320px',
                                boxSizing: 'border-box',
                                padding: '16px',
                            },
                        }}
                    >
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

                    {/* Desktop Sidebar */}
                    <div className="hidden sm:flex flex-col mt-2 w-1/5 px-1">
                        {renderFilters()}
                    </div>

                    {/* Search Column */}
                    <div className="flex-1">
                        {!loading && products?.length === 0 && (
                            <div className="min-h-[90vh] flex flex-col items-center justify-center gap-3 bg-white shadow-sm rounded-sm">
                                <img draggable="false" className="w-1/2 h-44 object-contain" src={NotFound} alt="Search Not Found" />
                                <h1 className="text-2xl font-medium text-gray-900">No results found!</h1>
                            </div>
                        )}

                        {loading ? <Loader /> : (
                           <div className="w-full bg-white">
                           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                             {products?.map((product) => (
                               <div key={product._id} className="w-full flex justify-center h-full">
                                 <div className="w-full max-w-[280px] h-[400px] flex flex-col border border-gray-200  rounded shadow">
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
        </>
    );
};

export default Products;