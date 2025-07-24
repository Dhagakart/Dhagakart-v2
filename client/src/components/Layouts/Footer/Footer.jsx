// import { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { 
//   FaFacebook, 
//   FaTwitter, 
//   FaInstagram, 
//   FaYoutube, 
//   FaLinkedin,
//   FaArrowUp,
//   FaBriefcase,
//   FaStar,
//   FaGift,
//   FaQuestionCircle,
//   FaPhone,
//   FaEnvelope,
//   FaMapMarkerAlt
// } from 'react-icons/fa';
// import paymentMethods from '../../../assets/images/payment-methods.svg';

// const footerLinks = [
//   {
//     title: "Company",
//     links: [
//       { name: "About Us", redirect: "/about" },
//       { name: "Careers", redirect: "/careers" },
//       { name: "Blog", redirect: "/blog" },
//       { name: "Press", redirect: "/press" },
//       { name: "Contact Us", redirect: "/contact" }
//     ]
//   },
//   {
//     title: "Help",
//     links: [
//       { name: "Payments", redirect: "/payments" },
//       { name: "Shipping", redirect: "/shipping" },
//       { name: "Cancellation & Returns", redirect: "/returns" },
//       { name: "FAQ", redirect: "/faq" },
//       { name: "Report an Issue", redirect: "/report-issue" }
//     ]
//   },
//   {
//     title: "Policy",
//     links: [
//       { name: "Return Policy", redirect: "/return-policy" },
//       { name: "Terms of Use", redirect: "/terms" },
//       { name: "Security", redirect: "/security" },
//       { name: "Privacy", redirect: "/privacy" },
//       { name: "Sitemap", redirect: "/sitemap" }
//     ]
//   },
//   {
//     title: "Connect With Us",
//     links: [
//       { name: "Facebook", icon: <FaFacebook className="inline mr-2" />, redirect: "#" },
//       { name: "Twitter", icon: <FaTwitter className="inline mr-2" />, redirect: "#" },
//       { name: "Instagram", icon: <FaInstagram className="inline mr-2" />, redirect: "#" },
//       { name: "YouTube", icon: <FaYoutube className="inline mr-2" />, redirect: "#" },
//       { name: "LinkedIn", icon: <FaLinkedin className="inline mr-2" />, redirect: "#" }
//     ]
//   }
// ];

// const Footer = () => {
//   const location = useLocation();
//   const [adminRoute, setAdminRoute] = useState(false);
//   const [showScroll, setShowScroll] = useState(false);

//   useEffect(() => {
//     setAdminRoute(location.pathname.split("/", 2).includes("admin"));
    
//     const checkScroll = () => {
//       if (!showScroll && window.pageYOffset > 300) {
//         setShowScroll(true);
//       } else if (showScroll && window.pageYOffset <= 300) {
//         setShowScroll(false);
//       }
//     };
    
//     window.addEventListener('scroll', checkScroll);
//     return () => window.removeEventListener('scroll', checkScroll);
//   }, [location, showScroll]);

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   if (adminRoute) return null;

//   return (
//     <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300">
//       {/* Main Footer Content */}
//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
//           {/* Company Info */}
//           <div className="lg:col-span-2">
//             <h3 className="text-white text-2xl font-bold mb-4">DhagaKart</h3>
//             <p className="mb-4">Your trusted online shopping destination</p>
            
//             <div className="flex flex-col space-y-3">
//               <div className="flex items-center">
//                 <FaMapMarkerAlt className="mr-3 text-blue-400" />
//                 <p>Buildings Alyssa, Begonia & Clove</p>
//               </div>
//               <div className="flex items-center">
//                 <FaPhone className="mr-3 text-blue-400" />
//                 <a href="tel:18002029898" className="hover:text-white">1800 202 9898</a>
//               </div>
//               <div className="flex items-center">
//                 <FaEnvelope className="mr-3 text-blue-400" />
//                 <a href="mailto:care@DhagaKart.com" className="hover:text-white">care@DhagaKart.com</a>
//               </div>
//             </div>
//           </div>

//           {/* Footer Links */}
//           {footerLinks.map((section, index) => (
//             <div key={index} className="mb-6">
//               <h3 className="text-white text-lg font-semibold mb-4 uppercase">{section.title}</h3>
//               <ul className="space-y-2">
//                 {section.links.map((link, linkIndex) => (
//                   <li key={linkIndex}>
//                     <a
//                       href={link.redirect}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
//                     >
//                       {link.icon && link.icon}
//                       {link.name}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* Divider */}
//         <div className="border-t border-gray-700 my-6"></div>

