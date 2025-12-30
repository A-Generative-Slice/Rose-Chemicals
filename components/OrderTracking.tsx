'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Truck, Package, MapPin, Clock, AlertCircle, ChevronRight } from 'lucide-react';

interface OrderTrackingProps {
  orderId: string;
  currentStatus: string;
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  className?: string;
}

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'pending';
  timestamp?: string;
  estimatedTime?: string;
}

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out-for-delivery',
  'delivered'
];

export default function OrderTracking({ 
  orderId, 
  currentStatus, 
  orderDate, 
  estimatedDelivery,
  trackingNumber,
  className = '' 
}: OrderTrackingProps) {
  const [steps, setSteps] = useState<TrackingStep[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    generateTrackingSteps();
  }, [currentStatus, orderDate, estimatedDelivery]);

  const generateTrackingSteps = () => {
    const currentStatusIndex = ORDER_STATUSES.indexOf(currentStatus.toLowerCase());
    
    const trackingSteps: TrackingStep[] = [
      {
        id: 'pending',
        title: 'Order Placed',
        description: 'Your order has been successfully placed',
        icon: <CheckCircle size={20} />,
        status: currentStatusIndex >= 0 ? 'completed' : 'pending',
        timestamp: currentStatusIndex >= 0 ? orderDate : undefined
      },
      {
        id: 'confirmed',
        title: 'Order Confirmed',
        description: 'Your order has been confirmed and is being prepared',
        icon: <Package size={20} />,
        status: currentStatusIndex >= 1 ? 'completed' : currentStatusIndex === 0 ? 'current' : 'pending',
        estimatedTime: currentStatusIndex < 1 ? '2-4 hours' : undefined
      },
      {
        id: 'processing',
        title: 'Processing',
        description: 'Your order is being processed and packaged',
        icon: <Package size={20} className="animate-pulse" />,
        status: currentStatusIndex >= 2 ? 'completed' : currentStatusIndex === 1 ? 'current' : 'pending',
        estimatedTime: currentStatusIndex < 2 ? '1-2 business days' : undefined
      },
      {
        id: 'shipped',
        title: 'Order Shipped',
        description: 'Your order has been shipped and is on its way',
        icon: <Truck size={20} />,
        status: currentStatusIndex >= 3 ? 'completed' : currentStatusIndex === 2 ? 'current' : 'pending',
        estimatedTime: currentStatusIndex < 3 ? '2-3 business days' : undefined
      },
      {
        id: 'out-for-delivery',
        title: 'Out for Delivery',
        description: 'Your order is out for delivery and will arrive soon',
        icon: <MapPin size={20} />,
        status: currentStatusIndex >= 4 ? 'completed' : currentStatusIndex === 3 ? 'current' : 'pending',
        estimatedTime: currentStatusIndex < 4 ? 'Today' : undefined
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Your order has been successfully delivered',
        icon: <CheckCircle size={20} />,
        status: currentStatusIndex >= 5 ? 'completed' : currentStatusIndex === 4 ? 'current' : 'pending'
      }
    ];

    setSteps(trackingSteps);
    setActiveStep(Math.max(0, currentStatusIndex));
  };

  const getStepStyles = (step: TrackingStep, index: number) => {
    switch (step.status) {
      case 'completed':
        return {
          wrapper: 'text-green-600',
          icon: 'bg-green-100 text-green-600 border-green-200',
          line: 'bg-green-200',
          dot: 'bg-green-500'
        };
      case 'current':
        return {
          wrapper: 'text-blue-600',
          icon: 'bg-blue-100 text-blue-600 border-blue-200 animate-pulse',
          line: 'bg-gray-200',
          dot: 'bg-blue-500 animate-ping'
        };
      default:
        return {
          wrapper: 'text-gray-400',
          icon: 'bg-gray-100 text-gray-400 border-gray-200',
          line: 'bg-gray-200',
          dot: 'bg-gray-300'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDeliveryMessage = () => {
    if (currentStatus === 'delivered') {
      return 'Order delivered successfully!';
    }
    
    if (estimatedDelivery) {
      const deliveryDate = new Date(estimatedDelivery);
      const today = new Date();
      const diffTime = deliveryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'Expected delivery: Today';
      } else if (diffDays === 1) {
        return 'Expected delivery: Tomorrow';
      } else if (diffDays > 0) {
        return `Expected delivery: ${diffDays} days`;
      } else {
        return 'Delivery date has passed - please contact support';
      }
    }
    
    return 'Estimated delivery date will be updated soon';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Order Tracking</h3>
          <p className="text-sm text-gray-600">Order #{orderId.slice(-8).toUpperCase()}</p>
        </div>
        
        {trackingNumber && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Tracking Number</p>
            <p className="font-medium text-gray-900">{trackingNumber}</p>
          </div>
        )}
      </div>

      {/* Estimated Delivery */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            {getEstimatedDeliveryMessage()}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 rounded"></div>
        <div 
          className="absolute top-4 left-0 h-1 bg-green-500 rounded transition-all duration-500"
          style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
        ></div>
        
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const styles = getStepStyles(step, index);
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${styles.icon} transition-all duration-300`}>
                  {step.status === 'current' && (
                    <div className={`absolute w-2 h-2 rounded-full ${styles.dot}`}></div>
                  )}
                  {step.icon}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tracking Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const styles = getStepStyles(step, index);
          return (
            <div key={step.id} className={`flex items-start gap-4 p-3 rounded-lg transition-all duration-300 ${
              step.status === 'current' ? 'bg-blue-50' : step.status === 'completed' ? 'bg-green-50' : 'bg-gray-50'
            }`}>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
                {step.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${styles.wrapper}`}>
                    {step.title}
                  </h4>
                  {step.status === 'current' && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                      Current
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  {step.description}
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  {step.timestamp && (
                    <span className="text-xs text-gray-500">
                      {formatDate(step.timestamp)}
                    </span>
                  )}
                  
                  {step.estimatedTime && step.status !== 'completed' && (
                    <span className="text-xs text-blue-600 font-medium">
                      ETA: {step.estimatedTime}
                    </span>
                  )}
                </div>
              </div>

              {step.status === 'completed' && (
                <CheckCircle size={16} className="text-green-500 mt-1" />
              )}
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      {currentStatus === 'shipped' && trackingNumber && (
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={16} className="text-purple-600" />
            <span className="text-sm font-medium text-purple-800">
              Track with Courier
            </span>
          </div>
          <p className="text-sm text-purple-700 mb-3">
            For real-time updates, track your package directly with our courier partner.
          </p>
          <button className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Track Package
          </button>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Need help with your order?
            </p>
          </div>
          <div className="flex gap-2">
            <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
              Contact Support
            </button>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}