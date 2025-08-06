import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getProductDetails, updateProduct, clearErrors } from '../../actions/productAction';
import { categories as categoriesData } from '../../utils/constants';
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants';
import { FiUpload, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { TextField, MenuItem, Switch, Typography, Collapse } from '@mui/material';
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

    // --- State for sample config ---
    const [isSampleAvailable, setIsSampleAvailable] = useState(false);
    const [samplePrice, setSamplePrice] = useState(0);
    const [maxSampleQuantity, setMaxSampleQuantity] = useState(1);

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
            
            if (product.sampleConfig) {
                setIsSampleAvailable(product.sampleConfig.isSampleAvailable || false);
                setSamplePrice(product.sampleConfig.price || 0);
                setMaxSampleQuantity(product.sampleConfig.maxQuantity || 1);
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

        if (field === 'price' || field === 'cuttedPrice') {
            const numValue = Number(value);
            if (!isNaN(numValue) && numValue >= 0.01) {
                value = numValue;
            } else if (value === '') {
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
        
        if (field === 'isDefault' && value) {
            updatedUnits.forEach((unit, i) => {
                if (i !== index) {
                    unit.isDefault = false;
                }
            });
        }
        
        if (field === 'price' || field === 'cuttedPrice') {
            const unit = updatedUnits[index];
            if (unit.price && unit.cuttedPrice) {
                const priceNum = Number(unit.price);
                const cuttedPriceNum = Number(unit.cuttedPrice);
                if (!isNaN(priceNum) && !isNaN(cuttedPriceNum) && priceNum > cuttedPriceNum) {
                    enqueueSnackbar('Current price must be less than or equal to cutted price', { variant: 'error' });
                }
            }
        }
        
        setOrderConfig({ units: updatedUnits });
    };

    const addUnit = () => {
        if (!orderConfig || !Array.isArray(orderConfig.units)) {
            setOrderConfig({
                units: [{ unit: 'unit', minQty: 1, increment: 1, maxQty: 25, isDefault: true }]
            });
            return;
        }
        setOrderConfig({
            units: [...orderConfig.units, { unit: 'unit', minQty: 1, increment: 1, maxQty: 25, isDefault: false }]
        });
    };

    const removeUnit = (index) => {
        if (!orderConfig?.units) return;
        const updatedUnits = [...orderConfig.units];
        if (index >= updatedUnits.length) return;
        updatedUnits.splice(index, 1);
        
        if (updatedUnits.length === 0) {
            updatedUnits.push({ unit: 'unit', minQty: 1, increment: 1, maxQty: 25, isDefault: true });
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
        formData.set("price", Number(price));
        formData.set("description", description);
        formData.set("category", category);
        formData.set("subCategory", subCategory);
        formData.set("stock", Number(stock));
        formData.set("warranty", Number(warranty));
        formData.set("cuttedPrice", Number(cuttedPrice));

        images.forEach(image => formData.append("images", image));
        if (removedImages.length > 0) {
            removedImages.forEach(id => formData.append("removedImages", id));
        }

        // --- FIX: Create and append the sampleConfig object ---
        const sampleConfig = {
            isSampleAvailable,
            price: Number(samplePrice) || 0,
            maxQuantity: Number(maxSampleQuantity) || 1,
        };
        formData.set("sampleConfig", JSON.stringify(sampleConfig));
        // ----------------------------------------------------

        const updatedOrderConfig = { ...orderConfig };
        if (updatedOrderConfig?.units) {
            updatedOrderConfig.units.forEach(unit => {
                unit.price = Number(unit.price) || 0;
                unit.cuttedPrice = Number(unit.cuttedPrice) || 0;
                if (unit.price > unit.cuttedPrice) unit.cuttedPrice = unit.price;
                unit.unit = unit.unit || 'unit';
                unit.minQty = Number(unit.minQty) || 1;
                unit.increment = Number(unit.increment) || 1;
                unit.maxQty = Number(unit.maxQty) || 25;
                unit.isDefault = Boolean(unit.isDefault);
            });
        }
        formData.set("orderConfig", JSON.stringify(updatedOrderConfig));
        
        const validSpecs = specifications.filter(spec => spec.title && spec.description);
        formData.set("specifications", JSON.stringify(validSpecs));
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
                            
                            <div className="pb-6 border-b border-slate-200">
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Update Product</h1>
                                <p className="text-slate-500 mt-1">Manage and update product details.</p>
                            </div>

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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-6 border-t border-slate-200">
                                <div><label className="block text-sm font-medium text-slate-600 mb-1">Stock</label><input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300"/></div>
                                <div><label className="block text-sm font-medium text-slate-600 mb-1">Warranty (Months)</label><input type="number" value={warranty} onChange={(e) => setWarranty(Number(e.target.value))} min="0" required className="w-full px-4 py-2.5 rounded-lg border border-slate-300"/></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-6 border-t border-slate-200">
                                <div><label className="block text-sm font-medium text-slate-600 mb-1">Category</label><select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white"><option value="">Select Category</option>{categoriesData.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}</select></div>
                                <div><label className="block text-sm font-medium text-slate-600 mb-1">Subcategory</label><select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} disabled={subcategories.length === 0} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white"><option value="">Select Subcategory</option>{subcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}</select></div>
                            </div>
                            
                            <div className="pt-6 border-t border-slate-200">
                                <div className="flex items-center justify-between">
                                    <Typography variant="h6" sx={{fontSize: "1.25rem", fontWeight: 600}}>Sample Options</Typography>
                                    <Switch
                                        checked={isSampleAvailable}
                                        onChange={(e) => setIsSampleAvailable(e.target.checked)}
                                        name="isSampleAvailable"
                                        color="primary"
                                    />
                                </div>
                                <Collapse in={isSampleAvailable}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <TextField label="Sample Price (₹)" type="number" variant="outlined" size="small" InputProps={{ inputProps: { min: 0 } }} required={isSampleAvailable} value={samplePrice} onChange={(e) => setSamplePrice(e.target.value)} />
                                        <TextField label="Max Sample Quantity" type="number" variant="outlined" size="small" InputProps={{ inputProps: { min: 1 } }} required={isSampleAvailable} value={maxSampleQuantity} onChange={(e) => setMaxSampleQuantity(e.target.value)} />
                                    </div>
                                </Collapse>
                            </div>
                            
                            <div className="space-y-6 pt-6 border-t border-slate-200">
                                <h2 className="text-xl font-semibold text-slate-800">Order Configuration</h2>
                                <div className="space-y-4">
                                    {orderConfig?.units?.map((unit, index) => (
                                        <div key={index} className="border rounded-lg p-4 bg-white shadow-sm relative">
                                            <h3 className="text-lg font-medium text-slate-700 mb-4">Unit {index + 1}</h3>
                                            <button type="button" onClick={() => removeUnit(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-600"><FiX className="w-5 h-5" /></button>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <TextField label="Unit Name" value={unit.unit || ''} onChange={(e) => handleUnitChange(index, 'unit', e.target.value)} placeholder="e.g., kg, box" fullWidth />
                                                    <div className="flex items-center"><Switch checked={unit.isDefault} onChange={(e) => handleUnitChange(index, 'isDefault', e.target.checked)} /><label className="text-sm">Default Unit</label></div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <TextField label="Price (₹)" type="number" value={unit.price || ''} onChange={(e) => handleUnitChange(index, 'price', e.target.value)} fullWidth />
                                                    <TextField label="Cutted Price (₹)" type="number" value={unit.cuttedPrice || ''} onChange={(e) => handleUnitChange(index, 'cuttedPrice', e.target.value)} fullWidth />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <TextField label="Min Quantity" type="number" value={unit.minQty || ''} onChange={(e) => handleUnitChange(index, 'minQty', e.target.value)} fullWidth />
                                                    <TextField label="Increment" type="number" value={unit.increment || ''} onChange={(e) => handleUnitChange(index, 'increment', e.target.value)} fullWidth />
                                                    <TextField label="Max Quantity" type="number" value={unit.maxQty || ''} onChange={(e) => handleUnitChange(index, 'maxQty', e.target.value)} fullWidth />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addUnit} className="flex items-center gap-2 text-sm text-[#003366] hover:text-[#003366]/80"><FiPlus /> Add New Unit</button>
                                </div>
                            </div>
                            
                            <div className="space-y-6 pt-6 border-t border-slate-200">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Highlights</label>
                                    <div className="flex items-center gap-2">
                                        <input type="text" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())} placeholder="Add a highlight and press Enter" className="flex-grow px-4 py-2.5 rounded-lg border border-slate-300"/>
                                        <button type="button" onClick={addHighlight} className="px-4 py-2.5 bg-[#003366] text-white rounded-lg hover:bg-[#002244]"><FiPlus/></button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">{highlights.map((h, i) => (<div key={i} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm"><span>{h}</span><button type="button" onClick={() => removeHighlight(i)} className="text-slate-500 hover:text-red-500"><FiX size={16}/></button></div>))}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Specifications</label>
                                    <div className="space-y-4">
                                        {specifications.map((spec, index) => (<div key={index} className="flex items-center gap-4"><input type="text" name="title" value={spec.title} onChange={(e) => handleSpecificationChange(index, e)} placeholder="Title (e.g., Color)" className="w-1/3 px-4 py-2.5 rounded-lg border border-slate-300"/><input type="text" name="description" value={spec.description} onChange={(e) => handleSpecificationChange(index, e)} placeholder="Description (e.g., Red)" className="flex-grow px-4 py-2.5 rounded-lg border border-slate-300"/><button type="button" onClick={() => removeSpecification(index)} className="text-slate-400 hover:text-red-500"><FiTrash2 size={18}/></button></div>))}
                                        <button type="button" onClick={addSpecification} className="flex items-center gap-2 text-[#003366] hover:text-[#002244] font-semibold mt-2"><FiPlus/> Add Specification</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2 pt-6 border-t border-slate-200">
                                <label className="block text-sm font-medium text-slate-600">Images</label>
                                <div className="flex flex-wrap gap-4">
                                    {oldImages.map((image, index) => (<div key={image.public_id} className="relative w-28 h-28 group"><img src={image.url} alt="Old Preview" className="w-full h-full object-cover rounded-lg shadow-md"/><button type="button" onClick={() => removeImage(index, true)} className="absolute top-0 right-0 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><FiTrash2 size={16}/></button></div>))}
                                    {imagesPreview.map((image, index) => (<div key={index} className="relative w-28 h-28 group"><img src={image} alt="New Preview" className="w-full h-full object-cover rounded-lg shadow-md"/><button type="button" onClick={() => removeImage(index, false)} className="absolute top-0 right-0 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><FiX size={16}/></button></div>))}
                                    <label htmlFor="productImages" className="w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#003366] hover:bg-slate-50"><FiUpload className="text-slate-400"/><span className="text-xs text-slate-500 mt-1">Upload</span></label>
                                </div>
                                <input type="file" id="productImages" accept="image/*" multiple onChange={handleProductImageChange} className="hidden"/>
                            </div>
                            
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