//         {/* Bottom Bar */}
//         <div className="flex flex-col md:flex-row justify-between items-center py-4">
//           <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
//             <a 
//               href="https://seller.flipkart.com/sell-online" 
//               target="_blank" 
//               rel="noopener noreferrer" 
//               className="flex items-center text-sm hover:text-white"
//             >
//               <FaBriefcase className="mr-2 text-yellow-400" /> Sell On Flipkart
//             </a>
//             <a 
//               href="https://brands.flipkart.com" 
//               target="_blank" 
//               rel="noopener noreferrer" 
//               className="flex items-center text-sm hover:text-white"
//             >
//               <FaStar className="mr-2 text-yellow-400" /> Advertise
//             </a>
//             <a 
//               href="https://www.flipkart.com/the-gift-card-store" 
//               target="_blank" 
//               rel="noopener noreferrer" 
//               className="flex items-center text-sm hover:text-white"
//             >
//               <FaGift className="mr-2 text-yellow-400" /> Gift Cards
//             </a>
//             <a 
//               href="https://www.flipkart.com/helpcentre" 
//               target="_blank" 
//               rel="noopener noreferrer" 
//               className="flex items-center text-sm hover:text-white"
//             >
//               <FaQuestionCircle className="mr-2 text-yellow-400" /> Help Center
//             </a>
//           </div>

//           <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
//             <span className="text-sm">&copy; 2007-{new Date().getFullYear()} Flipkart.com</span>
//             <img 
//               src={paymentMethods} 
//               alt="Payment Methods" 
//               className="h-6"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Scroll to Top Button */}
//       {showScroll && (
//         <button
//           onClick={scrollToTop}
//           className="fixed bottom-5 right-5 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
//           aria-label="Back to top"
//         >
//           <FaArrowUp />
//         </button>
//       )}
//     </footer>
//   );
// };

// export default Footer;

// import { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { 
//   FaFacebook, 
//   FaTwitter, 
//   FaInstagram, 
//   FaYoutube, 
//   FaLinkedin,
//   FaArrowUp,
//   FaBriefcase,
//   FaStar,
//   FaGift,
//   FaQuestionCircle,
//   FaPhone,
//   FaEnvelope,
//   FaMapMarkerAlt
// } from 'react-icons/fa';
// import paymentMethods from '../../../assets/images/payment-methods.svg';

// const footerLinks = [
//   {
//     title: "Company",
//     links: [
//       { name: "About Us", redirect: "/about" },
//       { name: "Careers", redirect: "/careers" },
//       { name: "Blog", redirect: "/blog" },
//       { name: "Press", redirect: "/press" },
//       { name: "Contact Us", redirect: "/contact" }
//     ]
//   },
//   {
//     title: "Help",
//     links: [
//       { name: "Payments", redirect: "/payments" },
//       { name: "Shipping", redirect: "/shipping" },
//       { name: "Cancellation & Returns", redirect: "/returns" },
//       { name: "FAQ", redirect: "/faq" },
//       { name: "Report an Issue", redirect: "/report-issue" }
//     ]
//   },
//   {
//     title: "Policy",
//     links: [
//       { name: "Return Policy", redirect: "/return-policy" },
//       { name: "Terms of Use", redirect: "/terms" },
//       { name: "Security", redirect: "/security" },
//       { name: "Privacy", redirect: "/privacy" },
//       { name: "Sitemap", redirect: "/sitemap" }
//     ]
//   },
//   {
//     title: "Connect With Us",
//     links: [
//       { name: "Facebook", icon: <FaFacebook className="inline mr-2" />, redirect: "#" },
//       { name: "Twitter", icon: <FaTwitter className="inline mr-2" />, redirect: "#" },
//       { name: "Instagram", icon: <FaInstagram className="inline mr-2" />, redirect: "#" },
//       { name: "YouTube", icon: <FaYoutube className="inline mr-2" />, redirect: "#" },
//       { name: "LinkedIn", icon: <FaLinkedin className="inline mr-2" />, redirect: "#" }
//     ]
//   }
// ];

// const Footer = () => {
//   const location = useLocation();
//   const [adminRoute, setAdminRoute] = useState(false);
//   const [showScroll, setShowScroll] = useState(false);

//   useEffect(() => {
//     setAdminRoute(location.pathname.split("/", 2).includes("admin"));
    
//     const checkScroll = () => {
//       if (!showScroll && window.pageYOffset > 300) {
//         setShowScroll(true);
//       } else if (showScroll && window.pageYOffset <= 300) {
//         setShowScroll(false);
//       }
//     };
    
//     window.addEventListener('scroll', checkScroll);
//     return () => window.removeEventListener('scroll', checkScroll);
//   }, [location, showScroll]);

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   if (adminRoute) return null;

