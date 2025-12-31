import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Eye,
    MoreVertical,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Mail,
    Phone,
    Building,
    FileText,
    MessageSquare
} from 'lucide-react';
import { adminAPI } from '../../services/api';

interface Inquiry {
    _id: string;
    type: 'quote' | 'contact';
    name: string;
    email: string;
    phone?: string;
    company?: string;
    industry?: string;
    subject?: string;
    message?: string;
    productCategories?: string[];
    quantity?: string; // quote specific
    budget?: string; // quote specific
    timeline?: string; // quote specific
    status: 'pending' | 'in-progress' | 'resolved' | 'closed';
    adminNotes?: string;
    createdAt: string;
}

export default function InquiriesManagement() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, quote, contact
    const [filterStatus, setFilterStatus] = useState('all');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getInquiries();
            if (response.success) {
                setInquiries(response.inquiries || []);
            }
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            setActionLoading(true);
            const response = await adminAPI.updateInquiryStatus(id, { status: newStatus });

            if (response.success) {
                setInquiries(prev => prev.map(inq =>
                    inq._id === id ? { ...inq, status: newStatus as any } : inq
                ));
                if (selectedInquiry?._id === id) {
                    setSelectedInquiry(prev => prev ? { ...prev, status: newStatus as any } : null);
                }
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredInquiries = inquiries.filter(inq => {
        const matchesSearch =
            inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (inq.company && inq.company.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = filterType === 'all' || inq.type === filterType;
        const matchesStatus = filterStatus === 'all' || inq.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Inquiries & Quotes</h2>
                <div className="flex gap-2">
                    <button
                        onClick={fetchInquiries}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        title="Refresh"
                    >
                        <Clock size={20} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative col-span-1 md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">All Types</option>
                    <option value="quote">Quote Requests</option>
                    <option value="contact">Contact Messages</option>
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading inquiries...</div>
                ) : filteredInquiries.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No inquiries found matching your filters.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name / Company</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredInquiries.map((inq) => (
                                    <tr key={inq._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(inq.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{inq.name}</div>
                                            {inq.company && <div className="text-sm text-gray-500">{inq.company}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${inq.type === 'quote' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {inq.type === 'quote' ? 'Quote Request' : 'Contact Message'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inq.status)}`}>
                                                {inq.status.charAt(0).toUpperCase() + inq.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedInquiry(inq)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="text-xl font-bold text-gray-900">
                                {selectedInquiry.type === 'quote' ? 'Quote Request Details' : 'Message Details'}
                            </h3>
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Control */}
                            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                                <div>
                                    <span className="text-sm text-gray-500 block mb-1">Current Status</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(selectedInquiry.status)}`}>
                                        {selectedInquiry.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {['pending', 'in-progress', 'resolved', 'closed'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusUpdate(selectedInquiry._id, status)}
                                            disabled={actionLoading || selectedInquiry.status === status}
                                            className={`px-3 py-1 text-xs rounded-md border text-sm capitalize
                        ${selectedInquiry.status === status
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    : 'bg-white hover:bg-gray-50 text-gray-700'
                                                }
                      `}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 border-b pb-2">Contact Info</h4>
                                    <div className="space-y-2">
                                        <p className="flex items-center gap-2 text-gray-600">
                                            <span className="font-medium text-gray-800">Name:</span> {selectedInquiry.name}
                                        </p>
                                        <p className="flex items-center gap-2 text-gray-600">
                                            <Mail size={16} /> {selectedInquiry.email}
                                        </p>
                                        {selectedInquiry.phone && (
                                            <p className="flex items-center gap-2 text-gray-600">
                                                <Phone size={16} /> {selectedInquiry.phone}
                                            </p>
                                        )}
                                        {selectedInquiry.company && (
                                            <p className="flex items-center gap-2 text-gray-600">
                                                <Building size={16} /> {selectedInquiry.company}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {selectedInquiry.type === 'quote' && (
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900 border-b pb-2">Quote Specifics</h4>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Industry:</span> {selectedInquiry.industry || 'N/A'}</p>
                                            <p><span className="font-medium">Quantity:</span> {selectedInquiry.quantity || 'N/A'}</p>
                                            <p><span className="font-medium">Budget:</span> {selectedInquiry.budget || 'N/A'}</p>
                                            <p><span className="font-medium">Timeline:</span> {selectedInquiry.timeline || 'N/A'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Message / Categories */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 border-b pb-2">Content</h4>

                                {selectedInquiry.subject && (
                                    <p className="text-gray-800"><span className="font-medium">Subject:</span> {selectedInquiry.subject}</p>
                                )}

                                {selectedInquiry.productCategories && selectedInquiry.productCategories.length > 0 && (
                                    <div>
                                        <span className="font-medium text-gray-800 block mb-2">Interested Categories:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedInquiry.productCategories.map((cat, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="font-medium text-gray-800 block mb-2">Message / Requirements:</span>
                                    <p className="text-gray-600 whitespace-pre-wrap">
                                        {selectedInquiry.message || 'No message content provided.'}
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end pt-4 border-t">
                                <button
                                    onClick={() => setSelectedInquiry(null)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
