'use client';

import Header from '../../components/Header';

export default function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-12 bg-white my-8 rounded-lg shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Shipping Policy</h1>

                <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">1. Shipping Coverage</h2>
                        <p>We deliver our products across India. While we strive to reach every corner of the country, some remote areas may be subject to limited service availability.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">2. Processing Time</h2>
                        <p>Orders are typically processed within 1-2 business days. Orders placed on weekends or holidays will be processed on the next business day.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">3. Delivery Estimates</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Local (Same City):</strong> 2-3 business days</li>
                            <li><strong>Zonal/Regional:</strong> 3-5 business days</li>
                            <li><strong>Rest of India:</strong> 5-7 business days</li>
                        </ul>
                        <p className="mt-4 italic text-sm text-gray-500">Note: External factors like weather conditions or public holidays might cause delays.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">4. Shipping Charges</h2>
                        <p>Shipping charges are calculated based on the weight of the items and the delivery location. The final shipping cost will be displayed during the checkout process.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">5. Order Tracking</h2>
                        <p>Once your order is shipped, you will receive a tracking ID via email and your account dashboard to monitor your package.</p>
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
