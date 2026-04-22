import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, Modal } from '../components/UI';
import { Search, UserPlus, Edit, Trash2 } from 'lucide-react';

export default function AdminUsers() {
  const { users, updateUserStatus, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const userList = users.filter(u => u.role === 'user');
  const filtered = userList.filter(u =>
    (filter === 'all' || u.status === filter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleStatus = (u) => {
    const newStatus = u.status === 'active' ? 'inactive' : 'active';
    updateUserStatus(u.id, newStatus);
    addToast(`User ${u.name} ${newStatus === 'active' ? 'activated' : 'deactivated'}`, newStatus === 'active' ? 'success' : 'info');
  };

  return (
    <div className="page-content">
      <div className="section-header">
        <div>
          <h2 className="section-title">Manage Users</h2>
          <div className="section-sub">{userList.length} registered users</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
          <Search size={15} color="var(--text3)" />
          <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['all','active','inactive'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id}>
                <td style={{ color: 'var(--text3)' }}>{i + 1}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,var(--teal),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      {u.name.split(' ').map(w => w[0]).join('').slice(0,2)}
                    </div>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{u.name}</span>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td><StatusBadge status={u.status} /></td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className={`btn btn-sm ${u.status === 'active' ? 'btn-danger' : 'btn-success'}`} onClick={() => toggleStatus(u)}>
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text3)', padding: 32 }}>No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
