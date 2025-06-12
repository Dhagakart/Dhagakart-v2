import Image from './image.png'

// Categories Used In Entire App
export const categories = [
    "Electronics",
    "Mobiles",
    "Laptops",
    "Fashion",
    "Appliances",
    "Home",
];

// Product Sliders Offers
export const offerProducts = [
    {
        image: Image,
        name: "Bose Sport Earbuds - Wireless Earphones with Bluetooth 5.1",
        description: "Bose Sport Earbuds - Wireless Earphones with Bluetooth 5.1",
        currentPrice: "2,300",
        originalPrice: "4,000",
        discount: 43, // Calculated: Math.round((1 - 2300 / 4000) * 100)
        tag: "Best Seller"
      },
      {
        image: Image,
        name: "Apple AirPods Pro (2nd Gen) with MagSafe Case",
        description: "Apple AirPods Pro (2nd Gen) with MagSafe Case",
        currentPrice: "19,999",
        originalPrice: "24,900",
        discount: 20, // Matches original data, close to calculated 19.68%
        tag: "Trending"
      },
      {
        image: Image,
        name: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
        description: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
        currentPrice: "22,990",
        originalPrice: "29,990",
        discount: 23, // Matches original data, close to calculated 23.34%
        tag: "Limited Deal"
      },
      {
        image: Image,
        name: "Samsung Galaxy Buds2 Pro True Wireless Earbuds",
        description: "Samsung Galaxy Buds2 Pro True Wireless Earbuds",
        currentPrice: "14,990",
        originalPrice: "19,990",
        discount: 25, // Matches original data, close to calculated 25.01%
        tag: "New Launch"
      },
      {
        image: Image,
        name: "Samsung Galaxy Watch 5",
        description: "Samsung Galaxy Watch 5",
        currentPrice: "17,999",
        originalPrice: "29,998",
        discount: 40, // Reflects original "Min 40% Off"
        tag: "Discover Now"
      },
      {
        image: Image,
        name: "Manfrotto Compact Action Tripod",
        description: "Manfrotto Compact Action Tripod",
        currentPrice: "2,499",
        originalPrice: "4,998",
        discount: 50, // Reflects original "Min 50% Off"
        tag: "Great Savings"
      },
      {
        image: Image,
        name: "Nike Air Zoom Pegasus 38",
        description: "Nike Air Zoom Pegasus 38",
        currentPrice: "5,999",
        originalPrice: "9,998",
        discount: 40, // Reflects original "Upto 40% Off"
        tag: "Buy Now"
      },
      {
        image: Image,
        name: "Himalaya Ashvagandha Tablets",
        description: "Himalaya Ashvagandha Tablets",
        currentPrice: "149",
        originalPrice: "298",
        discount: 50, // Reflects original "Upto 50% Off"
        tag: "Great Savings"
      },
      {
        image: Image,
        name: "JBL Tune 510BT Wireless Headphones",
        description: "JBL Tune 510BT Wireless Headphones",
        currentPrice: "1,999",
        originalPrice: "4,998",
        discount: 60, // Reflects original "Min 60% Off"
        tag: "Grab Now"
      },
      {
        image: Image,
        name: "Wildcraft 45 Ltrs Trekking Backpack",
        description: "Wildcraft 45 Ltrs Trekking Backpack",
        currentPrice: "1,749",
        originalPrice: "2,498",
        discount: 30, // Reflects original "Upto 30% Off"
        tag: "Discover Now"
      },
      {
        image: Image,
        name: "LG 1.5 Ton 5 Star Inverter Split AC",
        description: "LG 1.5 Ton 5 Star Inverter Split AC",
        currentPrice: "39,999",
        originalPrice: "49,998",
        discount: 20, // Reflects original "Min 20% Off"
        tag: "Shop Now"
      },
      {
        image: Image,
        name: "Titan Neo Analog Watch",
        description: "Titan Neo Analog Watch",
        currentPrice: "1,999",
        originalPrice: "7,996",
        discount: 75, // Reflects original "Upto 75% Off"
        tag: "Grab Now"
      },
      {
        image: Image,
        name: "Anker PowerLine+ II USB-C Cable",
        description: "Anker PowerLine+ II USB-C Cable",
        currentPrice: "499",
        originalPrice: "998",
        discount: 50, // Reflects original "Min 50% Off"
        tag: "Explore Now"
      },
      {
        image: Image,
        name: "Wooden Street 3 Seater Fabric Sofa",
        description: "Wooden Street 3 Seater Fabric Sofa",
        currentPrice: "19,999",
        originalPrice: "39,998",
        discount: 50, // Reflects original "Min 50% Off"
        tag: "Great Savings"
      },        
      {
        image: Image,
        name: "JioFi JMR541 Wireless Data Card",
        description: "JioFi JMR541 Wireless Data Card",
        currentPrice: "799",
        originalPrice: "1,998",
        discount: 60, // Reflects original "Upto 60% Off"
        tag: "Buy Now"
      },
      {
        image: Image,
        name: "Cooler Master Notepal X3 Cooling Pad",
        description: "Cooler Master Notepal X3 Cooling Pad",
        currentPrice: "499",
        originalPrice: "2,495",
        discount: 80, // Reflects original "Upto 80% Off"
        tag: "Grab Now"
      },
      {
        image: Image,
        name: "Philips Viva Collection Induction Cooktop",
        description: "Philips Viva Collection Induction Cooktop",
        currentPrice: "2,249",
        originalPrice: "4,998",
        discount: 55, // Reflects original "Upto 55% Off"
        tag: "Top Rated"
      },
      {
        image: Image,
        name: "Designer Lehenga Choli with Dupatta",
        description: "Designer Lehenga Choli with Dupatta",
        currentPrice: "2,399",
        originalPrice: "5,998",
        discount: 60, // Reflects original "Min 60% Off"
        tag: "Great Savings"
      },
      {
        image: Image,
        name: "Samsung 75-inch 8K QLED TV",
        description: "Samsung 75-inch 8K QLED TV",
        currentPrice: "174,999",
        originalPrice: "499,997",
        discount: 65, // Reflects original "Upto 65% Off"
        tag: "Discover Now"
      },
      {
        image: Image,
        name: "Wooden Coffee Table with Storage",
        description: "Wooden Coffee Table with Storage",
        currentPrice: "1,999",
        originalPrice: "2,498",
        discount: 20, // Adjusted from "From ₹1,900" to reasonable discount
        tag: "Relax & Work"
      },
      {
        image: Image,
        name: "Sony HT-S20R 5.1 Channel Soundbar",
        description: "Sony HT-S20R 5.1 Channel Soundbar",
        currentPrice: "9,999",
        originalPrice: "19,998",
        discount: 50, // Reflects original "Min 50% Off"
        tag: "Explore Now"
      },
      {
        image: Image,
        name: "LG 260L Double Door Refrigerator",
        description: "LG 260L Double Door Refrigerator",
        currentPrice: "19,999",
        originalPrice: "24,998",
        discount: 20, // Reflects original "Upto 20% Off"
        tag: "Shop Now"
      },
      {
        image: Image,
        name: "Mi 55-inch 4K Smart TV",
        description: "Mi 55-inch 4K Smart TV",
        currentPrice: "19,999",
        originalPrice: "49,997",
        discount: 60, // Reflects original "Upto 60% Off"
        tag: "Great Savings"
      },
      {
        image: Image,
        name: "Dell Inspiron 15 Laptop",
        description: "Dell Inspiron 15 Laptop",
        currentPrice: "39,999",
        originalPrice: "49,998",
        discount: 20, // Reflects original "Min 20% Off"
        tag: "Great Savings"
      },
      {
        image: Image,
        name: "Lavie Women's Handbag",
        description: "Lavie Women's Handbag",
        currentPrice: "749",
        originalPrice: "2,496",
        discount: 70, // Reflects original "Min 70% Off"
        tag: "Grab Now"
      },
      {
        image: Image,
        name: "Prestige PGMFB Sandwich Maker",
        description: "Prestige PGMFB Sandwich Maker",
        currentPrice: "499",
        originalPrice: "2,495",
        discount: 80, // Reflects original "Upto 80% Off"
        tag: "Buy Now"
      },
      {
        image: Image,
        name: "Prestige PGMFB Sandwich Maker",
        description: "Prestige PGMFB Sandwich Maker",
        currentPrice: "499",
        originalPrice: "2,495",
        discount: 80, // Reflects original "Upto 80% Off"
        tag: "Buy Now"
      }
]