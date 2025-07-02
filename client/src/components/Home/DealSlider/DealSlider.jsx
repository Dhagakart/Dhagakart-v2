import Product from "./Product";
import Slider from "react-slick";
import { NextBtn, PreviousBtn } from "../Banner/Banner";
import { Link } from "react-router-dom";
import { offerProducts } from "../../../utils/constants";
import { getRandomProducts } from "../../../utils/functions";

export const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 5,
  swipe: false,
  prevArrow: <PreviousBtn />,
  nextArrow: <NextBtn />,
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 4, slidesToScroll: 4 } },
    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
    { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

const DealSlider = ({ title }) => {
  const itemsToShow = offerProducts.slice(0, 6); // Get first 6 products

  return (
    <section className="bg-white w-full overflow-hidden pb-4">
      <div className="flex py-3 justify-between items-center">
        <h1 className="text-xl font-medium text-gray-800">{title}</h1>
        <Link
          to="/products"
          className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center"
        >
          Browse ALL Product <span className="ml-1">→</span>
        </Link>
      </div>
      <div>
        <Slider {...settings}>
          {itemsToShow.map((item) => {
            const currentPrice = typeof item.currentPrice === "string"
              ? parseInt(item.currentPrice.replace(/,/g, ""), 10)
              : item.currentPrice;
            const originalPrice = typeof item.originalPrice === "string"
              ? parseInt(item.originalPrice.replace(/,/g, ""), 10)
              : item.originalPrice;
            return (
              <div key={item._id || item.name} className="py-1">
                <Product
                  _id={item._id}
                  name={item.name}
                  description={item.description}
                  image={item.image}  // Pass the image directly
                  currentPrice={currentPrice}
                  originalPrice={originalPrice}
                  discount={item.discount}
                  link='/product/6862c4bb5235d86a799dc67d'
                />
              </div>
            );
          })}
        </Slider>
      </div>
    </section>
  );
};

export default DealSlider;