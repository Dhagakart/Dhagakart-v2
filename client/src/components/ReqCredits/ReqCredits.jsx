import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Poster from './Poster.png';
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

const eligibility = [
  {
    icon: <FiBriefcase size={24} />,
    title: '1+ Years In Business',
    subtitle: 'Your Business Must Have At Least 2 Years Of Operations To Qualify.'
  },
  {
    icon: <FiTrendingUp size={24} />,
    title: 'CIBIL Score Of 700+',
    subtitle: 'A Strong Credit Score Is Essential For Eligibility.'
  },
  {
    icon: <FiZap size={24} />,
    title: '1-Year Valid GST Required',
    subtitle: 'Ensure Your GST Is Active And Valid For The Past 2 Years.'
  },
  {
    icon: <FiDollarSign size={24} />,
    title: 'Minimum 50 Lacs GST Turnover',
    subtitle: 'Your Business Must Have A GST Turnover Of At Least 45 Lacs Annually.'
  }
];

const docs = [
  { icon: <FiCreditCard size={20} />, title: 'PAN Card', note: 'Delivery in 24/7' },
  { icon: <FiFileText size={20} />, title: 'GST Number', note: '100% money‑back guarantee' },
  { icon: <FiUserCheck size={20} />, title: 'Aadhar Card', note: 'Your money is safe' },
  { icon: <FiClipboard size={20} />, title: 'Bank Statement', note: 'Live contact/message' }
];

const faqItems = [
  {
    question: 'What is the "Procure Now, Pay Later" program?',
    answer:
      'It is a credit facility that allows you to purchase construction materials now and pay for them later, with up to 45 days of interest-free credit.'
  },
  {
    question: 'Who is eligible to apply for credit?',
    answer: 'Businesses with at least 1 year of operations, a valid GST, and a good credit score are eligible to apply.'
  },
  {
    question: 'What documents are required for the credit application?',
    answer: 'You will need your PAN card, GST number, Aadhar card, and recent bank statements.'
  },
  {
    question: 'How long does it take to get credit approval?',
    answer: 'Once you submit all required documents, approval can be granted within 24-48 hours.'
  }
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
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setShowCreditModal(true);
  };

  const handleContinueToApplication = () => {
    setShowCreditModal(false);
    // Navigate to the actual credit application form
    navigate('/credit-application');
  };

  return (
    <div className="bg-white w-full pl-24 mt-10 space-y-20 overflow-hidden">
      {/* — Hero Section — */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Procure Now, <span className="italic text-[#003366]">Pay Later.</span>
          </h1>
          <p className="text-2xl text-gray-600">
            Grow your business with our interest‑free credit program to procure construction materials.
          </p>
          <button 
            onClick={handleApplyClick}
            className="bg-[#003366] text-white px-8 py-3 rounded-md font-medium hover:bg-[#003366]/80 transition hover:cursor-pointer"
          >
            Apply for Credit
          </button>
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-start">
              <p className="text-4xl font-bold text-black">₹2 Cr.</p>
              <p className="text-lg text-gray-700 mt-1">Credit Limit Available</p>
            </div>
            <div className="text-start">
              <p className="text-4xl font-bold text-black">45</p>
              <p className="text-lg text-gray-700 mt-1">Days interest Free Credit</p>
            </div>
            <div className="text-start">
              <p className="text-4xl font-bold text-black">0</p>
              <p className="text-lg text-gray-700 mt-1">Collateral Needed</p>
            </div>
          </div>
        </div>
        <div className="flex min-h-[90vh] items-end justify-end">
          <img
            src={Image}
            alt="Credit Illustration"
            className="w-full max-w-4xl object-contain"
            style={{ objectPosition: 'right' }}
          />
        </div>
      </div>

       {/* How It Works */}
       <section className="py-16 pr-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <img src={Poster1} alt="Process Illustration" className="w-full max-w-5xl object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-semibold">How it Works</h2>
            <p className="text-gray-500 mt-1">Get Credit In Easy Steps</p>
            <ul className="mt-6 space-y-4">
              {steps.map((step, idx) => (
                <li key={idx} className={`
                  flex items-center gap-4 p-4 ${idx === 0 ? 'border border-gray-300 rounded-lg' : ''}`
                }>
                  <div className="p-2 bg-gray-50 rounded">
                    {step.icon}
                  </div>
                  <span className="font-medium text-gray-800">{idx + 1}. {step.title}</span>
                  {step.desc && <p className="text-gray-500 ml-auto">{step.desc}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* — Eligibility Criteria — */}
      <section className='pr-24'>
        <h2 className="text-3xl font-semibold text-center">Eligibility Criteria</h2>
        <p className="text-center text-gray-500 mt-2">
          Ensure you meet the requirements to unlock Procure Now, Pay later option
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {eligibility.map((item, idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-lg text-start shadow-sm">
              <div className="w-12 h-12 bg-[#003366] text-white rounded-xl flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="mt-4 font-medium text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.subtitle}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button 
            onClick={handleApplyClick}
            className="bg-[#003366] text-white px-6 py-2 rounded-lg hover:bg-[#003366]/80 transition hover:cursor-pointer"
          >
            Apply Now
          </button>
        </div>
      </section>

      {/* — Documents You’ll Need for KYC — */}
      <section className='pr-24'>
        <h2 className="text-3xl font-semibold text-center">Documents You’ll Need for KYC</h2>
        <p className="text-center text-gray-500 mt-2">
          You must be able to present the following documents to get interest free
          credit for 45 days
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-gray-200 rounded-lg overflow-hidden">
          {docs.map((doc, idx) => (
            <div key={idx} className="flex items-center p-4">
              <div className="p-3 bg-[#003366] text-white rounded mr-3">{doc.icon}</div>
              <div>
                <h4 className="font-medium text-gray-900">{doc.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{doc.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* — FAQ & Support — */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pr-24 mb-8">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 ease-in-out">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className={`w-full flex justify-between items-center p-4 transition-colors duration-200 hover:cursor-pointer ${openIndex === idx ? 'bg-[#003366] text-white' : 'bg-white text-gray-800'}`}
                >
                  <span className={openIndex === idx ? 'text-white' : 'text-gray-800'}>{item.question}</span>
                  <span className={`transition-transform duration-200 ${openIndex === idx ? 'text-white rotate-180' : 'text-gray-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="p-4 border-t border-gray-200 text-gray-600">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-900">
            Still have questions? Contact our support team.
          </h3>
          <p className="text-gray-800 text-sm mt-2">
            If you can’t find the answer you’re looking for, please reach out to our support team. We’re here to help you with any questions about our credit program or your application.
          </p>
          <form className="mt-4 space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Message (Optional)"
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="w-full bg-[#003366] text-white py-2 rounded text-sm"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      
      {/* Credit Application Modal */}
      <CreditApplicationModal 
        open={showCreditModal}
        onClose={() => setShowCreditModal(false)}
      />
    </div>
  );
};

export default ReqCredits;