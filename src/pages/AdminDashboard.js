import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/UI';
import { Users, Store, ShoppingBag, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminDashboard({ setActivePage }) {
  const { users, vendors, orders, products } = useApp();

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingVendors = vendors.filter(v => v.status === 'pending').length;
  const activeUsers = users.filter(u => u.role === 'user').length;
  const recentOrders = [...orders].reverse().slice(0, 5);

  const stats = [
    { label: 'Total Users', value: activeUsers, icon: Users, color: 'var(--teal)', sub: 'Registered users' },
    { label: 'Total Vendors', value: vendors.length, icon: Store, color: 'var(--purple)', sub: `${pendingVendors} pending approval` },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'var(--accent)', sub: 'All time' },
    { label: 'Revenue', value: `₹${(totalRevenue/1000).toFixed(0)}K`, icon: TrendingUp, color: 'var(--success)', sub: 'Total collected' },
  ];

  return (
    <div className="page-content">
      <div className="section-header">
        <div>
          <h2 className="section-title">Admin Dashboard</h2>
          <div className="section-sub">Complete event management overview</div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ '--accent-color': s.color }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
            <div className="stat-icon"><s.icon size={20} /></div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Pending Vendors Alert */}
        {pendingVendors > 0 && (
          <div className="card" style={{ borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AlertTriangle size={20} color="var(--warning)" />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>{pendingVendors} Vendor(s) Awaiting Approval</div>
                <div style={{ fontSize: 13, color: 'var(--text3)' }}>Review and approve vendor applications</div>
              </div>
              <button className="btn btn-sm btn-secondary" style={{ marginLeft: 'auto' }} onClick={() => setActivePage('admin-vendors')}>
                Review →
              </button>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Quick Actions</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-sm btn-secondary" onClick={() => setActivePage('admin-users')}>Manage Users</button>
            <button className="btn btn-sm btn-secondary" onClick={() => setActivePage('admin-vendors')}>Manage Vendors</button>
            <button className="btn btn-sm btn-secondary" onClick={() => setActivePage('admin-products')}>Products</button>
            <button className="btn btn-sm btn-secondary" onClick={() => setActivePage('admin-orders')}>All Orders</button>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="section-title" style={{ fontSize: 16 }}>Recent Orders</div>
          <button className="btn btn-sm btn-ghost" onClick={() => setActivePage('admin-orders')}>View All →</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 600 }}>{o.id}</td>
                  <td style={{ color: 'var(--text)', fontWeight: 500 }}>{o.userName}</td>
                  <td>{o.items.length} item(s)</td>
                  <td style={{ fontWeight: 600, color: 'var(--text)' }}>₹{o.total.toLocaleString()}</td>
                  <td>{o.payment}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
