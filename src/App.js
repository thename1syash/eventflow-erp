import React, { useState } from 'react';
import './index.css';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/UI';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminVendors from './pages/AdminVendors';
import { AdminOrders, AdminProducts } from './pages/AdminOrdersProducts';
import {
  VendorDashboard, VendorProducts, VendorAddItem,
  VendorProductStatus, VendorOrders
} from './pages/VendorPages';
import {
  UserPortal, UserProducts, UserVendors,
  UserCart, UserCheckout, UserOrders, UserRequestItem
} from './pages/UserPages';

function AppInner() {
  const { currentUser } = useApp();
  const [activePage, setActivePage] = useState(null);

  // Set default page on login
  const handleLogin = () => {
    // will re-render and currentUser will be set
  };

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // Default pages per role
  const defaultPage = currentUser.role === 'admin' ? 'admin-dashboard'
    : currentUser.role === 'vendor' ? 'vendor-dashboard'
    : 'user-portal';

  const page = activePage || defaultPage;

  const renderPage = () => {
    switch (page) {
      // Admin
      case 'admin-dashboard': return <AdminDashboard setActivePage={setActivePage} />;
      case 'admin-users':     return <AdminUsers />;
      case 'admin-vendors':   return <AdminVendors />;
      case 'admin-orders':    return <AdminOrders />;
      case 'admin-products':  return <AdminProducts />;
      // Vendor
      case 'vendor-dashboard':      return <VendorDashboard setActivePage={setActivePage} />;
      case 'vendor-products':       return <VendorProducts setActivePage={setActivePage} />;
      case 'vendor-add-item':       return <VendorAddItem setActivePage={setActivePage} />;
      case 'vendor-product-status': return <VendorProductStatus />;
      case 'vendor-orders':         return <VendorOrders />;
      // User
      case 'user-portal':    return <UserPortal setActivePage={setActivePage} />;
      case 'user-products':  return <UserProducts />;
      case 'user-vendors':   return <UserVendors />;
      case 'user-cart':      return <UserCart setActivePage={setActivePage} />;
      case 'user-checkout':  return <UserCheckout setActivePage={setActivePage} />;
      case 'user-orders':    return <UserOrders />;
      case 'user-request':   return <UserRequestItem />;
      default:               return <AdminDashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-layout">
      <Layout activePage={page} setActivePage={setActivePage} />
      <div className="main-content" style={{ marginLeft: 260 }}>
        <div className="topbar">
          <div className="topbar-title">
            {page.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Dashboard'}
          </div>
          <div className="topbar-actions">
            <div className="search-bar" style={{ minWidth: 200 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input placeholder="Search..." />
            </div>
          </div>
        </div>
        {renderPage()}
      </div>
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
