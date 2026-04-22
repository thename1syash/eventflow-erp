import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, EmptyState } from '../components/UI';
import { ShoppingCart, Search, Filter, Star, Package, ArrowRight, Trash2, Plus, Minus, CheckCircle } from 'lucide-react';

export function UserPortal({ setActivePage }) {
  const { currentUser, products, vendors, addToast } = useApp();
  const featured = products.filter(p => p.status === 'available').slice(0, 4);
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="page-content">
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(139,92,246,0.12))', borderRadius: 20, padding: '40px 36px', marginBottom: 28, position: 'relative', overflow: 'hidden', border: '1px solid rgba(249,115,22,0.2)' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(249,115,22,0.2), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700, marginBottom: 10 }}>EventFlow ERP</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 800, marginBottom: 10, lineHeight: 1.2 }}>
          Plan Your Perfect Event<br />
          <span style={{ color: 'var(--accent)' }}>with Premium Vendors</span>
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: 15, marginBottom: 22 }}>Browse stages, sound systems, catering, decoration and more — all in one place.</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" onClick={() => setActivePage('user-products')}>Browse Products <ArrowRight size={16} /></button>
          <button className="btn btn-secondary" onClick={() => setActivePage('user-vendors')}>View Vendors</button>
        </div>
      </div>

      {/* Category pills */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 16 }}>Browse by Category</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} className="btn btn-secondary btn-sm" onClick={() => setActivePage('user-products')}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div>
        <div className="section-header">
          <div className="section-title" style={{ fontSize: 18 }}>Featured Services</div>
          <button className="btn btn-ghost btn-sm" onClick={() => setActivePage('user-products')}>View All →</button>
        </div>
        <div className="products-grid">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, compact }) {
  const { addToCart, addToast } = useApp();
  const handleAdd = () => { addToCart(product); addToast(`${product.name} added to cart!`, 'success'); };

  return (
    <div className="product-card">
      <div className="product-img">{product.emoji}</div>
      <div className="product-body">
        <div className="product-name">{product.name}</div>
        <div className="product-vendor">{product.vendor}</div>
        <span className="badge badge-purple" style={{ marginBottom: 10 }}>{product.category}</span>
        <div className="product-price">₹{product.price.toLocaleString()}</div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 12 }}>{product.unit}</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.5 }}>{product.description}</div>
        <button className="btn btn-primary btn-full btn-sm" onClick={handleAdd}><ShoppingCart size={14} /> Add to Cart</button>
      </div>
    </div>
  );
}

