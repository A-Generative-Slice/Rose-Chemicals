'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, Shield, MapPin } from 'lucide-react';
import Header from '../../components/Header';
import PaymentMethod from '../../components/PaymentMethod';
import PaymentModal from '../../components/PaymentModal';
import { useCart } from '../../src/contexts/CartContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { ordersAPI, processPayment } from '../../src/services/api';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('online');
  const { items, totalAmount, clearCart, validateCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    // Validate cart items and pre-fill address ONLY ONCE
    if (user && !isInitialized) {
      validateCart().catch(console.error);
      setShippingAddress({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
        country: user.address?.country || 'India'
      });
      setIsInitialized(true);
    }
  }, [isAuthenticated, items.length, user, router, validateCart, isInitialized]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'phone', 'street', 'city', 'state', 'pincode'];
    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof typeof shippingAddress]) {
        alert(`Please fill in the ${field} field`);
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Final cart validation
      const cartValidation = await validateCart();
      if (!cartValidation.valid) {
        alert('Some items in your cart are no longer available. Please review your cart.');
        router.push('/cart');
        return;
      }

      // Create order
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: {
          name: shippingAddress.name,
          phone: shippingAddress.phone,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.pincode,
          country: shippingAddress.country
        },
        paymentMethod,

        totalAmount: total // Final total including tax
      };

      const orderResponse = await ordersAPI.createOrder(orderData);
      const orderId = orderResponse.order._id;
      setCreatedOrderId(orderId);

      // Always open payment modal for online payment
      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      await clearCart();
      router.push(`/order-success?orderId=${createdOrderId}&paymentId=${paymentData.order.razorpayPaymentId}`);
    } catch (error) {
      console.error('Error after payment success:', error);
      router.push(`/order-success?orderId=${createdOrderId}`);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error}`);
    setIsPaymentModalOpen(false);
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setAddressLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use OpenStreetMap Nominatim (free, no key required for low volume)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();

          if (data && data.address) {
            const addr = data.address;
            setShippingAddress(prev => ({
              ...prev,
              street: addr.road || addr.suburb || '',
              city: addr.city || addr.town || addr.village || '',
              state: addr.state || '',
              pincode: addr.postcode || '',
            }));
            alert('Location detected and form pre-filled!');
          } else {
            alert(`Location detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}. Please fill in your address manually.`);
          }
        } catch (error) {
          console.error('Error getting address:', error);
          alert('Failed to get address from location. Please fill it manually.');
        } finally {
          setAddressLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Failed to detect location. Please allow location access.');
        setAddressLoading(false);
      }
    );
  };

  // Calculate totals
  const { subtotal, taxTotal } = items.reduce((acc, item) => {
    const itemTotal = item.product.price * item.quantity;
    const itemTax = (itemTotal * (item.product.gstPercentage || 0)) / 100;

    return {
      subtotal: acc.subtotal + itemTotal,
      taxTotal: acc.taxTotal + itemTax
    };
  }, { subtotal: 0, taxTotal: 0 });

  // Packing & Delivery Calculation
  let shippingCost = 0;
  if (subtotal <= 1000) {
    shippingCost = 100;
  } else if (subtotal <= 2000) {
    shippingCost = 150;
  } else if (subtotal <= 3000) {
    shippingCost = 200;
  } else if (subtotal <= 4000) {
    shippingCost = 250;
  } else {
    shippingCost = 300;
  }

  const total = subtotal + taxTotal + shippingCost;

  if (!isAuthenticated || items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Truck className="text-primary" size={24} />
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                </div>
                <button
                  onClick={detectLocation}
                  disabled={addressLoading}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                >
                  <MapPin size={16} />
                  {addressLoading ? 'Detecting...' : 'Use My Location'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-tight">
                    Primary Contact Number (WhatsApp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter 10-digit mobile number"
                    value={shippingAddress.phone}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-lg font-bold"
                    required
                  />
                  <p className="text-[10px] text-gray-400 mt-2">This number will be used for delivery coordination and order updates.</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingAddress.pincode}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="India">India</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <PaymentMethod
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
              isProcessing={loading}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product._id} className="flex gap-3">
                    <img
                      src={
                        item.product.images?.[0]?.url ?
                          (item.product.images[0].url.startsWith('/uploads/') ?
                            `/api/image-proxy?path=${item.product.images[0].url.replace('/uploads/', '')}` :
                            item.product.images[0].url
                          ) :
                          (item.product.image || '/images/placeholder-product.svg')
                      }
                      alt={item.product.name}
                      className="w-16 h-16 object-contain bg-gray-50 rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-product.svg';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="font-medium">₹{taxTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Packing & Delivery</span>
                  <span className="font-medium">₹{shippingCost.toFixed(2)}</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-6 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    Place Order
                  </>
                )}
              </button>

              <div className="mt-4 text-xs text-gray-500 text-center">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && createdOrderId && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          orderDetails={{
            orderId: createdOrderId,
            amount: total,
            customerInfo: {
              name: shippingAddress.name,
              email: user?.email || '',
              phone: shippingAddress.phone
            }
          }}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
    </div>
  );
}
