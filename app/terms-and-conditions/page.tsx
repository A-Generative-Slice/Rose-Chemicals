'use client';

import Header from '../../components/Header';

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-12 bg-white my-8 rounded-lg shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Terms and Conditions</h1>

                <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
                        <p>By accessing and using rosechemicals.in, you agree to comply with and be bound by these Terms and Conditions.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">2. Account Responsibility</h2>
                        <p>Users are responsible for maintaining the confidentiality of their account information and password. You agree to accept responsibility for all activities that occur under your account.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">3. Product Information</h2>
                        <p>We strive to display our products, specifications, and prices as accurately as possible. However, we do not warrant that product descriptions or other content are error-free or complete.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">4. Pricing and Payment</h2>
                        <p>All prices are in INR (Indian Rupees). We reserve the right to change prices without notice. Payment must be made at the time of placing an order unless Cash on Delivery is selected.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">5. Intellectual Property</h2>
                        <p>All content on this website, including text, graphics, logos, and images, is the property of Rose Chemicals and is protected by copyright laws.</p>
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