//   return (
//     <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300">
//       {/* Main Footer Content */}
//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
//           {/* Company Info */}
//           <div className="lg:col-span-2">
//             <h3 className="text-white text-2xl font-bold mb-4">DhagaKart</h3>
//             <p className="mb-4">Your trusted online shopping destination</p>
            
//             <div className="flex flex-col space-y-3">
//               <div className="flex items-center">
//                 <FaMapMarkerAlt className="mr-3 text-blue-400" />
//                 <p>Buildings Alyssa, Begonia & Clove</p>
//               </div>
//               <div className="flex items-center">
//                 <FaPhone className="mr-3 text-blue-400" />
//                 <a href="tel:18002029898" className="hover:text-white">1800 202 9898</a>
//               </div>
//               <div className="flex items-center">
//                 <FaEnvelope className="mr-3 text-blue-400" />
//                 <a href="mailto:care@DhagaKart.com" className="hover:text-white">care@DhagaKart.com</a>
//               </div>
//             </div>
//           </div>

//           {/* Footer Links */}
//           {footerLinks.map((section, index) => (
//             <div key={index} className="mb-6">
//               <h3 className="text-white text-lg font-semibold mb-4 uppercase">{section.title}</h3>
//               <ul className="space-y-2">
//                 {section.links.map((link, linkIndex) => (
//                   <li key={linkIndex}>
//                     <a
//                       href={link.redirect}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
//                     >
//                       {link.icon && link.icon}
//                       {link.name}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* Divider */}
//         <div className="border-t border-gray-700 my-6"></div>

//         {/* Bottom Bar */}
//         <div className="flex flex-col md:flex-row justify-between items-center py-4">
//           <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
//             <a 
//               href="https://seller.flipkart.com/sell-online" 
//               target="_blank" 
//               rel="noopener noreferrer" 
//               className="flex items-center text-sm hover:text-white"
//             >
//               <FaBriefcase className="mr-2 text-yellow-400" /> Sell On Flipkart
//             </a>
//             <a 
//               href="https://brands.flipkart.com" 
//               target="_blank" 
//               rel="noopener noreferrer" 
//               className="flex items-center text-sm hover:text-white"
//             >
//               <FaStar className="mr-2 text-yellow-400" /> Advertise
//             </a>
//             <a 
//               href="https://www.flipkart.com/the-gift-card-store" 
//               target="_blank" 
//               rel="noopener noreferrer" 
//               className="flex items-center text-sm hover:text-white"
//             >
//               <FaGift className="mr-2 text-yellow-400" /> Gift Cards
//             </a>
//             <a 
//               href="https://www.flipkart.com/helpcentre" 
//               target="_blank" 
//               rel="noopener noreferrer" 
//               className="flex items-center text-sm hover:text-white"
//             >
//               <FaQuestionCircle className="mr-2 text-yellow-400" /> Help Center
//             </a>
//           </div>

//           <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
//             <span className="text-sm">&copy; 2007-{new Date().getFullYear()} Flipkart.com</span>
//             <img 
//               src={paymentMethods} 
//               alt="Payment Methods" 
//               className="h-6"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Scroll to Top Button */}
//       {showScroll && (
//         <button
//           onClick={scrollToTop}
//           className="fixed bottom-5 right-5 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
//           aria-label="Back to top"
//         >
//           <FaArrowUp />
//         </button>
//       )}
//     </footer>
//   );
// };

// export default Footer;

import React from 'react';
import CompanyInfo from './CompanyInfo';
import FooterColumn from './FooterColumn';
import PopularTags from './PopularTags';
import FooterBottomBar from './FooterBottomBar';
import { topCategories, quickLinks, popularTags } from './footerData';

const FooterDG = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{ backgroundColor: '#191C1F' }}
      className="text-[#838E94] pt-12 pb-10 sm:px-1 lg:px-8"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-12">
          
          <div className="lg:col-span-2 xl:col-span-2">
            <CompanyInfo />
          </div>

          <div className="lg:col-span-1 xl:col-span-1">
            <FooterColumn 
              title="Top Categories"
              links={topCategories} 
              browseLink={{ label: 'Browse All Products', href: '/products' }}
            />
          </div>

          <div className="lg:col-span-1 xl:col-span-1">
            <FooterColumn title="Quick Links" links={quickLinks} />
          </div>

          <div className="lg:col-span-2 xl:col-span-1">
            <PopularTags tags={popularTags} />
          </div>

        </div>

        <FooterBottomBar year={year} />
      </div>
    </footer>
  );
};

export default FooterDG;