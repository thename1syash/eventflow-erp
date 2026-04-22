import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, Modal } from '../components/UI';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

export function AdminOrders() {
  const { orders, updateOrderStatus, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = orders.filter(o =>
    (filter === 'all' || o.status === filter) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) || o.userName.toLowerCase().includes(search.toLowerCase()))
  );

  const statuses = ['confirmed','processing','shipped','delivered','cancelled'];

  return (
    <div className="page-content">
      <div className="section-header">
        <div>
          <h2 className="section-title">All Orders</h2>
          <div className="section-sub">{orders.length} total orders</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
          <Search size={15} color="var(--text3)" />
          <input placeholder="Search by order ID or customer..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['all','confirmed','processing','delivered','cancelled'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Payment</th><th>Date</th><th>Status</th><th>Update</th></tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 600 }}>{o.id}</td>
                <td style={{ color: 'var(--text)', fontWeight: 500 }}>{o.userName}</td>
                <td>
                  {o.items.map(i => <div key={i.productId} style={{ fontSize: 12 }}>{i.name} ×{i.qty}</div>)}
                </td>
                <td style={{ fontWeight: 700, color: 'var(--text)' }}>₹{o.total.toLocaleString()}</td>
                <td>{o.payment}</td>
                <td style={{ fontSize: 13 }}>{o.date}</td>
                <td><StatusBadge status={o.status} /></td>
                <td>
                  <select
                    className="form-select" style={{ padding: '6px 10px', fontSize: 12, minWidth: 110 }}
                    value={o.status}
                    onChange={e => { updateOrderStatus(o.id, e.target.value); addToast(`Order ${o.id} → ${e.target.value}`, 'success'); }}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text3)', padding: 32 }}>No orders found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminProducts() {
  const { products, vendors, addProduct, updateProduct, deleteProduct, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | {product}
  const [form, setForm] = useState({ name:'', category:'Stage', price:'', unit:'per event', vendorId:'', description:'', emoji:'🎭', status:'available' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const approvedVendors = vendors.filter(v => v.status === 'approved');
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.vendor?.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setForm({ name:'', category:'Stage', price:'', unit:'per event', vendorId: approvedVendors[0]?.id || '', description:'', emoji:'🎭', status:'available' });
    setModal('add');
  };

  const openEdit = (p) => {
    setForm({ ...p, price: String(p.price) });
    setModal(p);
  };

  const save = () => {
    if (!form.name || !form.price) { addToast('Name and price required', 'error'); return; }
    const vendor = vendors.find(v => v.id == form.vendorId);
    const data = { ...form, price: parseFloat(form.price), vendor: vendor?.company || vendor?.name || 'N/A' };
    if (modal === 'add') { addProduct(data); addToast('Product added!', 'success'); }
    else { updateProduct(modal.id, data); addToast('Product updated!', 'success'); }
    setModal(null);
  };

  const remove = (p) => {
    if (window.confirm(`Delete ${p.name}?`)) { deleteProduct(p.id); addToast('Product deleted', 'info'); }
  };

  const emojis = ['🎭','🎵','🌸','💡','🍽️','📸','🎪','🎤','🎬','🎊'];
  const categories = ['Stage','Audio','Lighting','Decoration','Catering','Photography','Entertainment','Transport'];

  return (
    <div className="page-content">
      <div className="section-header">
        <div>
          <h2 className="section-title">Products / Services</h2>
          <div className="section-sub">{products.length} listed items</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Product</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="search-bar" style={{ maxWidth: 380 }}>
          <Search size={15} color="var(--text3)" />
          <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Product</th><th>Category</th><th>Vendor</th><th>Price</th><th>Unit</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{p.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text3)' }}>{p.description?.slice(0, 50)}…</div>
                    </div>
                  </div>
                </td>
                <td><span className="badge badge-purple">{p.category}</span></td>
                <td style={{ fontSize: 13 }}>{p.vendor}</td>
                <td style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-head)' }}>₹{p.price.toLocaleString()}</td>
                <td style={{ fontSize: 13, color: 'var(--text3)' }}>{p.unit}</td>
                <td><StatusBadge status={p.status} /></td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => openEdit(p)}><Edit size={13} /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(p)}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add New Product' : 'Edit Product'} onClose={() => setModal(null)}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {emojis.map(e => (
              <button key={e} onClick={() => set('emoji', e)}
                style={{ fontSize: 22, background: form.emoji === e ? 'var(--bg3)' : 'none', border: form.emoji === e ? '2px solid var(--accent)' : '2px solid transparent', borderRadius: 8, padding: 4, cursor: 'pointer' }}>
                {e}
              </button>
            ))}
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Product name" /></div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Price (₹)</label><input className="form-input" type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" /></div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <select className="form-select" value={form.unit} onChange={e => set('unit', e.target.value)}>
                {['per event','per day','per hour','per person','per piece'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Vendor</label>
            <select className="form-select" value={form.vendorId} onChange={e => set('vendorId', e.target.value)}>
              {approvedVendors.map(v => <option key={v.id} value={v.id}>{v.company}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description..." /></div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
              {['available','unavailable'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>Save Product</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
