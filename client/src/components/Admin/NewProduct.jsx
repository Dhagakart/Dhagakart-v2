import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import { NEW_PRODUCT_RESET } from '../../constants/productConstants';
import { createProduct, clearErrors } from '../../actions/productAction';
import { categories } from '../../utils/constants';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';

const ProductDetails = ({ name, setName, description, setDescription, price, setPrice, cuttedPrice, setCuttedPrice, category, setCategory, subCategory, setSubCategory, availableSubcategories, stock, setStock, warranty, setWarranty }) => (
  <div className="flex flex-col gap-4">
    <TextField
      label="Name"
      variant="outlined"
      size="small"
      required
      value={name}
      onChange={(e) => setName(e.target.value)}
      sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#003366' }, '&.Mui-focused fieldset': { borderColor: '#003366' } } }}
    />
    <TextField
      label="Description"
      multiline
      rows={3}
      required
      variant="outlined"
      size="small"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#003366' }, '&.Mui-focused fieldset': { borderColor: '#003366' } } }}
    />
    <div className="grid grid-cols-2 gap-4">
      <TextField
        label="Price"
        type="number"
        variant="outlined"
        size="small"
        InputProps={{ inputProps: { min: 0 } }}
        required
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#003366' }, '&.Mui-focused fieldset': { borderColor: '#003366' } } }}
      />
      <TextField
        label="Cutted Price"
        type="number"
        variant="outlined"
        size="small"
        InputProps={{ inputProps: { min: 0 } }}
        required
        value={cuttedPrice}
        onChange={(e) => setCuttedPrice(e.target.value)}
        sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#003366' }, '&.Mui-focused fieldset': { borderColor: '#003366' } } }}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <TextField
        label="Category"
        select
        fullWidth
        variant="outlined"
        size="small"
        required
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#003366' }, '&.Mui-focused fieldset': { borderColor: '#003366' } } }}
      >
        <MenuItem value="">Select Category</MenuItem>
        {categories.map((category, i) => (
          <MenuItem value={category.name} key={i}>{category.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Sub Category"
        select
        fullWidth
        variant="outlined"
        size="small"
        required
        disabled={!category}
        value={subCategory}
        onChange={(e) => setSubCategory(e.target.value)}
        sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#003366' }, '&.Mui-focused fieldset': { borderColor: '#003366' } } }}
      >
        <MenuItem value="">Select Subcategory</MenuItem>
        {availableSubcategories.map((subCat, i) => (
          <MenuItem value={subCat} key={i}>{subCat}</MenuItem>
        ))}
      </TextField>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <TextField
        label="Stock"
        type="number"
        variant="outlined"
        size="small"
        InputProps={{ inputProps: { min: 0 } }}
        required
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#003366' }, '&.Mui-focused fieldset': { borderColor: '#003366' } } }}
      />
      <TextField
        label="Warranty"
        type="number"
        variant="outlined"
        size="small"
        InputProps={{ inputProps: { min: 0 } }}
        required
        value={warranty}
        onChange={(e) => setWarranty(e.target.value)}
        sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#003366' }, '&.Mui-focused fieldset': { borderColor: '#003366' } } }}
      />
    </div>
  </div>
);

const HighlightsSection = ({ highlights, setHighlights, highlightInput, setHighlightInput }) => {
  const addHighlight = () => {
    if (!highlightInput.trim()) return;
    setHighlights([...highlights, highlightInput]);
    setHighlightInput("");
  };

  const deleteHighlight = (index) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-[#003366]">Highlights</h2>
      <div className="flex items-center border border-[#004080] rounded-lg">
        <input
          value={highlightInput}
          onChange={(e) => setHighlightInput(e.target.value)}
          type="text"
          placeholder="Add Highlight"
          className="px-3 py-2 flex-1 outline-none border-none"
        />
        <button onClick={addHighlight} className="py-2 px-6 bg-[#003366] text-white rounded-r-lg hover:bg-[#002244] transition-colors">
          Add
        </button>
      </div>
      <div className="flex flex-col gap-1.5">
        {highlights.map((h, i) => (
          <div key={i} className="flex justify-between items-center py-1.5 px-3 bg-[#F5F6F5] rounded-lg">
            <p className="text-sm font-medium text-[#003366]">{h}</p>
            <button onClick={() => deleteHighlight(i)} className="text-[#B91C1C] hover:bg-[#FEE2E2] p-1 rounded-full">
              <DeleteIcon fontSize="small" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const BrandSection = ({ brand, setBrand, logo, setLogo, logoPreview, setLogoPreview }) => {
  const handleLogoChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setLogoPreview(reader.result);
        setLogo(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-[#003366]">Brand Details</h2>
      <div className="grid grid-cols-3 gap-4 items-center">
        <TextField
          label="Brand"
          type="text"
          variant="outlined"
          size="small"
          required
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#003366' }, '&.Mui-focused fieldset': { borderColor: '#003366' } } }}
        />
        <div className="w-20 h-20 flex items-center justify-center border border-[#004080] rounded-lg">
          {!logoPreview ? <ImageIcon className="text-[#003366]" /> : (
            <img draggable="false" src={logoPreview} alt="Brand Logo" className="w-full h-full object-contain rounded-lg" />
          )}
        </div>
        <label className="flex items-center justify-center bg-[#003366] text-white rounded-lg py-2 px-4 cursor-pointer hover:bg-[#002244] transition-colors">
          <input type="file" name="logo" accept="image/*" onChange={handleLogoChange} className="hidden" />
          Choose Logo
        </label>
      </div>
    </div>
  );
};

const SpecificationsSection = ({ specs, setSpecs, specsInput, setSpecsInput }) => {
  const handleSpecsChange = (e) => {
    setSpecsInput({ ...specsInput, [e.target.name]: e.target.value });
  };

  const addSpecs = () => {
    if (!specsInput.title.trim() || !specsInput.description.trim()) return;
    setSpecs([...specs, specsInput]);
    setSpecsInput({ title: "", description: "" });
  };

  const deleteSpec = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-[#003366]">Specifications</h2>
      <div className="grid grid-cols-3 gap-4 items-center">
        <TextField
          value={specsInput.title}
          onChange={handleSpecsChange}
          name="title"
          label="Name"
          placeholder="Model No"
          variant="outlined"
          size="small"
          sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#003366' }, '&.Mui-focused fieldset': { borderColor: '#003366' } } }}
        />
        <TextField
          value={specsInput.description}
          onChange={handleSpecsChange}
          name="description"
          label="Description"
          placeholder="WJDK42DF5"
          variant="outlined"
          size="small"
          sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#003366' }, '&.Mui-focused fieldset': { borderColor: '#003366' } } }}
        />
        <button onClick={addSpecs} className="py-2 px-6 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors">
          Add
        </button>
      </div>
      <div className="flex flex-col gap-1.5">
        {specs.map((spec, i) => (
          <div key={i} className="flex justify-between items-center py-1.5 px-3 bg-[#F5F6F5] rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium text-[#0059B3]">{spec.title}</p>
              <p className="text-sm text-[#003366]">{spec.description}</p>
            </div>
            <button onClick={() => deleteSpec(i)} className="text-[#B91C1C] hover:bg-[#FEE2E2] p-1 rounded-full">
              <DeleteIcon fontSize="small" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ImagesSection = ({ images, setImages, imagesPreview, setImagesPreview }) => {
  const handleProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);
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

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-[#003366]">Product Images</h2>
      <div className="flex gap-2 overflow-x-auto h-32 border border-[#004080] rounded-lg p-2">
        {imagesPreview.map((image, i) => (
          <img key={i} draggable="false" src={image} alt="Product" className="h-full w-24 object-contain rounded" />
        ))}
      </div>
      <label className="flex items-center justify-center bg-[#003366] text-white rounded-lg py-2 px-4 cursor-pointer hover:bg-[#002244] transition-colors">
        <input type="file" name="images" accept="image/*" multiple onChange={handleProductImageChange} className="hidden" />
        Choose Files
      </label>
    </div>
  );
};

const NewProduct = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.newProduct);

  const [highlights, setHighlights] = useState([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [specs, setSpecs] = useState([]);
  const [specsInput, setSpecsInput] = useState({ title: "", description: "" });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [cuttedPrice, setCuttedPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [stock, setStock] = useState(0);
  const [warranty, setWarranty] = useState(0);
  const [brand, setBrand] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [logo, setLogo] = useState("");
  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
    if (category) {
      const selectedCategory = categories.find((cat) => cat.name === category);
      setAvailableSubcategories(selectedCategory?.subcategories || []);
      setSubCategory("");
    } else {
      setAvailableSubcategories([]);
      setSubCategory("");
    }
  }, [category]);

  const newProductSubmitHandler = (e) => {
    e.preventDefault();
    if (highlights.length <= 0) {
      enqueueSnackbar("Add Highlights", { variant: "warning" });
      return;
    }
    if (!logo) {
      enqueueSnackbar("Add Brand Logo", { variant: "warning" });
      return;
    }
    if (specs.length <= 1) {
      enqueueSnackbar("Add Minimum 2 Specifications", { variant: "warning" });
      return;
    }
    if (images.length <= 0) {
      enqueueSnackbar("Add Product Images", { variant: "warning" });
      return;
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("description", description);
    formData.set("price", price);
    formData.set("cuttedPrice", cuttedPrice);
    formData.set("category", category);
    formData.set("subCategory", subCategory);
    formData.set("stock", stock);
    formData.set("warranty", warranty);
    formData.set("brandname", brand);
    formData.set("logo", logo);
    images.forEach((image) => formData.append("images", image));
    highlights.forEach((h) => formData.append("highlights", h));
    specs.forEach((s) => formData.append("specifications", JSON.stringify(s)));

    dispatch(createProduct(formData));
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar("Product Created", { variant: "success" });
      dispatch({ type: NEW_PRODUCT_RESET });
      navigate("/admin/products");
    }
  }, [dispatch, error, success, navigate, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Admin: New Product | DhagaKart" />
      {loading && <BackdropLoader />}
      <div className="w-full mx-auto">
        <form onSubmit={newProductSubmitHandler} encType="multipart/form-data" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <ProductDetails
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              price={price}
              setPrice={setPrice}
              cuttedPrice={cuttedPrice}
              setCuttedPrice={setCuttedPrice}
              category={category}
              setCategory={setCategory}
              subCategory={subCategory}
              setSubCategory={setSubCategory}
              availableSubcategories={availableSubcategories}
              stock={stock}
              setStock={setStock}
              warranty={warranty}
              setWarranty={setWarranty}
            />
            <HighlightsSection
              highlights={highlights}
              setHighlights={setHighlights}
              highlightInput={highlightInput}
              setHighlightInput={setHighlightInput}
            />
            <BrandSection
              brand={brand}
              setBrand={setBrand}
              logo={logo}
              setLogo={setLogo}
              logoPreview={logoPreview}
              setLogoPreview={setLogoPreview}
            />
          </div>
          <div className="flex flex-col gap-6">
            <SpecificationsSection
              specs={specs}
              setSpecs={setSpecs}
              specsInput={specsInput}
              setSpecsInput={setSpecsInput}
            />
            <ImagesSection
              images={images}
              setImages={setImages}
              imagesPreview={imagesPreview}
              setImagesPreview={setImagesPreview}
            />
            <div className="flex justify-end">
              <button type="submit" className="w-full lg:w-1/3 py-3 bg-[#003366] text-white font-medium rounded-lg hover:bg-[#002244] transition-colors">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewProduct;