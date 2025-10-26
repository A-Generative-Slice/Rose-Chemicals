'use client';

import { useState } from 'react';
import { AlertCircle, CreditCard, Smartphone, Building, Wallet, CheckCircle, X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    orderId: string;
    amount: number;
    customerInfo: {
      name: string;
      email: string;
      phone: string;
    };
  };
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  orderDetails, 
  onPaymentSuccess, 
  onPaymentError 
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'methods' | 'processing' | 'success' | 'error'>('methods');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  const paymentOptions = [
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay using Google Pay, PhonePe, Paytm',
      icon: <Smartphone className="text-blue-600" size={24} />,
      popular: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, RuPay, Amex',
      icon: <CreditCard className="text-purple-600" size={24} />
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major banks supported',
      icon: <Building className="text-green-600" size={24} />
    },
    {
      id: 'wallet',
      name: 'Wallets',
      description: 'Paytm, FreeCharge, MobiKwik',
      icon: <Wallet className="text-orange-600" size={24} />
    }
  ];

  const initializePayment = async (method: string) => {
    setIsProcessing(true);
    setCurrentStep('processing');
    
    try {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

      // Create payment order (this should be an API call)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderId: orderDetails.orderId })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const { razorpayOrder } = await response.json();

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Rose Chemicals',
        description: `Payment for Order #${orderDetails.orderId.slice(-8)}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: orderDetails.customerInfo.name,
          email: orderDetails.customerInfo.email,
          contact: orderDetails.customerInfo.phone,
        },
        theme: {
          color: '#3b82f6',
        },
        method: {
          upi: method === 'upi',
          card: method === 'card',
          netbanking: method === 'netbanking',
          wallet: method === 'wallet',
        },
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderDetails.orderId,
              })
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            setCurrentStep('success');
            
            setTimeout(() => {
              onPaymentSuccess(verifyData);
              onClose();
            }, 2000);
            
          } catch (error) {
            setErrorMessage('Payment verification failed. Please contact support.');
            setCurrentStep('error');
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setCurrentStep('methods');
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment initialization error:', error);
      setErrorMessage('Failed to initialize payment. Please try again.');
      setCurrentStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    initializePayment(methodId);
  };

  const handleRetry = () => {
    setCurrentStep('methods');
    setErrorMessage('');
    setSelectedMethod('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Complete Payment</h2>
            <p className="text-sm text-gray-600 mt-1">
              Order #{orderDetails.orderId.slice(-8)}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Amount Display */}
          <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Amount to Pay</p>
            <p className="text-2xl font-bold text-gray-900">₹{orderDetails.amount.toFixed(2)}</p>
          </div>

          {/* Payment Methods */}
          {currentStep === 'methods' && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 mb-4">Choose Payment Method</h3>
              {paymentOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleMethodSelect(option.id)}
                  disabled={isProcessing}
                  className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex-shrink-0">{option.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{option.name}</span>
                      {option.popular && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                  <div className="text-gray-400">→</div>
                </button>
              ))}
            </div>
          )}

          {/* Processing State */}
          {currentStep === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Payment</h3>
              <p className="text-gray-600">Please complete the payment in the popup window...</p>
            </div>
          )}

          {/* Success State */}
          {currentStep === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600">Your order has been confirmed. Redirecting...</p>
            </div>
          )}

          {/* Error State */}
          {currentStep === 'error' && (
            <div className="text-center py-8">
              <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Failed</h3>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {currentStep === 'methods' && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secured by 256-bit SSL encryption</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}