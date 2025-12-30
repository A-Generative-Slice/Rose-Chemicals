'use client';

import { useState } from 'react';
import { CreditCard, Shield, Clock, Check, AlertCircle, Loader2 } from 'lucide-react';

interface PaymentMethodProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  isProcessing?: boolean;
}

export default function PaymentMethod({ selectedMethod, onMethodChange, isProcessing = false }: PaymentMethodProps) {
  const [loadingMethod, setLoadingMethod] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: 'online',
      name: 'Online Payment',
      description: 'Pay securely using UPI, Cards, Net Banking via Razorpay',
      icon: <CreditCard size={20} />,
      features: ['Instant Payment', '256-bit SSL Security', 'Multiple Payment Options'],
      recommended: true
    }
  ];

  const handleMethodSelect = async (methodId: string) => {
    if (isProcessing) return;

    setLoadingMethod(methodId);

    // Simulate method validation (e.g., check COD availability)
    await new Promise(resolve => setTimeout(resolve, 500));

    onMethodChange(methodId);
    setLoadingMethod(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="text-primary" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          const isLoading = loadingMethod === method.id;

          return (
            <div
              key={method.id}
              className={`relative border-2 rounded-lg transition-all duration-200 ${isSelected
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
                } ${isProcessing && !isSelected ? 'opacity-50' : ''}`}
            >
              <label className="flex items-start gap-4 p-5 cursor-pointer">
                <div className="flex items-center mt-1">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={isSelected}
                    onChange={() => handleMethodSelect(method.id)}
                    disabled={isProcessing}
                    className="w-4 h-4 text-primary focus:ring-primary focus:ring-2 disabled:opacity-50"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-primary">{method.icon}</div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{method.name}</span>
                      {method.recommended && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{method.description}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {method.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                        <Check size={12} className="text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Loading State */}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-primary mt-2">
                      <Loader2 size={14} className="animate-spin" />
                      <span>Validating payment method...</span>
                    </div>
                  )}
                </div>
              </label>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Shield className="text-green-600" size={20} />
          <div>
            <h4 className="font-medium text-gray-900">Secure Payment</h4>
            <p className="text-sm text-gray-600">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>
      </div>

      {/* Processing Time */}
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <Clock size={16} />
        <span>
          {selectedMethod === 'online'
            ? 'Payment processed instantly'
            : 'Orders processed within 1-2 business days'}
        </span>
      </div>
    </div>
  );
}