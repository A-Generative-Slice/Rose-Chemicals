'use client';

import Header from '../../components/Header';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-12 bg-white my-8 rounded-lg shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Privacy Policy</h1>

                <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">1. Information Collection</h2>
                        <p>We collect information that you provide directly to us when you create an account, place an order, or contact us. This includes your name, email, phone number, and shipping address.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
                        <p>We use your information effectively to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Process and fulfill your orders</li>
                            <li>Send transaction emails and updates</li>
                            <li>Improve our website and customer service</li>
                            <li>Communicate with you about promotions or news</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">3. Data Security</h2>
                        <p>We implement a variety of security measures to maintain the safety of your personal information. Your sensitive data (like credit card info) is processed through secure gateways like Razorpay.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">4. Cookies</h2>
                        <p>We use cookies to enhance your browsing experience, remember your cart items, and understand website traffic.</p>
                    </section>
                    <section className="mt-8 border-t pt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Business Name:</strong> Rose Chemicals</p>
                            <p><strong>Support Email:</strong> <a href="mailto:contact@rosechemicals.in" className="text-blue-600 hover:underline">contact@rosechemicals.in</a></p>
                            <p><strong>Phone Number:</strong> <a href="tel:+918610570490" className="text-blue-600 hover:underline">+91 8610570490</a></p>
                            <p><strong>Business Address:</strong> 1st street, Tagore Nagar, Tiruppalai, Madurai, Tamil Nadu 625014</p>
                            <p><strong>Working Hours:</strong> Mon-Sat | 9 AM - 6 PM</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
