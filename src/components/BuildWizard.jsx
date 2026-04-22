import React, { useState, useEffect } from 'react';
import { fetchNiches, identifyUser, startBuild } from '../utils/api';
import styles from './BuildWizard.module.css';

const DEFAULT_NICHES = [
  { slug: 'pet',     name: 'Pet Wellness & Smart Tech',  icon: '🐾' },
  { slug: 'home',    name: 'Home Office & Productivity', icon: '🏠' },
  { slug: 'fitness', name: 'Fitness & Recovery',         icon: '💪' },
  { slug: 'beauty',  name: 'Beauty & Skincare',          icon: '✨' },
  { slug: 'baby',    name: 'Baby & Parenting',           icon: '🍼' },
  { slug: 'outdoor', name: 'Outdoor & Hiking',           icon: '🏕️' },
];

export default function BuildWizard({ onStart }) {
  const [niches, setNiches] = useState(DEFAULT_NICHES);
  const [form, setForm] = useState({ email: '', niche: 'pet', storeName: '', marginPct: 30, productCount: 50 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNiches().then(setNiches).catch(() => {});
  }, []);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.storeName || !form.niche) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const user = await identifyUser(form.email);
      // Payment check — redirect to checkout if needed
      if (process.env.REACT_APP_LS_CHECKOUT_URL && !user.has_paid) {
        window.location.href = `${process.env.REACT_APP_LS_CHECKOUT_URL}?checkout[email]=${encodeURIComponent(form.email)}`;
        return;
      }
      const { jobId } = await startBuild(form);
      onStart(form, jobId);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <div className={styles.badge}>
          <span className={styles.dot} />
          AI-Powered Store Builder
        </div>

        <h1 className={styles.title}>
          Your store.<br />
          <span className={styles.accent}>Built in 60 seconds.</span>
        </h1>
        <p className={styles.sub}>
          Pick a niche, set your margin, click build. We generate your entire Shopify store —
          products, ad copy, email sequences, policies — everything.
        </p>

        <form className={styles.card} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Your email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Store name</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. PawPeak"
              value={form.storeName}
              onChange={e => set('storeName', e.target.value)}
              maxLength={50}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Choose your niche</label>
            <select className={styles.select} value={form.niche} onChange={e => set('niche', e.target.value)}>
              {niches.map(n => (
                <option key={n.slug} value={n.slug}>{n.icon} {n.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>Margin target</label>
              <select className={styles.select} value={form.marginPct} onChange={e => set('marginPct', parseInt(e.target.value))}>
                <option value={25}>25%</option>
                <option value={30}>30%</option>
                <option value={40}>40%</option>
                <option value={50}>50%</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Products</label>
              <select className={styles.select} value={form.productCount} onChange={e => set('productCount', parseInt(e.target.value))}>
                <option value={25}>25 products</option>
                <option value={50}>50 products</option>
                <option value={100}>100 products</option>
              </select>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Starting...' : 'Build My Store →'}
          </button>
        </form>

        <p className={styles.proof}>
          One-time payment · Instant download · No subscription
        </p>
      </div>
    </div>
  );
}
