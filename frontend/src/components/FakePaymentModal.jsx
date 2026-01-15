import React, { useState } from 'react';

// This is a fake component. It doesn't do anything but look real.
const FakePaymentModal = ({ isOpen, onClose, onSubmit, title, amount }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Call the actual submission logic
    try {
      await onSubmit();
      setSuccess(true);
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        {!success ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
              {/* Stripe Logo */}
              <svg width="58" height="25" viewBox="0 0 58 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M52.0224 8.24354C52.0224 7.22154 51.218 6.41709 50.196 6.41709H41.696C40.6739 6.41709 39.8695 7.22154 39.8695 8.24354V16.7435C39.8695 17.7655 40.6739 18.57 41.696 18.57H50.196C51.218 18.57 52.0224 17.7655 52.0224 16.7435V8.24354Z" fill="#635BFF"></path>
                <path d="M58 8.24354C58 7.22154 57.1955 6.41709 56.1735 6.41709H54.008C52.9859 6.41709 52.1815 7.22154 52.1815 8.24354V16.7435C52.1815 17.7655 52.9859 18.57 54.008 18.57H56.1735C57.1955 18.57 58 17.7655 58 16.7435V8.24354Z" fill="#635BFF"></path>
                <path d="M8.24354 0C7.22154 0 6.41709 0.804446 6.41709 1.82645V18.1736C6.41709 19.1956 7.22154 20 8.24354 20H16.7435C17.7655 20 18.57 19.1956 18.57 18.1736V1.82645C18.57 0.804446 17.7655 0 16.7435 0H8.24354Z" fill="#635BFF"></path>
                <path d="M1.82645 3.65289C0.804446 3.65289 0 4.45734 0 5.47934V23.1736C0 24.1956 0.804446 25 1.82645 25H16.7435C17.7655 25 18.57 24.1956 18.57 23.1736V21.3472H8.24354C7.22154 21.3472 6.41709 20.5427 6.41709 19.5207V5.47934C6.41709 4.45734 7.22154 3.65289 8.24354 3.65289H1.82645Z" fill="#635BFF"></path>
                <path d="M38.143 6.41709H36.3166V1.82645C36.3166 0.804446 35.5121 0 34.4901 0H25.9901C24.9681 0 24.1637 0.804446 24.1637 1.82645V6.41709H22.3372C21.3152 6.41709 20.5108 7.22154 20.5108 8.24354V16.7435C20.5108 17.7655 21.3152 18.57 22.3372 18.57H34.4901C35.5121 18.57 36.3166 17.7655 36.3166 16.7435V11.8548H38.143C39.165 11.8548 39.9695 11.0504 39.9695 10.0284V8.24354C39.9695 7.22154 39.165 6.41709 38.143 6.41709ZM30.7307 14.1108H25.9901V4.45734H30.7307V14.1108Z" fill="#635BFF"></path>
              </svg>
            </div>
            
            <p className="text-gray-600 mb-2">You are paying for:</p>
            <p className="text-xl font-semibold mb-6">{title}</p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="student@example.com" disabled className="w-full px-3 py-2 border rounded-lg bg-gray-100" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Card information</label>
                <input type="text" placeholder="4242 4242 4242 4242" disabled className="w-full px-3 py-2 border rounded-lg bg-gray-100" />
              </div>
              <div className="flex gap-4 mb-6">
                <input type="text" placeholder="MM / YY" disabled className="w-1/2 px-3 py-2 border rounded-lg bg-gray-100" />
                <input type="text" placeholder="CVC" disabled className="w-1/2 px-3 py-2 border rounded-lg bg-gray-100" />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
              >
                {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-10">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-2xl font-bold mt-4">Payment Successful!</h2>
            <p className="text-gray-600 mt-2">You now have access to your purchase.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FakePaymentModal;