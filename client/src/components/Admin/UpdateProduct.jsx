import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getProductDetails, updateProduct, clearErrors, removeProductImage } from '../../actions/productAction';
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants';
import { FiUpload, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
import Sidebar from './Sidebar/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';

const UpdateProduct = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { id } = useParams();

    const [onMobile, setOnMobile] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);

    useEffect(() => {
        if (window.innerWidth < 600) {
            setOnMobile(true);
        }
    }, []);

    const { loading, product } = useSelector((state) => state.productDetails);
    const { loading: updateLoading, isUpdated, error } = useSelector((state) => state.product);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [warranty, setWarranty] = useState(0);
    const [cuttedPrice, setCuttedPrice] = useState(0);
    const [brandname, setBrandname] = useState("");
    const [highlights, setHighlights] = useState([]);
    const [specifications, setSpecifications] = useState([{ name: '', value: '' }]);
    const [oldImages, setOldImages] = useState([]);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [logo, setLogo] = useState("");
    const [logoPreview, setLogoPreview] = useState("");
    const [highlightInput, setHighlightInput] = useState("");

    const categories = [
        "Electronics",
        "Fashion",
        "Home",
        "Beauty",
        "Books",
        "Toys",
        "Sports",
        "Others"
    ];

    useEffect(() => {
        if (product && product._id !== id) {
            dispatch(getProductDetails(id));
        } else {
            if (product) {
                setName(product.name);
                setDescription(product.description);
                setPrice(product.price);
                setCuttedPrice(product.cuttedPrice);
                setStock(product.stock);
                setWarranty(product.warranty);
                setCategory(product.category);
                setBrandname(product.brand?.name || "");
                setHighlights(product.highlights || []);
                // Ensure specifications is an array of objects with name and value properties
                const productSpecs = product.specifications || [];
                const formattedSpecs = productSpecs.length > 0
                    ? productSpecs.map(spec => ({
                        name: spec.name || '',
                        value: spec.value || ''
                    }))
                    : [{ name: '', value: '' }];
                setSpecifications(formattedSpecs);
                setOldImages(product.images || []);
                setLogoPreview(product.brand?.logo?.url || "");
            }
        }

        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }

        if (isUpdated) {
            enqueueSnackbar("Product Updated Successfully", { variant: "success" });
            dispatch({ type: UPDATE_PRODUCT_RESET });
            navigate("/admin/products");
        }
    }, [dispatch, id, product, error, isUpdated, enqueueSnackbar, navigate]);

    const handleProductImageChange = (e) => {
        const files = Array.from(e.target.files);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result]);
                    setImages((old) => [...old, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setLogoPreview(reader.result);
                setLogo(reader.result);
            }
        };

        reader.readAsDataURL(file);
    };

    const removeImage = (index, isOldImage = false, imageUrl = "") => {
        if (isOldImage) {
            const oldImagesCopy = [...oldImages];
            const removedImage = oldImagesCopy.splice(index, 1)[0];
            if (removedImage) {
                const newRemovedImage = { 
                    url: imageUrl || removedImage.url, 
                    public_id: removedImage.public_id 
                };
                setOldImages(oldImagesCopy);
                setRemovedImages(prev => [...prev, newRemovedImage]);
                // Dispatch action to update the Redux store
                dispatch(removeProductImage(newRemovedImage));
            }
        } else {
            const imagesCopy = [...images];
            const imagesPreviewCopy = [...imagesPreview];
            imagesCopy.splice(index, 1);
            imagesPreviewCopy.splice(index, 1);
            setImages(imagesCopy);
            setImagesPreview(imagesPreviewCopy);
        }
    };

    const currentProduct = useSelector((state) => state.productDetails.product);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", name);
        formData.set("price", price);
        formData.set("description", description);
        formData.set("category", category);
        formData.set("stock", stock);
        formData.set("warranty", warranty);
        formData.set("cuttedPrice", cuttedPrice);
        formData.set("brandname", brandname);

        // Add highlights
        highlights.forEach((h) => {
            formData.append("highlights", h);
        });

        // Add specifications as JSON strings
        specifications.forEach((spec) => {
            formData.append("specifications", JSON.stringify(spec));
        });

        // Add new images
        images.forEach((image) => {
            formData.append("images", image);
        });

        // Combine removed images from local state and Redux
        const removedFromRedux = currentProduct.removedImages || [];
        const allRemovedImages = [...removedImages, ...removedFromRedux];
        
        // Add removed images to form data if any exist
        if (allRemovedImages.length > 0) {
            // Collect unique public_ids of images to remove
            const removedPublicIds = [];
            const seen = new Set();
            
            allRemovedImages.forEach(img => {
                if (img && img.public_id && !seen.has(img.public_id)) {
                    seen.add(img.public_id);
                    removedPublicIds.push(img.public_id);
                }
            });
            
            console.log('Removing images with public_ids:', removedPublicIds);
            
            // Add as a JSON string of public_ids
            formData.append('removedImages', JSON.stringify(removedPublicIds));
        }

        // Add logo if updated
        if (logo) {
            formData.append("logo", logo);
        }

        console.log('Submitting form with data:', {
            name,
            price,
            category,
            stock,
            warranty,
            cuttedPrice,
            brandname,
            highlights,
            specifications,
            imagesCount: images.length,
            removedImagesCount: allRemovedImages.length,
            hasLogo: !!logo
        });

        dispatch(updateProduct(id, formData));
    };

    return (
        <>
            <MetaData title="Update Product | DhagaKart" />
            {loading || updateLoading ? <BackdropLoader /> : (
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
                                {/* <h1 className="text-2xl font-bold text-gray-900">Update Product</h1> */}
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Information</h2>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Name */}
                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                    placeholder="Enter product name"
                                                />
                                            </div>

                                            {/* Price */}
                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 sm:text-sm">₹</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={price}
                                                        onChange={(e) => setPrice(e.target.value)}
                                                        className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="0.00"
                                                        min="0"
                                                        step="0.01"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Cutted Price */}
                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-gray-700">Cutted Price (₹)</label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 sm:text-sm">₹</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={cuttedPrice}
                                                        onChange={(e) => setCuttedPrice(e.target.value)}
                                                        className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="0.00"
                                                        min="0"
                                                        step="0.01"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Category */}
                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                                <select
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                                                    required
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat} value={cat}>
                                                            {cat}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Stock */}
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                        Stock Quantity
                                                        <span className="ml-1 text-red-500">*</span>
                                                    </label>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {stock || 0} in stock
                                                    </span>
                                                </div>
                                                <div className="relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={stock}
                                                        onChange={(e) => setStock(e.target.value)}
                                                        className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                                        min="0"
                                                        required
                                                        placeholder="Enter stock quantity"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 sm:text-sm">units</span>
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Enter the total number of units available in inventory
                                                </p>
                                            </div>

                                            {/* Brand Section */}
                                            <div className="md:col-span-2">
                                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                                    <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-25">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                </svg>
                                                                <h3 className="text-base font-semibold text-gray-800">Brand Information</h3>
                                                            </div>
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-700 border border-blue-100 shadow-sm">
                                                                Brand Identity
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="p-5 space-y-5">
                                                        {/* Brand Name */}
                                                        <div className="space-y-1.5">
                                                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                                                Brand Name
                                                                <span className="ml-1 text-red-500">*</span>
                                                            </label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                    </svg>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    value={brandname}
                                                                    onChange={(e) => setBrandname(e.target.value)}
                                                                    className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                                    required
                                                                    placeholder="e.g., Nike, Apple"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Brand Logo */}
                                                        <div className="space-y-1">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Brand Logo
                                                                <span className="ml-1 text-xs font-normal text-gray-500">(Optional)</span>
                                                            </label>
                                                            <div className="flex items-center space-x-4">
                                                                <div className="relative group w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                                                                    {logoPreview ? (
                                                                        <>
                                                                            <img
                                                                                src={logoPreview}
                                                                                alt="Brand Logo"
                                                                                className="w-full h-full object-contain bg-white p-2"
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setLogoPreview('');
                                                                                    setLogo('');
                                                                                }}
                                                                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                                                                                title="Remove logo"
                                                                            >
                                                                                <FiX className="w-3.5 h-3.5" />
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                                                                            <FiUpload className="w-6 h-6 text-gray-400 mb-1.5" />
                                                                            <span className="text-xs text-center text-gray-500 px-2">
                                                                                Upload Logo
                                                                            </span>
                                                                            <input
                                                                                type="file"
                                                                                id="logo"
                                                                                accept="image/*"
                                                                                onChange={handleLogoChange}
                                                                                className="hidden"
                                                                            />
                                                                        </label>
                                                                    )}
                                                                </div>

                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-3">
                                                                        <label
                                                                            htmlFor="logo"
                                                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                                        >
                                                                            <FiUpload className="-ml-1 mr-2 h-4 w-4 text-gray-500" />
                                                                            {logoPreview ? 'Change Logo' : 'Choose File'}
                                                                        </label>
                                                                        {logoPreview && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setLogoPreview('');
                                                                                    setLogo('');
                                                                                }}
                                                                                className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <p className="mt-2 text-xs text-gray-500">
                                                                        PNG, JPG, or SVG (Max 2MB). Recommended size: 200x200px
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div className="md:col-span-2 space-y-1">
                                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                                <textarea
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                    rows="4"
                                                    placeholder="Enter product description"
                                                    required
                                                />
                                            </div>

                                            {/* Warranty */}
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-25 p-4 rounded-xl border border-blue-100">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 bg-blue-100 p-2.5 rounded-lg">
                                                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4 flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <label className="block text-sm font-semibold text-gray-800">
                                                                Warranty Period
                                                            </label>
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                Months
                                                            </span>
                                                        </div>

                                                        <div className="mt-2 relative rounded-lg shadow-sm">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </div>
                                                            <input
                                                                type="number"
                                                                value={warranty}
                                                                onChange={(e) => setWarranty(e.target.value)}
                                                                className="block w-full pl-10 pr-12 py-3 rounded-lg border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                                min="0"
                                                                required
                                                                placeholder="e.g., 12"
                                                            />
                                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 border-l border-blue-100">
                                                                <span className="text-gray-500 text-sm font-medium">
                                                                    {warranty === 0 ? 'No warranty' : warranty + ' mo'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="mt-2 flex items-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => setWarranty(0)}
                                                                className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                            >
                                                                No warranty
                                                            </button>
                                                            <span className="mx-2 text-gray-300">•</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => setWarranty(6)}
                                                                className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                            >
                                                                6 months
                                                            </button>
                                                            <span className="mx-2 text-gray-300">•</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => setWarranty(12)}
                                                                className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                            >
                                                                1 year
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Images */}
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Product Images
                                                        <span className="ml-2 text-xs font-normal text-gray-500">(Max 4 images)</span>
                                                    </label>
                                                    <span className="text-xs text-gray-500">{imagesPreview.length + oldImages.length}/4</span>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                    {imagesPreview.map((image, index) => (
                                                        <div key={index} className="relative group">
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        removeImage(index);
                                                                    }}
                                                                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                                    title="Remove image"
                                                                >
                                                                    <FiX className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            <img
                                                                src={image}
                                                                alt="Preview"
                                                                className="w-full h-28 sm:h-24 object-cover rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                                                            />
                                                        </div>
                                                    ))}
                                                    {oldImages.map((image, index) => (
                                                        <div key={index} className="relative group">
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        removeImage(index, true, image.url);
                                                                    }}
                                                                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                                    title="Remove image"
                                                                >
                                                                    <FiTrash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            <img
                                                                src={image.url}
                                                                alt="Preview"
                                                                className="w-full h-28 sm:h-24 object-cover rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                                                            />
                                                        </div>
                                                    ))}
                                                    {imagesPreview.length + oldImages.length < 4 && (
                                                        <label
                                                            htmlFor="productImages"
                                                            className="w-full h-28 sm:h-24 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group/upload"
                                                        >
                                                            <FiUpload className="w-6 h-6 text-gray-400 mb-1.5" />
                                                            <span className="mt-2 text-xs font-medium text-gray-600 group-hover/upload:text-blue-600">
                                                                {imagesPreview.length + oldImages.length === 0 ? 'Upload images' : 'Add more'}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 mt-0.5">
                                                                Max {4 - (imagesPreview.length + oldImages.length)} more
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    id="productImages"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleProductImageChange}
                                                    className="hidden"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Highlights
                                                        <span className="ml-1 text-xs font-normal text-gray-500">(Optional)</span>
                                                    </label>
                                                    <span className="text-xs text-gray-500">{highlights.length} added</span>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        {highlights.map((highlight, index) => (
                                                            <div key={index} className="flex items-center gap-1 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg text-sm">
                                                                <span>{highlight}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newHighlights = [...highlights];
                                                                        newHighlights.splice(index, 1);
                                                                        setHighlights(newHighlights);
                                                                    }}
                                                                    className="text-blue-600 hover:text-blue-800 transition-colors ml-1"
                                                                    aria-label="Remove highlight"
                                                                >
                                                                    <FiX className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={highlightInput}
                                                            onChange={(e) => setHighlightInput(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    if (highlightInput.trim()) {
                                                                        setHighlights([...highlights, highlightInput.trim()]);
                                                                        setHighlightInput('');
                                                                    }
                                                                }
                                                            }}
                                                            className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="Type and press Enter to add a highlight"
                                                        />
                                                        {highlightInput && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (highlightInput.trim()) {
                                                                        setHighlights([...highlights, highlightInput.trim()]);
                                                                        setHighlightInput('');
                                                                    }
                                                                }}
                                                                className="absolute inset-y-0 right-0 px-3 text-blue-500 hover:text-blue-700 focus:outline-none"
                                                                aria-label="Add highlight"
                                                            >
                                                                <FiPlus className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        Add key features or selling points of the product
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Specifications */}
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Specifications
                                                        <span className="ml-1 text-xs font-normal text-gray-500">(Optional)</span>
                                                    </label>
                                                    <span className="text-xs text-gray-500">{specifications.length} specifications</span>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="space-y-3">
                                                        {specifications && specifications.length > 0 && specifications.map((spec, index) => (
                                                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                                                                <div className="md:col-span-5">
                                                                    <div className="relative after:content-[''] after:absolute after:left-3 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-1 after:bg-gray-400 after:rounded-full">
                                                                        <input
                                                                            type="text"
                                                                            value={spec.name}
                                                                            onChange={(e) => {
                                                                                const newSpecs = [...specifications];
                                                                                newSpecs[index].name = e.target.value;
                                                                                setSpecifications(newSpecs);
                                                                            }}
                                                                            className="w-full pl-6 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                            placeholder="Specification name"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="md:col-span-6">
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            type="text"
                                                                            value={spec.value}
                                                                            onChange={(e) => {
                                                                                const newSpecs = [...specifications];
                                                                                newSpecs[index].value = e.target.value;
                                                                                setSpecifications(newSpecs);
                                                                            }}
                                                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                            placeholder="Enter value"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const newSpecs = [...specifications];
                                                                                newSpecs.splice(index, 1);
                                                                                setSpecifications(newSpecs);
                                                                            }}
                                                                            className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100"
                                                                            aria-label="Remove specification"
                                                                        >
                                                                            <FiX className="w-5 h-5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="pt-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSpecifications([...specifications, { name: '', value: '' }])}
                                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                            <span>Add Specification</span>
                                                        </button>
                                                    </div>
                                                    {specifications.length > 0 && (
                                                        <p className="text-xs text-gray-500">
                                                            Add detailed specifications like material, dimensions, weight, etc.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <div className="md:col-span-2">
                                                <button
                                                    type="submit"
                                                    disabled={loading || updateLoading}
                                                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${loading || updateLoading
                                                            ? 'bg-gray-300 cursor-not-allowed'
                                                            : 'bg-blue-500 hover:bg-blue-600'
                                                        }`}
                                                >
                                                    {loading || updateLoading ? 'Updating...' : 'Update Product'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </>
    );
};

export default UpdateProduct;