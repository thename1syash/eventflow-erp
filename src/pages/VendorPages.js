import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, Modal, EmptyState } from '../components/UI';
import { Package, ShoppingBag, TrendingUp, Plus, Edit, Trash2, Search } from 'lucide-react';

export function VendorDashboard({ setActivePage }) {
  const { currentUser, products, orders, addToast } = useApp();

  const myProducts = products.filter(p => p.vendorId === currentUser.id);
  const myOrderItems = orders.filter(o => o.items.some(i => myProducts.find(p => p.id === i.productId)));
  const revenue = myOrderItems.reduce((s, o) => {
    const mine = o.items.filter(i => myProducts.find(p => p.id === i.productId));
    return s + mine.reduce((ss, i) => ss + i.price * i.qty, 0);
  }, 0);

  if (currentUser.status === 'pending') {
    return (
      <div className="page-content">
        <div style={{ textAlign: 'center', padding: 80 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>⏳</div>
          <h2 style={{ fontFamily: 'var(--font-head)', marginBottom: 8 }}>Approval Pending</h2>
          <p style={{ color: 'var(--text2)', fontSize: 15 }}>Your vendor application is under review. Admin will approve it shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="section-header">
        <div>
          <h2 className="section-title">Welcome, {currentUser.name}!</h2>
          <div className="section-sub">{currentUser.company} — {currentUser.category}</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ '--accent-color': 'var(--accent)' }}>
          <div className="stat-label">My Products</div>
          <div className="stat-value">{myProducts.length}</div>
          <div className="stat-sub">Active listings</div>
          <div className="stat-icon"><Package size={20} /></div>
        </div>
        <div className="stat-card" style={{ '--accent-color': 'var(--purple)' }}>
          <div className="stat-label">Orders Received</div>
          <div className="stat-value">{myOrderItems.length}</div>
          <div className="stat-sub">All time</div>
          <div className="stat-icon"><ShoppingBag size={20} /></div>
        </div>
        <div className="stat-card" style={{ '--accent-color': 'var(--success)' }}>
          <div className="stat-label">Revenue</div>
          <div className="stat-value">₹{(revenue/1000).toFixed(0)}K</div>
          <div className="stat-sub">Total earned</div>
          <div className="stat-icon"><TrendingUp size={20} /></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-primary" onClick={() => setActivePage('vendor-add-item')}><Plus size={16} />Add New Product</button>
            <button className="btn btn-secondary" onClick={() => setActivePage('vendor-products')}>View My Products</button>
            <button className="btn btn-secondary" onClick={() => setActivePage('vendor-orders')}>View Orders</button>
          </div>
        </div>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Recent Products</div>
          {myProducts.slice(-3).reverse().map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{p.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: 14 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>₹{p.price.toLocaleString()} {p.unit}</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
          {myProducts.length === 0 && <div style={{ color: 'var(--text3)', fontSize: 14 }}>No products yet</div>}
        </div>
      </div>
    </div>
  );
}

export function VendorProducts({ setActivePage }) {
  const { currentUser, products, deleteProduct, addToast } = useApp();
  const myProducts = products.filter(p => p.vendorId === currentUser.id);

  const remove = (p) => {
    if (window.confirm(`Delete ${p.name}?`)) { deleteProduct(p.id); addToast('Product deleted', 'info'); }
  };

  return (
    <div className="page-content">
      <div className="section-header">
        <div><h2 className="section-title">My Products</h2><div className="section-sub">{myProducts.length} listings</div></div>
        <button className="btn btn-primary" onClick={() => setActivePage('vendor-add-item')}><Plus size={16} /> Add Product</button>
      </div>

      {myProducts.length === 0 ? (
        <EmptyState icon="📦" title="No products yet" subtitle="Start adding your event services and products" action={<button className="btn btn-primary" onClick={() => setActivePage('vendor-add-item')}><Plus size={16} /> Add First Product</button>} />
      ) : (
        <div className="products-grid">
          {myProducts.map(p => (
            <div key={p.id} className="product-card">
              <div className="product-img">{p.emoji}</div>
              <div className="product-body">
                <div className="product-name">{p.name}</div>
                <div className="product-vendor">{p.category}</div>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 10 }}>{p.description?.slice(0,80)}…</div>
                <div className="product-price">₹{p.price.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>{p.unit}</div>
                <div className="product-footer">
                  <StatusBadge status={p.status} />
                  <button className="btn btn-sm btn-danger" onClick={() => remove(p)}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function VendorAddItem({ setActivePage }) {
  const { currentUser, addProduct, addToast } = useApp();
  const [form, setForm] = useState({ name:'', category:'Stage', price:'', unit:'per event', description:'', emoji:'🎭', status:'available' });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.price) { addToast('Name and price required', 'error'); return; }
    addProduct({ ...form, price: parseFloat(form.price), vendorId: currentUser.id, vendor: currentUser.company });
    addToast('Product added successfully!', 'success');
    setSaved(true);
    setTimeout(() => { setSaved(false); setActivePage('vendor-products'); }, 1500);
  };

  const emojis = ['🎭','🎵','🌸','💡','🍽️','📸','🎪','🎤','🎬','🎊','🎈','🏮'];
  const categories = ['Stage','Audio','Lighting','Decoration','Catering','Photography','Entertainment','Transport'];

  return (
    <div className="page-content">
      <div className="section-header">
        <div><h2 className="section-title">Add New Item</h2><div className="section-sub">List a new service or product</div></div>
      </div>

      <div className="card" style={{ maxWidth: 620 }}>
        <div className="form-group">
          <label className="form-label">Choose an Icon</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {emojis.map(e => (
              <button key={e} onClick={() => set('emoji', e)}
                style={{ fontSize: 24, background: form.emoji === e ? 'rgba(249,115,22,0.15)' : 'var(--bg3)', border: form.emoji === e ? '2px solid var(--accent)' : '2px solid transparent', borderRadius: 10, padding: 8, cursor: 'pointer', transition: 'all 0.15s' }}>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Product / Service Name *</label>
            <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Premium Stage Setup" />
          </div>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Price (₹) *</label>
            <input className="form-input" type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" />
          </div>
          <div className="form-group">
            <label className="form-label">Pricing Unit</label>
            <select className="form-select" value={form.unit} onChange={e => set('unit', e.target.value)}>
              {['per event','per day','per hour','per person','per piece'].map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe what's included in this package..." />
        </div>

        <div className="form-group">
          <label className="form-label">Availability</label>
          <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={() => setActivePage('vendor-products')}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saved}>
            {saved ? '✓ Saved!' : <><Plus size={16} /> Add Product</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export function VendorProductStatus() {
  const { currentUser, products } = useApp();
  const myProducts = products.filter(p => p.vendorId === currentUser.id);

  return (
    <div className="page-content">
      <div className="section-header">
        <div><h2 className="section-title">Product Status</h2><div className="section-sub">Track availability of your listings</div></div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Product</th><th>Category</th><th>Price</th><th>Unit</th><th>Status</th></tr>
          </thead>
          <tbody>
            {myProducts.map(p => (
              <tr key={p.id}>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 20 }}>{p.emoji}</span><span style={{ fontWeight: 500, color: 'var(--text)' }}>{p.name}</span></div></td>
                <td><span className="badge badge-purple">{p.category}</span></td>
                <td style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{p.price.toLocaleString()}</td>
                <td style={{ fontSize: 13, color: 'var(--text3)' }}>{p.unit}</td>
                <td><StatusBadge status={p.status} /></td>
              </tr>
            ))}
            {myProducts.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text3)', padding: 32 }}>No products added yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function VendorOrders() {
  const { currentUser, products, orders, updateOrderStatus, addToast } = useApp();
  const myProducts = products.filter(p => p.vendorId === currentUser.id);
  const myOrders = orders.filter(o => o.items.some(i => myProducts.find(p => p.id === i.productId)));

  return (
    <div className="page-content">
      <div className="section-header">
        <div><h2 className="section-title">Order Requests</h2><div className="section-sub">{myOrders.length} orders for your products</div></div>
      </div>

      {myOrders.length === 0 ? (
        <EmptyState icon="📋" title="No orders yet" subtitle="Orders for your products will appear here" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {myOrders.map(o => (
            <div key={o.id} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 700, fontSize: 15 }}>{o.id}</div>
                  <div style={{ fontWeight: 600, color: 'var(--text)', marginTop: 2 }}>{o.userName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{o.address}</div>
                  <div style={{ marginTop: 8 }}>
                    {o.items.filter(i => myProducts.find(p => p.id === i.productId)).map(i => (
                      <div key={i.productId} style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', gap: 8 }}>
                        <span>{i.name}</span><span>×{i.qty}</span><span style={{ color: 'var(--accent)' }}>₹{(i.price*i.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={o.status} />
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>{o.date}</div>
                  <div style={{ marginTop: 10 }}>
                    <select className="form-select" style={{ padding: '6px 10px', fontSize: 12 }} value={o.status}
                      onChange={e => { updateOrderStatus(o.id, e.target.value); addToast(`Order ${o.id} updated`, 'success'); }}>
                      {['confirmed','processing','shipped','delivered','cancelled'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
