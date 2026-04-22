import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/UI';
import { Search, Star, CheckCircle, XCircle } from 'lucide-react';

export default function AdminVendors() {
  const { vendors, updateVendorStatus, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = vendors.filter(v =>
    (filter === 'all' || v.status === filter) &&
    (v.name.toLowerCase().includes(search.toLowerCase()) || v.company?.toLowerCase().includes(search.toLowerCase()))
  );

  const approve = (v) => { updateVendorStatus(v.id, 'approved'); addToast(`${v.company} approved!`, 'success'); };
  const reject = (v) => { updateVendorStatus(v.id, 'rejected'); addToast(`${v.company} rejected.`, 'info'); };

  return (
    <div className="page-content">
      <div className="section-header">
        <div>
          <h2 className="section-title">Manage Vendors</h2>
          <div className="section-sub">{vendors.length} vendors • {vendors.filter(v=>v.status==='pending').length} pending</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
          <Search size={15} color="var(--text3)" />
          <input placeholder="Search vendors..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['all','pending','approved','rejected'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {filtered.map(v => (
          <div key={v.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,var(--accent),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🏪</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{v.company}</div>
              <div style={{ fontSize: 13, color: 'var(--text3)' }}>{v.name} • {v.email} • {v.phone}</div>
              <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-purple">{v.category}</span>
                {v.rating > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--warning)' }}><Star size={12} fill="currentColor" />{v.rating}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <StatusBadge status={v.status} />
              {v.status === 'pending' && (
                <>
                  <button className="btn btn-sm btn-success" onClick={() => approve(v)}><CheckCircle size={14} /> Approve</button>
                  <button className="btn btn-sm btn-danger" onClick={() => reject(v)}><XCircle size={14} /> Reject</button>
                </>
              )}
              {v.status === 'approved' && (
                <button className="btn btn-sm btn-danger" onClick={() => reject(v)}>Suspend</button>
              )}
              {v.status === 'rejected' && (
                <button className="btn btn-sm btn-success" onClick={() => approve(v)}>Re-approve</button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text3)', padding: 48 }}>No vendors found</div>
        )}
      </div>
    </div>
  );
}
