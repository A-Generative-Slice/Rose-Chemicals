'use client';

import Header from '../../components/Header';

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-12 bg-white my-8 rounded-lg shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Refund and Cancellation Policy</h1>

                <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">1. Cancellation Policy</h2>
                        <p>Orders can only be cancelled before they are processed by our warehouse. Once an order is &quot;Packed&quot; or &quot;Shipped&quot;, it cannot be cancelled. To cancel your order, please visit your dashboard or contact our support team immediately.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">2. Refund Eligibility</h2>
                        <p>Refunds are initiated only for:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Damaged products received (proof required)</li>
                            <li>Incorrect items delivered</li>
                            <li>Consignments lost during transit</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">3. Refund Process</h2>
                        <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed to your original method of payment within 5-7 business days.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900">4. Non-Refundable Items</h2>
                        <p>Certain items like used containers or items missing original packaging are not eligible for return or refund unless they were damaged during shipping.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
