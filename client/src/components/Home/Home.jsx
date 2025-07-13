// import { useEffect } from 'react';
// import Categories from '../Layouts/Categories';
// import Banner from './Banner/Banner';
// import DealSlider from './DealSlider/DealSlider';
// import ProductSlider from './ProductSlider/ProductSlider';
// import { useDispatch, useSelector } from 'react-redux';
// import { clearErrors, getSliderProducts } from '../../actions/productAction';
// import { useSnackbar } from 'notistack';
// import MetaData from '../Layouts/MetaData';
// import Posters from './Posters/Posters';
// import CategorySlider from './CategorySlider/CategorySlider';
// import Poster from './Poster/Poster';
// import BrowsingHistory from './BrowsingHistory/BrowsingHistory';

// const Home = () => {

//   const dispatch = useDispatch();
//   const { enqueueSnackbar } = useSnackbar();

//   const { error, loading } = useSelector((state) => state.products);

//   useEffect(() => {
//     if (error) {
//       enqueueSnackbar(error, { variant: "error" });
//       dispatch(clearErrors());
//     }
//     dispatch(getSliderProducts());
//   }, [dispatch, error, enqueueSnackbar]);

//   return (
//     <>
//       <MetaData title="Online Shopping Site for Mobiles, Electronics, Furniture, Grocery, Lifestyle, Books & More. Best Offers!" />
//       {/* <Categories /> */}
//       <main className="flex flex-col gap-3 px-[65px] mt-16 sm:mt-10">
//         <Banner />
//         <DealSlider title={"Best Deals"} />
//         <Posters />
//         <CategorySlider />
//         <Poster />
//         {/* <BrowsingHistory /> */}
//         <CategorySlider />
//         {/* {!loading && <ProductSlider title={"Suggested for You"} tagline={"Based on Your Activity"} />}
//         <DealSlider title={"Top Brands, Best Price"} />
//         {!loading && <ProductSlider title={"You May Also Like..."} tagline={"Based on Your Interest"} />}
//         <DealSlider title={"Top Offers On"} />
//         {!loading && <ProductSlider title={"Don't Miss These!"} tagline={"Inspired by your order"} />} */}
//       </main>
//     </>
//   );
// };

// export default Home;

import { useEffect } from 'react';
import Categories from '../Layouts/Categories';
import Banner from './Banner/Banner';
import DealSlider from './DealSlider/DealSlider';
import ProductSlider from './ProductSlider/ProductSlider';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getSliderProducts } from '../../actions/productAction';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import Posters from './Posters/Posters';
import CategorySlider from './CategorySlider/CategorySlider';
import Poster from './Poster/Poster';
import BrowsingHistory from './BrowsingHistory/BrowsingHistory';

const Home = () => {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { error, loading } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getSliderProducts());
  }, [dispatch, error, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Online Shopping Site for Mobiles, Electronics, Furniture, Grocery, Lifestyle, Books & More. Best Offers!" />
      {/* <Categories /> */}
      <main className="flex flex-col gap-3 px-4 sm:px-6 lg:px-[48px] mt-8 sm:mt-10">
        <Banner />
        <DealSlider title={"Best Deals"} />
        <Posters />
        <CategorySlider />
        <Poster />
        {/* <BrowsingHistory /> */}
        <CategorySlider />
        {/* {!loading && <ProductSlider title={"Suggested for You"} tagline={"Based on Your Activity"} />}
        <DealSlider title={"Top Brands, Best Price"} />
        {!loading && <ProductSlider title={"You May Also Like..."} tagline={"Based on Your Interest"} />}
        <DealSlider title={"Top Offers On"} />
        {!loading && <ProductSlider title={"Don't Miss These!"} tagline={"Inspired by your order"} />} */}
      </main>
    </>
  );
};

export default Home;