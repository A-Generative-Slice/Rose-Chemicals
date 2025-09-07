'use client';

import React, { useState, useEffect } from 'react';
import InventoryManagement from '@/components/admin/InventoryManagement';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';

const AdminDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      redirect('/auth/login');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const tabs = [
    { id: 'inventory', label: 'Inventory Management', icon: '📦' },
    { id: 'orders', label: 'Order Management', icon: '📋' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'inventory':
        return <InventoryManagement />;
      case 'orders':
        return <div className="p-6"><h2 className="text-2xl font-bold">Order Management</h2><p>Coming soon...</p></div>;
      case 'users':
        return <div className="p-6"><h2 className="text-2xl font-bold">User Management</h2><p>Coming soon...</p></div>;
      case 'analytics':
        return <div className="p-6"><h2 className="text-2xl font-bold">Analytics</h2><p>Coming soon...</p></div>;
      default:
        return <InventoryManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-rose-100 text-rose-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
