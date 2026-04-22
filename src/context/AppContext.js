import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

const SEED_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@eventflow.com', password: 'admin123', role: 'admin', phone: '9876543210', status: 'active' },
  { id: 2, name: 'Rahul Sharma', email: 'rahul@example.com', password: 'user123', role: 'user', phone: '9123456789', status: 'active' },
  { id: 3, name: 'Priya Singh', email: 'priya@example.com', password: 'user123', role: 'user', phone: '9234567890', status: 'active' },
];

const SEED_VENDORS = [
  { id: 1, name: 'StarStage Events', email: 'vendor@starstage.com', password: 'vendor123', company: 'StarStage Pvt Ltd', phone: '9988776655', category: 'Decoration', status: 'approved', rating: 4.7 },
  { id: 2, name: 'SoundWave Pro', email: 'soundwave@pro.com', password: 'vendor123', company: 'SoundWave Audio Co.', phone: '9876001122', category: 'Sound & Lighting', status: 'approved', rating: 4.9 },
  { id: 3, name: 'Royal Caterers', email: 'royal@caterers.com', password: 'vendor123', company: 'Royal Food Services', phone: '9765432100', category: 'Catering', status: 'pending', rating: 4.5 },
];

const SEED_PRODUCTS = [
  { id: 1, name: 'Stage Setup – Premium', vendorId: 1, vendor: 'StarStage Events', category: 'Stage', price: 45000, unit: 'per event', emoji: '🎭', status: 'available', description: 'Full premium stage with LED backdrop, curtains, truss lighting' },
  { id: 2, name: 'PA Sound System 10kW', vendorId: 2, vendor: 'SoundWave Pro', category: 'Audio', price: 22000, unit: 'per day', emoji: '🎵', status: 'available', description: 'Professional 10kW line array with subwoofers, monitors and mixers' },
  { id: 3, name: 'Floral Decoration Package', vendorId: 1, vendor: 'StarStage Events', category: 'Decoration', price: 18000, unit: 'per event', emoji: '🌸', status: 'available', description: 'Full venue floral arrangement including entrance, stage and tables' },
  { id: 4, name: 'LED Moving Head Lights ×20', vendorId: 2, vendor: 'SoundWave Pro', category: 'Lighting', price: 12000, unit: 'per day', emoji: '💡', status: 'available', description: '20 x 150W LED moving head wash lights with full DMX control' },
  { id: 5, name: 'Buffet Catering (100 pax)', vendorId: 3, vendor: 'Royal Caterers', category: 'Food', price: 30000, unit: 'per event', emoji: '🍽️', status: 'available', description: 'Full buffet – veg/non-veg, 2 starters, 4 main course, desserts, beverages' },
  { id: 6, name: 'Photo Booth Setup', vendorId: 1, vendor: 'StarStage Events', category: 'Entertainment', price: 8000, unit: 'per day', emoji: '📸', status: 'available', description: 'Themed photo booth with props, instant print and digital sharing' },
];