export function UserProducts() {
  const { products } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const filtered = products.filter(p =>
    p.status === 'available' &&
    (category === 'all' || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.vendor.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-content">
      <div className="section-header">
        <div><h2 className="section-title">All Products & Services</h2><div className="section-sub">{filtered.length} items available</div></div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
          <Search size={15} color="var(--text3)" />
          <input placeholder="Search products or vendors..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCategory(c)}>
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🔍" title="No products found" subtitle="Try a different search or category" />
      ) : (
        <div className="products-grid">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

export function UserVendors() {
  const { vendors, products } = useApp();
  const approved = vendors.filter(v => v.status === 'approved');

  return (
    <div className="page-content">
      <div className="section-header">
        <div><h2 className="section-title">Our Vendors</h2><div className="section-sub">{approved.length} verified vendors</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {approved.map(v => {
          const count = products.filter(p => p.vendorId === v.id).length;
          return (
            <div key={v.id} className="card card-hover">
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: 'linear-gradient(135deg, var(--accent), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🏪</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{v.company}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>{v.name} • {v.phone}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="badge badge-purple">{v.category}</span>
                    <span className="badge badge-neutral">{count} products</span>
                    {v.rating > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--warning)' }}><Star size={12} fill="currentColor" />{v.rating}</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function UserCart({ setActivePage }) {
  const { cart, updateCartQty, removeFromCart } = useApp();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const gst = Math.round(total * 0.18);

  return (
    <div className="page-content">
      <div className="section-header">
        <div><h2 className="section-title">My Cart</h2><div className="section-sub">{cart.length} item(s)</div></div>
      </div>

      {cart.length === 0 ? (
        <EmptyState icon="🛒" title="Your cart is empty" subtitle="Browse our products and add items to your cart" action={<button className="btn btn-primary" onClick={() => setActivePage('user-products')}>Browse Products</button>} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
          <div>
            {cart.map(item => (
              <div key={item.productId} className="cart-item">
                <div className="cart-img">{item.emoji}</div>
                <div className="cart-info">
                  <div className="cart-name">{item.name}</div>
                  <div className="cart-vendor">{item.vendor}</div>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--accent)', fontSize: 16, marginTop: 4 }}>₹{(item.price * item.qty).toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => updateCartQty(item.productId, item.qty - 1)}><Minus size={12} /></button>
                    <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateCartQty(item.productId, item.qty + 1)}><Plus size={12} /></button>
                  </div>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => removeFromCart(item.productId)} style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ position: 'sticky', top: 80 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Order Summary</div>
            {cart.map(i => (
              <div key={i.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8, color: 'var(--text2)' }}>
                <span>{i.name} ×{i.qty}</span>
                <span>₹{(i.price * i.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text2)', marginBottom: 6 }}>
              <span>Subtotal</span><span>₹{total.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text2)', marginBottom: 6 }}>
              <span>GST (18%)</span><span>₹{gst.toLocaleString()}</span>
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, fontFamily: 'var(--font-head)', marginBottom: 20 }}>
              <span>Total</span><span style={{ color: 'var(--accent)' }}>₹{(total + gst).toLocaleString()}</span>
            </div>
            <button className="btn btn-primary btn-full" onClick={() => setActivePage('user-checkout')}>Proceed to Checkout <ArrowRight size={16} /></button>
            <button className="btn btn-ghost btn-full" style={{ marginTop: 8 }} onClick={() => setActivePage('user-products')}>Continue Shopping</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function UserCheckout({ setActivePage }) {
  const { cart, placeOrder, addToast } = useApp();
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [success, setSuccess] = useState(null);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const gst = Math.round(total * 0.18);

  const handleOrder = () => {
    if (!address.trim()) { addToast('Please enter event address', 'error'); return; }
    if (payment === 'UPI' && !upiId.trim()) { addToast('Please enter UPI ID', 'error'); return; }
    const res = placeOrder(address, payment);
    if (res.ok) { setSuccess(res.orderId); }
    else addToast(res.msg, 'error');
  };

  if (success) {
    return (
      <div className="page-content">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={40} color="var(--success)" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 28, marginBottom: 8 }}>Order Placed Successfully!</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 4 }}>Order ID: <strong style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{success}</strong></p>
          <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 28 }}>You'll receive a confirmation shortly. Track your order in My Orders.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => setActivePage('user-orders')}>View My Orders</button>
            <button className="btn btn-secondary" onClick={() => setActivePage('user-products')}>Shop More</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="section-header">
        <div><h2 className="section-title">Checkout</h2><div className="section-sub">Complete your order</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Event / Delivery Address</div>
            <div className="form-group">
              <label className="form-label">Full Address</label>
              <textarea className="form-textarea" placeholder="House/Building no., Street, City, State, PIN" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
          </div>

          <div className="card">
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Payment Method</div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              {['UPI','Cash'].map(p => (
                <div key={p} onClick={() => setPayment(p)}
                  style={{ flex: 1, padding: 16, borderRadius: 12, border: `2px solid ${payment === p ? 'var(--accent)' : 'var(--border)'}`, background: payment === p ? 'rgba(249,115,22,0.08)' : 'var(--bg3)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{p === 'UPI' ? '📱' : '💵'}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: payment === p ? 'var(--accent)' : 'var(--text)' }}>{p}</div>
                </div>
              ))}
            </div>
            {payment === 'UPI' && (
              <div className="form-group">
                <label className="form-label">UPI ID</label>
                <input className="form-input" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
              </div>
            )}
            {payment === 'Cash' && (
              <div style={{ padding: 14, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, fontSize: 13, color: 'var(--warning)' }}>
                Cash on delivery/service. Please keep exact change ready.
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ position: 'sticky', top: 80 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Order Summary</div>
          {cart.map(i => (
            <div key={i.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8, color: 'var(--text2)' }}>
              <span>{i.name} ×{i.qty}</span><span>₹{(i.price*i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text2)', marginBottom: 6 }}>
            <span>Subtotal</span><span>₹{total.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text2)', marginBottom: 6 }}>
            <span>GST (18%)</span><span>₹{gst.toLocaleString()}</span>
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, fontFamily: 'var(--font-head)', marginBottom: 20 }}>
            <span>Total</span><span style={{ color: 'var(--accent)' }}>₹{(total+gst).toLocaleString()}</span>
          </div>
          <button className="btn btn-primary btn-full" onClick={handleOrder}>Place Order 🎉</button>
          <button className="btn btn-ghost btn-full" style={{ marginTop: 8 }} onClick={() => setActivePage('user-cart')}>← Back to Cart</button>
        </div>
      </div>
    </div>
  );
}

export function UserOrders() {
  const { currentUser, orders } = useApp();
  const myOrders = orders.filter(o => o.userId === currentUser.id).reverse();

  return (
    <div className="page-content">
      <div className="section-header">
        <div><h2 className="section-title">My Orders</h2><div className="section-sub">{myOrders.length} orders placed</div></div>
      </div>

      {myOrders.length === 0 ? (
        <EmptyState icon="📦" title="No orders yet" subtitle="Place your first order to see it here" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {myOrders.map(o => (
            <div key={o.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                <div>
                  <span style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 700, fontSize: 15 }}>{o.id}</span>
                  <span style={{ marginLeft: 12, fontSize: 13, color: 'var(--text3)' }}>{o.date}</span>
                </div>
                <StatusBadge status={o.status} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                {o.items.map(i => (
                  <div key={i.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text2)' }}>
                    <span>{i.name} ×{i.qty}</span>
                    <span>₹{(i.price*i.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="divider" style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--text3)' }}>📍 {o.address} • {o.payment}</div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 17, color: 'var(--accent)' }}>₹{o.total.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function UserRequestItem() {
  const { requestItem, addToast } = useApp();
  const [form, setForm] = useState({ itemName:'', category:'', description:'', preferredVendor:'', budget:'', eventDate:'' });
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.itemName || !form.description) { addToast('Item name and description required', 'error'); return; }
    requestItem(form);
    addToast('Request submitted! Vendors will be notified.', 'success');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ itemName:'', category:'', description:'', preferredVendor:'', budget:'', eventDate:'' });
  };

  return (
    <div className="page-content">
      <div className="section-header">
        <div><h2 className="section-title">Request an Item</h2><div className="section-sub">Can't find what you need? Let vendors know!</div></div>
      </div>

      <div className="card" style={{ maxWidth: 580 }}>
        <div style={{ marginBottom: 20, padding: 14, background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 10, fontSize: 13, color: 'var(--teal)' }}>
          💡 Submit your requirements and our vendors will contact you with custom quotes.
        </div>

        <div className="form-group"><label className="form-label">Item / Service Name *</label><input className="form-input" value={form.itemName} onChange={e => set('itemName', e.target.value)} placeholder="e.g. Giant LED Wall, Drone Photography" /></div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="">Select category</option>
              {['Stage','Audio','Lighting','Decoration','Catering','Photography','Entertainment','Transport','Other'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Event Date</label><input className="form-input" type="date" value={form.eventDate} onChange={e => set('eventDate', e.target.value)} /></div>
        </div>
        <div className="form-group"><label className="form-label">Description *</label><textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe what you need in detail..." /></div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Budget (₹)</label><input className="form-input" type="number" value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="Your max budget" /></div>
          <div className="form-group"><label className="form-label">Preferred Vendor</label><input className="form-input" value={form.preferredVendor} onChange={e => set('preferredVendor', e.target.value)} placeholder="Optional" /></div>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} disabled={submitted}>
          {submitted ? '✓ Request Submitted!' : 'Submit Request'}
        </button>
      </div>
    </div>
  );
}
