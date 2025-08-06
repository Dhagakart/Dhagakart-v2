import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Poster1 from './Poster1.png';
import Image from './image.png'
import LoginModal from '../User/LoginModal';
import CreditApplicationModal from './CreditApplicationModal';
import {
  FiBriefcase,
  FiTrendingUp,
  FiZap,
  FiDollarSign,
  FiCreditCard,
  FiFileText,
  FiUserCheck,
  FiClipboard,
  FiShare2,
  FiFilePlus,
  FiCheckCircle,
  FiShoppingCart,
  FiRefreshCcw
} from 'react-icons/fi';

// Data arrays can remain as they are...
const eligibility = [
  { icon: <FiBriefcase size={24} />, title: '1+ Years In Business', subtitle: 'Your Business Must Have At Least 2 Years Of Operations To Qualify.' },
  { icon: <FiTrendingUp size={24} />, title: 'CIBIL Score Of 700+', subtitle: 'A Strong Credit Score Is Essential For Eligibility.' },
  { icon: <FiZap size={24} />, title: '1-Year Valid GST Required', subtitle: 'Ensure Your GST Is Active And Valid For The Past 2 Years.' },
  { icon: <FiDollarSign size={24} />, title: 'Minimum 50 Lacs GST Turnover', subtitle: 'Your Business Must Have A GST Turnover Of At Least 45 Lacs Annually.' }
];
const docs = [
  { icon: <FiCreditCard size={20} />, title: 'PAN Card', note: 'Delivery in 24/7' },
  { icon: <FiFileText size={20} />, title: 'GST Number', note: '100% money‑back guarantee' },
  { icon: <FiUserCheck size={20} />, title: 'Aadhar Card', note: 'Your money is safe' },
  { icon: <FiClipboard size={20} />, title: 'Bank Statement', note: 'Live contact/message' }
];
const faqItems = [
  { question: 'What is the "Procure Now, Pay Later" program?', answer: 'It is a credit facility that allows you to purchase textile materials now and pay for them later, with up to 45 days of interest-free credit.' },
  { question: 'Who is eligible to apply for credit?', answer: 'Businesses with at least 1 year of operations, a valid GST, and a good credit score are eligible to apply.' },
  { question: 'What documents are required for the credit application?', answer: 'You will need your PAN card, GST number, Aadhar card, and recent bank statements.' },
  { question: 'How long does it take to get credit approval?', answer: 'Once you submit all required documents, approval can be granted within 24-48 hours.' }
];
const steps = [
    { icon: <FiShare2 size={20} />, title: 'Share Your Content', desc: 'Explore 65+ styles to find the perfect frame kit for your bathroom mirror' },
    { icon: <FiFilePlus size={20} />, title: 'Document Submission' },
    { icon: <FiCheckCircle size={20} />, title: 'Get Credit & Limit Approval' },
    { icon: <FiShoppingCart size={20} />, title: 'Buy Materials on Credit' },
    { icon: <FiRefreshCcw size={20} />, title: 'Repay in 45 Days at 0% Interest' }
];


