import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getProductDetails, updateProduct, clearErrors } from '../../actions/productAction';
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants';

const UpdateProduct = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { id } = useParams();

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
    const [specifications, setSpecifications] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [logo, setLogo] = useState("");
    const [logoPreview, setLogoPreview] = useState("");

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
                setSpecifications(product.specifications || []);
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
            // Add to removed images if it's an old image
            setRemovedImages(prev => [...prev, imageUrl]);
            // Remove from old images preview
            setOldImages(oldImages.filter((_, i) => i !== index));
        } else {
            // Remove from new images preview and state
            const newImagesPreview = [...imagesPreview];
            newImagesPreview.splice(index, 1);
            setImagesPreview(newImagesPreview);
            
            const newImages = [...images];
            newImages.splice(index, 1);
            setImages(newImages);
        }
    };

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
        
        // Add specifications
        specifications.forEach((s) => {
            formData.append("specifications", JSON.stringify(s));
        });
        
        // Add new images
        images.forEach((image) => {
            formData.append("images", image);
        });
        
        // Add removed images
        removedImages.forEach((img) => {
            formData.append("imagesToRemove", img);
        });
        
        // Add logo if updated
        if (logo) {
            formData.append("logo", logo);
        }

        dispatch(updateProduct(id, formData));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Update Product</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    {/* Cutted Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cutted Price</label>
                        <input
                            type="number"
                            value={cuttedPrice}
                            onChange={(e) => setCuttedPrice(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    {/* Warranty */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Warranty (months)</label>
                        <input
                            type="number"
                            value={warranty}
                            onChange={(e) => setWarranty(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Brand Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                        <input
                            type="text"
                            value={brandname}
                            onChange={(e) => setBrandname(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    {/* Highlights */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Highlights</label>
                        <div className="space-y-2">
                            {highlights.map((h, i) => (
                                <div key={i} className="flex items-center">
                                    <span className="mr-2">•</span>
                                    <input
                                        type="text"
                                        value={h}
                                        onChange={(e) => {
                                            const newHighlights = [...highlights];
                                            newHighlights[i] = e.target.value;
                                            setHighlights(newHighlights);
                                        }}
                                        className="flex-1 p-2 border rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newHighlights = [...highlights];
                                            newHighlights.splice(i, 1);
                                            setHighlights(newHighlights);
                                        }}
                                        className="ml-2 text-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setHighlights([...highlights, ""])}
                                className="mt-2 text-sm text-blue-600"
                            >
                                + Add Highlight
                            </button>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
                        <div className="space-y-4">
                            {specifications.map((spec, i) => (
                                <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={spec.title}
                                            onChange={(e) => {
                                                const newSpecs = [...specifications];
                                                newSpecs[i].title = e.target.value;
                                                setSpecifications(newSpecs);
                                            }}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Description</label>
                                        <input
                                            type="text"
                                            value={spec.description}
                                            onChange={(e) => {
                                                const newSpecs = [...specifications];
                                                newSpecs[i].description = e.target.value;
                                                setSpecifications(newSpecs);
                                            }}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newSpecs = [...specifications];
                                            newSpecs.splice(i, 1);
                                            setSpecifications(newSpecs);
                                        }}
                                        className="text-red-500 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setSpecifications([...specifications, { title: "", description: "" }])}
                                className="mt-2 text-sm text-blue-600"
                            >
                                + Add Specification
                            </button>
                        </div>
                    </div>

                    {/* Logo Upload */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand Logo</label>
                        <div className="flex items-center space-x-4">
                            {logoPreview && (
                                <div className="relative">
                                    <img 
                                        src={logoPreview} 
                                        alt="Logo Preview" 
                                        className="h-16 w-16 object-contain"
                                    />
                                </div>
                            )}
                            <label className="flex items-center justify-center h-16 w-16 border-2 border-dashed rounded cursor-pointer">
                                <input
                                    type="file"
                                    name="logo"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                />
                                <span className="text-2xl">+</span>
                            </label>
                        </div>
                    </div>

                    {/* Product Images */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                        <div className="flex flex-wrap gap-4">
                            {/* Existing Images */}
                            {oldImages.map((image, i) => (
                                <div key={`old-${i}`} className="relative">
                                    <img 
                                        src={image.url} 
                                        alt={`Product ${i}`} 
                                        className="h-24 w-24 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i, true, image.url)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            
                            {/* New Images */}
                            {imagesPreview.map((image, i) => (
                                <div key={`new-${i}`} className="relative">
                                    <img 
                                        src={image} 
                                        alt={`New Product ${i}`} 
                                        className="h-24 w-24 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i, false)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            
                            {/* Add Image Button */}
                            <label className="flex items-center justify-center h-24 w-24 border-2 border-dashed rounded cursor-pointer">
                                <input
                                    type="file"
                                    name="images"
                                    accept="image/*"
                                    multiple
                                    onChange={handleProductImageChange}
                                    className="hidden"
                                />
                                <span className="text-2xl">+</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        disabled={updateLoading}
                    >
                        {updateLoading ? 'Updating...' : 'Update Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProduct;