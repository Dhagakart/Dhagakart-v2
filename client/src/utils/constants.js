import Tex from './2_ply_purani_tex.jpg';
import Flora from './flora_zari_thread.jpg';
import Jack from './jack_a2b.jpg';
import Mulberry from './mulberry_raw_silk_yarn.jpg';
import Golden from './pure_golden_zari_thread.jpg';
import Tussar from './tussar_raw_silk_yarn.jpg';

// Categories with Subcategories
export const categories = [
    {
        name: "Electronics",
        subcategories: ["Smartphones", "Headphones", "Speakers", "Smart Watches", "Cameras"]
    },
    {
        name: "Mobiles",
        subcategories: ["Smartphones", "Feature Phones", "Refurbished Phones", "Accessories"]
    },
    {
        name: "Laptops",
        subcategories: ["Gaming Laptops", "Ultrabooks", "Business Laptops", "2-in-1 Laptops"]
    },
    {
        name: "Fashion",
        subcategories: ["Men's Fashion", "Women's Fashion", "Kid's Fashion", "Footwear", "Watches"]
    },
    {
        name: "Appliances",
        subcategories: ["Televisions", "Refrigerators", "Washing Machines", "Air Conditioners"]
    },
    {
        name: "Home",
        subcategories: ["Furniture", "Kitchen & Dining", "Home Decor", "Lighting", "Bath"]
    }
];

// Product Sliders Offers
export const offerProducts = [
    {
        image: Tex,
        name: "2 ply Purani Tex",
        // description: "Bose Sport Earbuds - Wireless Earphones with Bluetooth 5.1",
        currentPrice: "2,300",
        originalPrice: "4,000",
        discount: 43, // Calculated: Math.round((1 - 2300 / 4000) * 100)
        tag: "Best Seller"
      },
      {
        image: Flora,
        name: "Flora Zari Thread",
        // description: "Apple AirPods Pro (2nd Gen) with MagSafe Case",
        currentPrice: "19,999",
        originalPrice: "24,900",
        discount: 20, // Matches original data, close to calculated 19.68%
        tag: "Trending"
      },
      {
        image: Jack,
        name: "Jack A2B",
        // description: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
        currentPrice: "22,990",
        originalPrice: "29,990",
        discount: 23, // Matches original data, close to calculated 23.34%
        tag: "Limited Deal"
      },
      {
        image: Mulberry,
        name: "Mulberry Raw Silk Yarn",
        // description: "Samsung Galaxy Buds2 Pro True Wireless Earbuds",
        currentPrice: "14,990",
        originalPrice: "19,990",
        discount: 25, // Matches original data, close to calculated 25.01%
        tag: "New Launch"
      },
      {
        image: Golden,
        name: "Pure Golden Zari Thread",
        // description: "Samsung Galaxy Watch 5",
        currentPrice: "17,999",
        originalPrice: "29,998",
        discount: 40, // Reflects original "Min 40% Off"
        tag: "Discover Now"
      },
      {
        image: Tussar,
        name: "Tussar Raw Silk Yarn",
        // description: "Manfrotto Compact Action Tripod",
        currentPrice: "2,499",
        originalPrice: "4,998",
        discount: 50, // Reflects original "Min 50% Off"
        tag: "Great Savings"
      }
]