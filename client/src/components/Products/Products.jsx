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
import NotFound from './Not_found.png'

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

    const { products, loading, error, productsCount, resultPerPage } = useSelector((state) => state.products);
    const keyword = params.keyword;

    const priceHandler = (e, newPrice) => {
        setPrice(newPrice);
    }

    const clearFilters = () => {
        setSelectedCategory("");
        setSelectedSubcategory("");
    }

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        // Pass default values for price and ratings
        dispatch(getProducts(keyword, selectedCategory || "", [0, 200000], 0, currentPage));
    }, [dispatch, keyword, selectedCategory, currentPage, error, enqueueSnackbar]);

    return (
        <>
            <MetaData title="All Products | DhagaKart" />

            {/* <MinCategory /> */}
            <main className="w-full min-h-[90vh] mt-10 px-16">

                {/* <!-- row --> */}
                <div className="min-h-[90vh] flex gap-3 mt-4 m-auto mb-7">

                    {/* <!-- sidebar column  --> */}
                    <div className="hidden sm:flex flex-col mt-2 w-1/5 px-1">

                        {/* <!-- nav tiles --> */}
                        <div className="flex flex-col bg-white rounded-sm shadow mt-2">

                            {/* filters header */}
                            <div className="flex items-center justify-between gap-5 px-4 py-2 border-b">
                                <p className="text-lg font-medium">Filters</p>
                                <span className="uppercase text-primary-blue text-xs cursor-pointer font-medium" onClick={clearFilters}>Clear all</span>
                            </div>

                            <div className="flex flex-col gap-2 text-sm overflow-hidden">

                                {/* category filter */}
                                <div className="flex flex-col px-4">

                                    <div className="flex justify-between cursor-pointer py-2 pb-4 items-center" onClick={() => setCategoryToggle(!categoryToggle)}>
                                        <p className="font-medium text-xs uppercase">Category</p>
                                        {categoryToggle ?
                                            <ExpandLessIcon sx={{ fontSize: "20px" }} /> :
                                            <ExpandMoreIcon sx={{ fontSize: "20px" }} />
                                        }
                                    </div>

                                    {categoryToggle && (
                                        <div className="flex flex-col pb-1">
                                            <FormControl>
                                                <RadioGroup
                                                    aria-labelledby="category-radio-buttons-group"
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    name="category-radio-buttons"
                                                    value={selectedCategory}
                                                >
                                                    {categories.map((category, i) => (
                                                        <FormControlLabel 
                                                            key={category.name}
                                                            value={category.name} 
                                                            control={
                                                                <Radio 
                                                                    size="small" 
                                                                    checked={selectedCategory === category.name}
                                                                    onChange={() => {
                                                                        setSelectedCategory(category.name);
                                                                        setSelectedSubcategory("");
                                                                    }}
                                                                />
                                                            } 
                                                            label={<span className="text-sm">{category.name}</span>} 
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                    )}

                                </div>
                                {/* category filter */}

                                {/* SubCategory filter - UI Only */}
                                <div className="flex flex-col px-4 border-t border-gray-200">
                                    <div 
                                        className="flex justify-between cursor-pointer py-2 pb-4 items-center"
                                        onClick={() => setSubcategoryToggle(!subcategoryToggle)}
                                    >
                                        <p className="font-medium text-xs uppercase">SubCategory</p>
                                        {subcategoryToggle ?
                                            <ExpandLessIcon sx={{ fontSize: "20px" }} /> :
                                            <ExpandMoreIcon sx={{ fontSize: "20px" }} />
                                        }
                                    </div>

                                    {subcategoryToggle && selectedCategory && (
                                        <div className="flex flex-col pb-1">
                                            <FormControl>
                                                <RadioGroup
                                                    aria-labelledby="subcategory-radio-buttons-group"
                                                    name="subcategory-radio-buttons"
                                                >
                                                    {categories
                                                        .find(cat => cat.name === selectedCategory)?.subcategories
                                                        .map((subcategory, i) => (
                                                            <FormControlLabel 
                                                                key={subcategory}
                                                                value={subcategory} 
                                                                control={<Radio size="small" disabled />} 
                                                                label={<span className="text-sm text-gray-500">{subcategory}</span>} 
                                                            />
                                                        ))
                                                    }
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                    )}
                                    {subcategoryToggle && !selectedCategory && (
                                        <p className="text-xs text-gray-500 pb-2">Select a category first</p>
                                    )}
                                </div>

                            </div>

                        </div>
                        {/* <!-- nav tiles --> */}

                    </div>
                    {/* <!-- sidebar column  --> */}

                    {/* <!-- search column --> */}
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
                                        <div key={product._id} className="flex justify-center">
                                            <Product {...product} />
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
                    {/* <!-- search column --> */}
                </div >
                {/* <!-- row --> */}

            </main >
        </>
    );
};

export default Products;
