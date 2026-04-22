import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Package, ShoppingCart, ClipboardList,
  Users, Store, LogOut, PlusCircle, FileText, TrendingUp
} from 'lucide-react';

const adminNav = [
  { section: 'Overview', items: [
    { label: 'Dashboard', icon: LayoutDashboard, key: 'admin-dashboard' },
  ]},
  { section: 'Management', items: [
    { label: 'Manage Users',   icon: Users,        key: 'admin-users' },
    { label: 'Manage Vendors', icon: Store,         key: 'admin-vendors' },
    { label: 'All Orders',     icon: ClipboardList, key: 'admin-orders' },
    { label: 'Products',       icon: Package,       key: 'admin-products' },
  ]},
];

const vendorNav = [
  { section: 'Overview', items: [
    { label: 'Dashboard', icon: LayoutDashboard, key: 'vendor-dashboard' },
  ]},
  { section: 'Catalog', items: [
    { label: 'My Products',    icon: Package,    key: 'vendor-products' },
    { label: 'Add Item',       icon: PlusCircle, key: 'vendor-add-item' },
    { label: 'Product Status', icon: TrendingUp, key: 'vendor-product-status' },
  ]},
  { section: 'Orders', items: [
    { label: 'Order Requests', icon: ClipboardList, key: 'vendor-orders' },
  ]},
];

const userNav = [
  { section: 'Browse', items: [
    { label: 'Home',     icon: LayoutDashboard, key: 'user-portal' },
    { label: 'Products', icon: Package,         key: 'user-products' },
    { label: 'Vendors',  icon: Store,           key: 'user-vendors' },
  ]},
  { section: 'Orders', items: [
    { label: 'My Cart',      icon: ShoppingCart,  key: 'user-cart' },
    { label: 'My Orders',    icon: ClipboardList, key: 'user-orders' },
    { label: 'Request Item', icon: FileText,      key: 'user-request' },
  ]},
];

export default function Layout({ activePage, setActivePage }) {
  const { currentUser, logout, cart } = useApp();

  const navConfig = currentUser?.role === 'admin' ? adminNav
    : currentUser?.role === 'vendor' ? vendorNav : userNav;

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const initials = (currentUser?.name || '??').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">🎪</div>
          <div>
            <div className="logo-text">EventFlow</div>
            <div className="logo-sub">ERP System</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navConfig.map(section => (
          <div key={section.section}>
            <div className="nav-section-label">{section.section}</div>
            {section.items.map(item => (
              <button
                key={item.key}
                className={`nav-item ${activePage === item.key ? 'active' : ''}`}
                onClick={() => setActivePage(item.key)}
              >
                <item.icon size={18} className="nav-icon" />
                <span>{item.label}</span>
                {item.key === 'user-cart' && cartCount > 0 && (
                  <span className="nav-badge">{cartCount}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip" style={{ marginBottom: 8 }}>
          <div className="user-avatar">{initials}</div>
          <div>
            <div className="user-name">{currentUser?.name}</div>
            <div className="user-role">
              {currentUser?.role === 'vendor' ? currentUser?.company : currentUser?.role}
            </div>
          </div>
        </div>
        <button className="nav-item" onClick={logout} style={{ width: '100%', color: 'var(--danger)' }}>
          <LogOut size={18} className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
