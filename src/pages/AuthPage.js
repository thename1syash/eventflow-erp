import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, Zap } from 'lucide-react';

export default function AuthPage({ onLogin }) {
  const { login, registerUser, registerVendor, addToast } = useApp();
  const [mode, setMode] = useState('login'); // login | signup-user | signup-vendor
  const [role, setRole] = useState('user');
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', company:'', category:'Decoration' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLogin = () => {
    setErr('');
    const res = login(form.email, form.password, role);
    if (res.ok) { addToast(`Welcome back!`, 'success'); onLogin(); }
    else setErr(res.msg);
  };

  const handleRegisterUser = () => {
    if (!form.name || !form.email || !form.password || !form.phone) { setErr('All fields required'); return; }
    const res = registerUser(form);
    if (res.ok) { addToast('Account created! Please login.', 'success'); setMode('login'); }
    else setErr(res.msg);
  };

  const handleRegisterVendor = () => {
    if (!form.name || !form.email || !form.password || !form.company) { setErr('All fields required'); return; }
    const res = registerVendor(form);
    if (res.ok) { addToast('Vendor registered! Awaiting admin approval.', 'info'); setMode('login'); }
    else setErr(res.msg);
  };

  return (
    <div className="auth-bg">
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() * 300 + 100, height: Math.random() * 300 + 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(249,115,22,0.06)' : 'rgba(139,92,246,0.06)'} 0%, transparent 70%)`,
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
          }} />
        ))}
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon" style={{ width:56, height:56, borderRadius:14, fontSize:26, display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,var(--accent),var(--purple))', margin:'0 auto 12px' }}>🎪</div>
          <h1>EventFlow ERP</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Professional Event Management System</p>
        </div>

        {mode === 'login' && (
          <>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Login As</div>
              <div className="auth-tabs">
                {['user','vendor','admin'].map(r => (
                  <button key={r} className={`auth-tab ${role === r ? 'active' : ''}`} onClick={() => setRole(r)}>
                    {r === 'user' ? '👤 User' : r === 'vendor' ? '🏪 Vendor' : '🔑 Admin'}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} style={{ paddingRight: 44 }} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {err && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14, padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}>{err}</div>}

            <button className="btn btn-primary btn-full" onClick={handleLogin}>Sign In</button>

            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text3)' }}>
              Don't have an account?{' '}
              <button onClick={() => { setMode('signup-user'); setErr(''); }} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Sign Up</button>
              {' '}or{' '}
              <button onClick={() => { setMode('signup-vendor'); setErr(''); }} style={{ color: 'var(--purple)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Register as Vendor</button>
            </div>

            <div style={{ marginTop: 24, padding: 14, background: 'var(--bg3)', borderRadius: 10, fontSize: 12, color: 'var(--text3)' }}>
              <strong style={{ color: 'var(--text2)' }}>Demo credentials:</strong><br />
              Admin: admin@eventflow.com / admin123<br />
              User: rahul@example.com / user123<br />
              Vendor: vendor@starstage.com / vendor123
            </div>
          </>
        )}

        {mode === 'signup-user' && (
          <>
            <h2 style={{ marginBottom: 20, fontSize: 18 }}>Create User Account</h2>
            <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="email@example.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="10-digit mobile number" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="Choose a password" value={form.password} onChange={e => set('password', e.target.value)} /></div>
            {err && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14 }}>{err}</div>}
            <button className="btn btn-primary btn-full" onClick={handleRegisterUser}>Create Account</button>
            <button className="btn btn-ghost btn-full" style={{ marginTop: 10 }} onClick={() => { setMode('login'); setErr(''); }}>← Back to Login</button>
          </>
        )}

        {mode === 'signup-vendor' && (
          <>
            <h2 style={{ marginBottom: 20, fontSize: 18 }}>Register as Vendor</h2>
            <div className="form-group"><label className="form-label">Contact Name</label><input className="form-input" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Company Name</label><input className="form-input" placeholder="Business/Company name" value={form.company} onChange={e => set('company', e.target.value)} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="business@email.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="Mobile number" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
            </div>
            <div className="form-group">
              <label className="form-label">Service Category</label>
              <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                {['Decoration','Stage','Audio','Lighting','Catering','Photography','Entertainment','Transport'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="Choose a password" value={form.password} onChange={e => set('password', e.target.value)} /></div>
            {err && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14 }}>{err}</div>}
            <button className="btn btn-primary btn-full" onClick={handleRegisterVendor}>Submit Application</button>
            <button className="btn btn-ghost btn-full" style={{ marginTop: 10 }} onClick={() => { setMode('login'); setErr(''); }}>← Back to Login</button>
          </>
        )}
      </div>
    </div>
  );
}