const SEED_ORDERS = [
  { id: 'ORD-2401', userId: 2, userName: 'Rahul Sharma', items: [{productId:1,name:'Stage Setup – Premium',qty:1,price:45000},{productId:3,name:'Floral Decoration Package',qty:1,price:18000}], total: 63000, status: 'confirmed', payment: 'UPI', date: '2025-01-15', eventDate: '2025-02-10', address: '12, MG Road, Bilaspur, CG' },
  { id: 'ORD-2402', userId: 3, userName: 'Priya Singh', items: [{productId:2,name:'PA Sound System 10kW',qty:1,price:22000},{productId:4,name:'LED Moving Head Lights ×20',qty:1,price:12000}], total: 34000, status: 'processing', payment: 'Cash', date: '2025-01-18', eventDate: '2025-02-14', address: '45, Civil Lines, Raipur, CG' },
  { id: 'ORD-2403', userId: 2, userName: 'Rahul Sharma', items: [{productId:5,name:'Buffet Catering (100 pax)',qty:1,price:30000}], total: 30000, status: 'delivered', payment: 'UPI', date: '2024-12-20', eventDate: '2025-01-05', address: '12, MG Road, Bilaspur, CG' },
];

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(SEED_USERS);
  const [vendors, setVendors] = useState(SEED_VENDORS);
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [orders, setOrders] = useState(SEED_ORDERS);
  const [cart, setCart] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [requestedItems, setRequestedItems] = useState([]);

  const addToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const login = (email, password, role) => {
    if (role === 'admin') {
      const admin = users.find(u => u.email === email && u.password === password && u.role === 'admin');
      if (admin) { setCurrentUser({ ...admin }); return { ok: true }; }
      return { ok: false, msg: 'Invalid admin credentials' };
    }
    if (role === 'vendor') {
      const vendor = vendors.find(v => v.email === email && v.password === password);
      if (vendor) { setCurrentUser({ ...vendor, role: 'vendor' }); return { ok: true }; }
      return { ok: false, msg: 'Invalid vendor credentials' };
    }
    if (role === 'user') {
      const user = users.find(u => u.email === email && u.password === password && u.role === 'user');
      if (user) { setCurrentUser({ ...user }); return { ok: true }; }
      return { ok: false, msg: 'Invalid user credentials' };
    }
    return { ok: false, msg: 'Select a role' };
  };

  const logout = () => { setCurrentUser(null); setCart([]); };

  const registerUser = (data) => {
    if (users.find(u => u.email === data.email)) return { ok: false, msg: 'Email already registered' };
    const newUser = { id: Date.now(), ...data, role: 'user', status: 'active' };
    setUsers(u => [...u, newUser]);
    return { ok: true };
  };

  const registerVendor = (data) => {
    if (vendors.find(v => v.email === data.email)) return { ok: false, msg: 'Email already registered' };
    const newVendor = { id: Date.now(), ...data, status: 'pending', rating: 0, role: 'vendor' };
    setVendors(v => [...v, newVendor]);
    return { ok: true };
  };

  const addToCart = (product, qty = 1) => {
    setCart(c => {
      const existing = c.find(i => i.productId === product.id);
      if (existing) return c.map(i => i.productId === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...c, { productId: product.id, name: product.name, price: product.price, emoji: product.emoji, vendor: product.vendor, qty }];
    });
  };

  const removeFromCart = (productId) => setCart(c => c.filter(i => i.productId !== productId));
  const updateCartQty = (productId, qty) => {
    if (qty < 1) { removeFromCart(productId); return; }
    setCart(c => c.map(i => i.productId === productId ? { ...i, qty } : i));
  };

  const placeOrder = (address, payment) => {
    if (!cart.length) return { ok: false, msg: 'Cart is empty' };
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const order = {
      id: 'ORD-' + (2400 + orders.length + 1),
      userId: currentUser.id, userName: currentUser.name,
      items: cart.map(i => ({ productId: i.productId, name: i.name, qty: i.qty, price: i.price })),
      total, status: 'confirmed', payment, date: new Date().toISOString().split('T')[0],
      eventDate: '', address
    };
    setOrders(o => [...o, order]);
    setCart([]);
    return { ok: true, orderId: order.id };
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(o => o.map(x => x.id === orderId ? { ...x, status } : x));
  };

  const addProduct = (data) => {
    const product = { id: Date.now(), ...data, status: 'available' };
    setProducts(p => [...p, product]);
    return { ok: true };
  };

  const updateProduct = (id, data) => {
    setProducts(p => p.map(x => x.id === id ? { ...x, ...data } : x));
  };

  const deleteProduct = (id) => setProducts(p => p.filter(x => x.id !== id));

  const updateVendorStatus = (id, status) => setVendors(v => v.map(x => x.id === id ? { ...x, status } : x));
  const updateUserStatus = (id, status) => setUsers(u => u.map(x => x.id === id ? { ...x, status } : x));

  const requestItem = (data) => {
    setRequestedItems(r => [...r, { id: Date.now(), ...data, status: 'pending', date: new Date().toISOString().split('T')[0] }]);
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, vendors, products, orders, cart, toasts, requestedItems,
      login, logout, registerUser, registerVendor,
      addToCart, removeFromCart, updateCartQty, placeOrder,
      addProduct, updateProduct, deleteProduct,
      updateOrderStatus, updateVendorStatus, updateUserStatus,
      requestItem, addToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
