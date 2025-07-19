import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getProductDetails, updateProduct, clearErrors } from '../../actions/productAction';
import { categories as categoriesData } from '../../utils/constants';
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants';
import { FiUpload, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
import Sidebar from './Sidebar/Sidebar';

const UpdateProduct = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { id } = useParams();

    const { loading, product } = useSelector((state) => state.productDetails);
    const { loading: updateLoading, isUpdated, error } = useSelector((state) => state.product);

    // Form State
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [warranty, setWarranty] = useState(0);
    const [cuttedPrice, setCuttedPrice] = useState(0);
    const [highlights, setHighlights] = useState([]);
    const [highlightInput, setHighlightInput] = useState("");
    const [specifications, setSpecifications] = useState([{ title: '', description: '' }]);
    const [oldImages, setOldImages] = useState([]);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [orderConfig, setOrderConfig] = useState({
        units: [{
            unit: 'unit',
            minQty: 1,
            increment: 1,
            maxQty: 25,
            isDefault: true
        }]
    });
    const [subcategories, setSubcategories] = useState([]);

    const categoryNames = categoriesData.map((cat) => cat.name);

    // Effect 1: Handles initial data population and API status
    useEffect(() => {
        if (!product || product._id !== id) {
            dispatch(getProductDetails(id));
        } else {
            setName(product.name || "");
            setDescription(product.description || "");
            setPrice(product.price || 0);
            setCuttedPrice(product.cuttedPrice || 0);
            setStock(product.stock || 0);
            setWarranty(product.warranty || 0);
            setCategory(product.category || "");
            setSubCategory(product.subCategory || "");
            setHighlights(product.highlights || []);
            setOldImages(product.images || []);
            setSpecifications(product.specifications?.length > 0 ? product.specifications : [{ title: '', description: '' }]);
            setOrderConfig(product.orderConfig || {
                units: [{
                    unit: 'unit',
                    minQty: 1,
                    increment: 1,
                    maxQty: 25,
                    isDefault: true
                }]
            });
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

    // Effect 2: Manages the subcategory list based on the selected category
    useEffect(() => {
        if (category) {
            const selectedCategoryData = categoriesData.find((cat) => cat.name === category);
            const availableSubcategories = selectedCategoryData?.subcategories || [];
            setSubcategories(availableSubcategories);

            if (subCategory && !availableSubcategories.includes(subCategory)) {
                setSubCategory("");
            }
        } else {
            setSubcategories([]);
            setSubCategory("");
        }
    }, [category, subCategory]);
    
    // Handler Functions
    const handleUnitChange = (index, field, value) => {
        if (!orderConfig?.units) return;

        const updatedUnits = [...orderConfig.units];
        if (index >= updatedUnits.length) return;

        // Handle price fields specially
        if (field === 'price' || field === 'cuttedPrice') {
            // Convert to number only if it's a valid number
            const numValue = Number(value);
            if (!isNaN(numValue) && numValue >= 0.01) {
                // Only convert to number if it's valid
                value = numValue;
            } else if (value === '') {
                // Allow empty string for clearing
                value = '';
            } else {
                enqueueSnackbar('Price must be at least 0.01 or empty', { variant: 'error' });
                return;
            }
        }

        updatedUnits[index] = {
            ...updatedUnits[index],
            [field]: value
        };
        
        // Ensure only one unit is default
        if (field === 'isDefault' && value) {
            updatedUnits.forEach((unit, i) => {
                if (i !== index) {
                    unit.isDefault = false;
                }
            });
        }
        
        // Validate price relationship after setting
        if (field === 'price' || field === 'cuttedPrice') {
            const unit = updatedUnits[index];
            if (unit.price && unit.cuttedPrice) {
                const priceNum = Number(unit.price);
                const cuttedPriceNum = Number(unit.cuttedPrice);
                if (!isNaN(priceNum) && !isNaN(cuttedPriceNum) && priceNum > cuttedPriceNum) {
                    enqueueSnackbar('Current price must be less than or equal to cutted price', { variant: 'error' });
                    // Don't revert the change, just show the error
                }
            }
        }
        
        setOrderConfig({ units: updatedUnits });
    };

    const addUnit = () => {
        // Initialize units array if it doesn't exist
        if (!orderConfig || !Array.isArray(orderConfig.units)) {
            setOrderConfig({
                units: [{
                    unit: 'unit',
                    minQty: 1,
                    increment: 1,
                    maxQty: 25,
                    isDefault: true
                }]
            });
            return;
        }

        setOrderConfig({
            units: [...orderConfig.units, {
                unit: 'unit',
                minQty: 1,
                increment: 1,
                maxQty: 25,
                isDefault: false
            }]
        });
    };

    const removeUnit = (index) => {
        if (!orderConfig?.units) return;

        const updatedUnits = [...orderConfig.units];
        if (index >= updatedUnits.length) return;

        updatedUnits.splice(index, 1);
        
        // Ensure at least one unit exists and is default
        if (updatedUnits.length === 0) {
            updatedUnits.push({
                unit: 'unit',
                minQty: 1,
                increment: 1,
                maxQty: 25,
                isDefault: true
            });
        } else if (!updatedUnits.some(unit => unit.isDefault)) {
            updatedUnits[0].isDefault = true;
        }
        
        setOrderConfig({ units: updatedUnits });
    };

    const handleProductImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([]);
        setImagesPreview([]);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImages((old) => [...old, reader.result]);
                    setImagesPreview((old) => [...old, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index, isOldImage = false) => {
        if (isOldImage) {
            const removedImage = oldImages[index];
            if (removedImage) {
                setRemovedImages((prev) => [...prev, removedImage.public_id]);
                setOldImages(oldImages.filter((_, i) => i !== index));
            }
        } else {
            setImages(images.filter((_, i) => i !== index));
            setImagesPreview(imagesPreview.filter((_, i) => i !== index));
        }
    };
    
    const addHighlight = () => {
        if (highlightInput.trim()) {
            setHighlights([...highlights, highlightInput.trim()]);
            setHighlightInput('');
        }
    };

    const removeHighlight = (index) => {
        setHighlights(highlights.filter((_, i) => i !== index));
    };

    const handleSpecificationChange = (index, e) => {
        const updatedSpecifications = [...specifications];
        updatedSpecifications[index][e.target.name] = e.target.value;
        setSpecifications(updatedSpecifications);
    };

    const addSpecification = () => {
        setSpecifications([...specifications, { title: '', description: '' }]);
    };

    const removeSpecification = (index) => {
        setSpecifications(specifications.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.set("name", name);
        formData.set("price", price);
        formData.set("description", description);
        formData.set("category", category);
        formData.set("subCategory", subCategory);
        formData.set("stock", stock);
        formData.set("warranty", warranty);
        formData.set("cuttedPrice", cuttedPrice);

        // Handle images
        images.forEach(image => formData.append("images", image));
        if (removedImages.length > 0) {
            removedImages.forEach(id => formData.append("removedImages", id));
        }

        // Prepare orderConfig data
        const updatedOrderConfig = { ...orderConfig };
        if (updatedOrderConfig?.units) {
            updatedOrderConfig.units.forEach(unit => {
                // Ensure prices are valid numbers
                unit.price = Number(unit.price) || 0;
                unit.cuttedPrice = Number(unit.cuttedPrice) || 0;
                // Ensure price is less than or equal to cuttedPrice
                if (unit.price > unit.cuttedPrice) {
                    unit.cuttedPrice = unit.price;
                }
                // Ensure required fields are present
                unit.unit = unit.unit || 'unit';
                unit.minQty = Number(unit.minQty) || 1;
                unit.increment = Number(unit.increment) || 1;
                unit.maxQty = Number(unit.maxQty) || 25;
                unit.isDefault = Boolean(unit.isDefault);
            });
        }

        formData.set("orderConfig", JSON.stringify(updatedOrderConfig));
        
        // Handle specifications
        const validSpecs = specifications.filter(spec => spec.title && spec.description);
        formData.set("specifications", JSON.stringify(validSpecs));

        // Handle highlights
        highlights.forEach(h => formData.append("highlights", h));

        dispatch(updateProduct(id, formData));
    };

    return (
        <>
            <MetaData title="Admin: Update Product" />
            {(loading || updateLoading) && <BackdropLoader />}
            <main className="flex min-h-screen bg-slate-100">
                <Sidebar activeTab="products" />
                <div className="w-full h-full">
                    <div className="p-4 sm:p-8">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-8">
                            
                            {/* Header */}
                            <div className="pb-6 border-b border-slate-200">
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Update Product</h1>
                                <p className="text-slate-500 mt-1">Manage and update product details.</p>
                            </div>

                            {/* Section: Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Product Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"/>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"/>
                                </div>
                            </div>

                            {/* Section: Stock & Warranty */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-6 border-t border-slate-200">
                                <div><label className="block text-sm font-medium text-slate-600 mb-1">Stock</label><input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300"/></div>
                                <div><label className="block text-sm font-medium text-slate-600 mb-1">Warranty (Months)</label><input type="number" value={warranty} onChange={(e) => setWarranty(Number(e.target.value))} min="0" required className="w-full px-4 py-2.5 rounded-lg border border-slate-300"/></div>
                            </div>

                            {/* Section: Categorization */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-6 border-t border-slate-200">
                                <div><label className="block text-sm font-medium text-slate-600 mb-1">Category</label><select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white"><option value="">Select Category</option>{categoryNames.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                                <div><label className="block text-sm font-medium text-slate-600 mb-1">Subcategory</label><select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} disabled={subcategories.length === 0} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white"><option value="">Select Subcategory</option>{subcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}</select></div>
                            </div>
                            
                            {/* Section: Order Configuration */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-slate-800 mb-4">Order Configuration</h2>
                                <div className="space-y-4">
                                    {orderConfig?.units?.length ? (
                                        orderConfig.units.map((unit, index) => (
                                            <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-lg font-medium text-slate-700">Unit {index + 1}</h3>
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeUnit(index)}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        <FiX className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-600 mb-1">Unit Name</label>
                                                            <input 
                                                                type="text" 
                                                                value={unit.unit || ''}
                                                                onChange={(e) => handleUnitChange(index, 'unit', e.target.value)}
                                                                placeholder="e.g., kg, box, cones"
                                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-600 mb-1">Default Unit</label>
                                                            <input 
                                                                type="checkbox" 
                                                                checked={unit.isDefault}
                                                                onChange={(e) => handleUnitChange(index, 'isDefault', e.target.checked)}
                                                                className="w-4 h-4 rounded border-slate-300 focus:ring-[#003366]"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-600 mb-1">Price (₹)</label>
                                                            <input 
                                                                type="number" 
                                                                value={unit.price || ''}
                                                                onChange={(e) => handleUnitChange(index, 'price', e.target.value)}
                                                                min="0.01"
                                                                step="0.01"
                                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                                                            />
                                                            <p className="text-xs text-red-500 mt-1">
                                                                {unit.price && unit.cuttedPrice && unit.price > unit.cuttedPrice
                                                                    ? 'Current price must be less than or equal to cutted price'
                                                                    : ''}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-600 mb-1">Cutted Price (₹)</label>
                                                            <input 
                                                                type="number" 
                                                                value={unit.cuttedPrice || ''}
                                                                onChange={(e) => handleUnitChange(index, 'cuttedPrice', e.target.value)}
                                                                min="0.01"
                                                                step="0.01"
                                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                                                            />
                                                            <p className="text-xs text-red-500 mt-1">
                                                                {unit.price && unit.cuttedPrice && unit.price > unit.cuttedPrice
                                                                    ? 'Current price must be less than or equal to cutted price'
                                                                    : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-600 mb-1">Minimum Quantity</label>
                                                            <input 
                                                                type="number" 
                                                                value={unit.minQty || ''}
                                                                onChange={(e) => handleUnitChange(index, 'minQty', e.target.value)}
                                                                min="0.01"
                                                                step="0.01"
                                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-600 mb-1">Increment</label>
                                                            <input 
                                                                type="number" 
                                                                value={unit.increment || ''}
                                                                onChange={(e) => handleUnitChange(index, 'increment', e.target.value)}
                                                                min="0.01"
                                                                step="0.01"
                                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-600 mb-1">Maximum Quantity</label>
                                                            <input 
                                                                type="number" 
                                                                value={unit.maxQty || ''}
                                                                onChange={(e) => handleUnitChange(index, 'maxQty', e.target.value)}
                                                                min={unit.minQty || "1"}
                                                                step="1"
                                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-slate-500">
                                            No units configured yet
                                        </div>
                                    )}
                                    <button 
                                        type="button" 
                                        onClick={addUnit}
                                        className="flex items-center gap-2 text-sm text-[#003366] hover:text-[#003366]/80"
                                    >
                                        <FiPlus className="w-5 h-5" />
                                        Add New Unit
                                    </button>
                                </div>
                            </div>
                            
                            {/* Section: Details */}
                            <div className="space-y-6 pt-6 border-t border-slate-200">
                                <div><label className="block text-sm font-medium text-slate-600">Highlights</label><div className="flex items-center gap-2 mt-1"><input type="text" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())} placeholder="Add a highlight and press Enter" className="flex-grow px-4 py-2.5 rounded-lg border border-slate-300"/><button type="button" onClick={addHighlight} className="px-4 py-2.5 bg-[#003366] text-white rounded-lg hover:bg-[#002244]"><FiPlus/></button></div><div className="flex flex-wrap gap-2 mt-2">{highlights.map((h, i) => (<div key={i} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm"><span>{h}</span><button type="button" onClick={() => removeHighlight(i)} className="text-slate-500 hover:text-red-500"><FiX size={16}/></button></div>))}</div></div>
                                <div><label className="block text-sm font-medium text-slate-600 mb-2">Specifications</label><div className="space-y-4">{specifications.map((spec, index) => (<div key={index} className="flex items-center gap-4"><input type="text" name="title" value={spec.title} onChange={(e) => handleSpecificationChange(index, e)} placeholder="Title (e.g., Color)" className="w-1/3 px-4 py-2.5 rounded-lg border border-slate-300"/><input type="text" name="description" value={spec.description} onChange={(e) => handleSpecificationChange(index, e)} placeholder="Description (e.g., Red)" className="flex-grow px-4 py-2.5 rounded-lg border border-slate-300"/><button type="button" onClick={() => removeSpecification(index)} className="text-slate-400 hover:text-red-500"><FiTrash2 size={18}/></button></div>))}<button type="button" onClick={addSpecification} className="flex items-center gap-2 text-[#003366] hover:text-[#002244] font-semibold mt-2"><FiPlus/> Add Specification</button></div></div>
                            </div>
                            
                            {/* Section: Images */}
                            <div className="space-y-2 pt-6 border-t border-slate-200"><label className="block text-sm font-medium text-slate-600">Images</label><div className="flex flex-wrap gap-4">{oldImages.map((image, index) => (<div key={image.public_id} className="relative w-28 h-28 group"><img src={image.url} alt="Old Preview" className="w-full h-full object-cover rounded-lg shadow-md"/><button type="button" onClick={() => removeImage(index, true)} className="absolute top-0 right-0 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><FiTrash2 size={16}/></button></div>))}{imagesPreview.map((image, index) => (<div key={index} className="relative w-28 h-28 group"><img src={image} alt="New Preview" className="w-full h-full object-cover rounded-lg shadow-md"/><button type="button" onClick={() => removeImage(index, false)} className="absolute top-0 right-0 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><FiX size={16}/></button></div>))}<label htmlFor="productImages" className="w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#003366] hover:bg-slate-50"><FiUpload className="text-slate-400"/><span className="text-xs text-slate-500 mt-1">Upload</span></label></div><input type="file" id="productImages" accept="image/*" multiple onChange={handleProductImageChange} className="hidden"/></div>
                            
                            {/* Action Button */}
                            <div className="pt-6 border-t border-slate-200">
                                <button type="submit" disabled={updateLoading} className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-[#003366] hover:bg-[#002244] transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
                                    {updateLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default UpdateProduct;