const ReqCredits = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setShowCreditModal(true);
  };

  return (
    <div className="bg-white w-full overflow-x-hidden">
      {/* — Hero Section — */}
      <div className="bg-[#003366] text-white relative flex items-center min-h-[92vh] md:mt-[34px]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-xl text-center md:text-left">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Procure Now, <span className="italic text-cyan-300">Pay Later.</span>
              </h1>
              <p className="text-lg md:text-2xl text-gray-200">
                Grow your business with our interest‑free credit program to procure textile materials.
              </p>
              <button 
                onClick={handleApplyClick}
                className="bg-white text-[#003366] px-8 py-3 rounded-md font-medium hover:bg-gray-200 hover:cursor-pointer transition"
              >
                Apply for Credit
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                <div className="text-center sm:text-start">
                  <p className="text-3xl md:text-4xl font-bold">₹2 Cr.</p>
                  <p className="text-base md:text-lg text-gray-300 mt-1">Credit Limit</p>
                </div>
                <div className="text-center sm:text-start">
                  <p className="text-3xl md:text-4xl font-bold">45</p>
                  <p className="text-base md:text-lg text-gray-300 mt-1">Days interest Free</p>
                </div>
                <div className="text-center sm:text-start">
                  <p className="text-3xl md:text-4xl font-bold">0</p>
                  <p className="text-base md:text-lg text-gray-300 mt-1">Collateral Needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* FIX: Removed the container div and adjusted image classes */}
        <img
            src={Image}
            alt="Credit Illustration"
            className="absolute bottom-0 right-0 h-[90vh] w-auto object-contain hidden lg:block"
        />
      </div>

      {/* ... (The rest of the component remains unchanged) ... */}

      {/* How It Works */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center lg:order-first">
            <img src={Poster1} alt="Process Illustration" className="w-full max-w-md object-cover" />
          </div>
          <div className="lg:order-last">
            <h2 className="text-3xl font-semibold">How it Works</h2>
            <p className="text-gray-500 mt-1">Get Credit In Easy Steps</p>
            <ul className="mt-6 space-y-4">
              {steps.map((step, idx) => (
                <li key={idx} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="p-2 bg-gray-50 rounded text-[#003366]">
                    {step.icon}
                  </div>
                  <span className="font-medium text-gray-800">{idx + 1}. {step.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* — Eligibility Criteria — */}
      <section className='bg-gray-50 py-16 sm:py-20'>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <h2 className="text-3xl font-semibold text-center">Eligibility Criteria</h2>
            <p className="text-center text-gray-500 mt-2 max-w-2xl mx-auto">
              Ensure you meet the requirements to unlock the Procure Now, Pay Later option.
            </p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {eligibility.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg text-start shadow-sm">
                  <div className="w-12 h-12 bg-[#003366] text-white rounded-xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 font-medium text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.subtitle}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <button 
                onClick={handleApplyClick}
                className="bg-[#003366] text-white px-8 py-3 rounded-lg hover:bg-[#003366]/90 transition"
              >
                Apply Now
              </button>
            </div>
        </div>
      </section>

      {/* — Documents You’ll Need for KYC — */}
      <section className='py-16 sm:py-20'>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <h2 className="text-3xl font-semibold text-center">Documents You’ll Need for KYC</h2>
            <p className="text-center text-gray-500 mt-2 max-w-2xl mx-auto">
              You must be able to present the following documents to get interest-free credit for 45 days.
            </p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px border border-gray-200 rounded-lg overflow-hidden">
              {docs.map((doc, idx) => (
                <div key={idx} className="flex items-center p-4 bg-white">
                  <div className="p-3 bg-[#003366] text-white rounded-lg mr-4">{doc.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{doc.note}</p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* — FAQ & Support — */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className={`w-full flex justify-between items-center p-4 text-left transition-colors duration-200 ${openIndex === idx ? 'bg-[#003366] text-white' : 'bg-white text-gray-800'}`}
                  >
                    <span className="font-medium">{item.question}</span>
                    <span className={`transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-white' : 'text-gray-500'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="p-4 border-t border-gray-200 text-gray-600">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900">
              Still have questions? Contact our support team.
            </h3>
            <p className="text-gray-800 text-sm mt-2">
              If you can’t find the answer, please reach out to our support team.
            </p>
            <form className="mt-4 space-y-4">
              <input type="email" placeholder="Email Address" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
              <input type="text" placeholder="Subject" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
              <textarea placeholder="Message (Optional)" rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
              <button type="submit" className="w-full bg-[#003366] text-white py-2.5 rounded-md text-sm">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      
      <CreditApplicationModal 
        open={showCreditModal}
        onClose={() => setShowCreditModal(false)}
      />
    </div>
  );
};

export default ReqCredits;