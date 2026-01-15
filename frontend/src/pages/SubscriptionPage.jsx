import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FakePaymentModal from '../components/FakePaymentModal.jsx';

const SubscriptionPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // { name: 'Monthly', price: 9.99, plan: 'monthly' }
  const navigate = useNavigate();

  const openModal = (planDetails) => {
    setSelectedPlan(planDetails);
    setIsModalOpen(true);
  };
  
  const handleFakePayment = async () => {
    if (!selectedPlan) return;
    
    await axios.post('/api/payments/subscribe', { plan: selectedPlan.plan });
    
    // On success, navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <>
      <FakePaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFakePayment}
        title={`KidiCode Subscription (${selectedPlan?.name})`}
        amount={selectedPlan?.price || 0}
      />
    
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Subscription Plans</h1>
        <p className="text-xl text-gray-600 text-center mb-10">Get access to all our courses!</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Monthly Plan */}
          <div className="border-2 border-gray-200 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-semibold mb-2">Monthly</h2>
            <p className="text-4xl font-bold mb-4">$9.99<span className="text-lg font-normal">/mo</span></p>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>Access to all courses</li>
              <li>New courses included</li>
              <li>Cancel anytime</li>
            </ul>
            <button
              onClick={() => openModal({ name: 'Monthly', price: 9.99, plan: 'monthly' })}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Get Started
            </button>
          </div>
          
          {/* Yearly Plan */}
          <div className="border-2 border-blue-600 p-8 rounded-lg text-center relative">
            <span className="absolute top-0 -mt-3 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">Best Value</span>
            <h2 className="text-2xl font-semibold mb-2">Yearly</h2>
            <p className="text-4xl font-bold mb-4">$99.99<span className="text-lg font-normal">/yr</span></p>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>Access to all courses</li>
              <li>New courses included</li>
              <li>Save 20% vs. Monthly</li>
            </ul>
            <button
              onClick={() => openModal({ name: 'Yearly', price: 99.99, plan: 'yearly' })}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;