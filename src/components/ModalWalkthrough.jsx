import React, { useState } from 'react';
import { getDownloadUrl } from '../utils/api';
import styles from './ModalWalkthrough.module.css';

const STEPS = [
  {
    title: 'Download your store kit',
    desc: 'Your complete store kit is ready. Download it now — it contains your product CSV, ad copy, email sequences, policies, and homepage copy.',
    tip: 'Keep this ZIP somewhere safe. It has everything you need to get live.',
    checks: [
      'Click the Download Store Kit button below',
      'Unzip the file — you will see 5 documents inside',
      'Open "2-your-action-steps.docx" — this is your master checklist',
    ],
    cta: 'download',
  },
  {
    title: 'Create your Shopify account',
    desc: 'Go to shopify.com and start a free 3-day trial. No credit card needed until day 3.',
    tip: 'Use the exact store name you entered — it becomes your brand from day one.',
    checks: [
      'Go to shopify.com → click Start Free Trial',
      'Enter your email, create a password',
      'Type your store name when prompted',
      'Skip all setup questions — click Skip for now on every screen',
      'You land on the Shopify Admin dashboard',
    ],
  },
  {
    title: 'Import your 50 products',
    desc: 'Your product CSV is pre-loaded with all 50 products, SKUs, pricing at your chosen margin, and compare-at prices. One upload and your catalog is live.',
    tip: 'The compare-at price is set 15% above retail — Shopify automatically shows a strikethrough "was" price which increases conversion.',
    checks: [
      'In Shopify Admin click Products in the left sidebar',
      'Click Import at the top right',
      'Upload your downloaded CSV file',
      'Check: Overwrite existing products with matching handles',
      'Click Upload and continue → then Import products',
      'Confirm all 50 products appear in your list',
    ],
  },
  {
    title: 'Connect DSers and Spocket',
    desc: 'DSers connects your AliExpress products and pulls in all supplier images automatically. Spocket connects US-based suppliers for your wellness and supplement products.',
    tip: 'When searching DSers for a product, pick the listing with the most orders at the closest price. The name does not need to match exactly — the product does.',
    checks: [
      'Apps → App Store → search DSers → install free plan',
      'Click Link to AliExpress inside DSers → authorize',
      'Search each product name → Push to Store → set featured image',
      'Apps → App Store → search Spocket → install free plan',
      'Search supplement and grooming categories → add matching products',
    ],
  },
  {
    title: 'Activate Shopify Payments',
    desc: 'This is how money reaches your bank. You need your LLC EIN and bank account routing number. First payout takes 3–5 business days.',
    tip: 'There are no transaction fees on Shopify Payments — only standard card processing (2.9% + 30¢). Do not skip this step or you cannot receive payments.',
    checks: [
      'Settings → Payments → Activate Shopify Payments',
      'Enter your business legal name and EIN',
      'Enter your bank account routing and account number',
      'Verify your identity when prompted (2–3 min)',
      'Run a $1 test purchase with your own card to confirm',
    ],
  },
  {
    title: 'Paste your policies and homepage copy',
    desc: 'Your policies and homepage copy are written and ready in document 5 of your kit. This is pure copy-paste — no writing needed.',
    tip: 'Stores with visible policies convert 18% better. Buyers need to trust you before they enter a card number.',
    checks: [
      'Open 5-policies-and-homepage-copy.docx from your kit',
      'Shopify → Settings → Policies → paste Shipping Policy',
      'Paste Return Policy, paste Privacy Policy → Save',
      'Online Store → Customize → paste hero headline + subheadline',
      'Paste About section body text → Save',
    ],
  },
  {
    title: 'Post your first TikTok and launch ads',
    desc: 'Your first TikTok costs nothing and can drive sales on its own. After 24 hours boost the best-performing post as a Spark Ad for $50. Then launch your Facebook ad on Day 3.',
    tip: 'Reply to every comment in the first 60 minutes after posting. TikTok\'s algorithm scores engagement velocity — early comments are worth 3x late ones.',
    checks: [
      'Create TikTok Business account — profile name = your store name',
      'Film Script 1 from your ad copy doc and post it',
      'Reply to every comment in the first hour',
      'Day 2: boost best post as Spark Ad at ads.tiktok.com — $50 budget',
      'Day 3: create Facebook ad at business.facebook.com — $20/day',
      'Target: USA, age 28-55, interests matching your niche',
    ],
  },
];

export default function ModalWalkthrough({ storeName, downloadUrl, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [checks, setChecks] = useState(STEPS.map(s => s.checks.map(() => false)));

  const step = STEPS[current];
  const isLast = current === STEPS.length - 1;
  const allChecked = checks[current].every(Boolean);

  function toggleCheck(i) {
    setChecks(prev => {
      const next = prev.map(a => [...a]);
      next[current][i] = !next[current][i];
      return next;
    });
  }

  function handleNext() {
    if (isLast) { onComplete(); return; }
    setCurrent(c => c + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const completedSteps = checks.filter(c => c.every(Boolean)).length;

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.storeName}>{storeName}</div>
            <div className={styles.headerSub}>{completedSteps} of {STEPS.length} steps complete</div>
          </div>
          {downloadUrl && (
            <a
              className={styles.dlBtn}
              href={`${process.env.REACT_APP_API_URL || ''}${downloadUrl}`}
              download
            >
              ↓ Download kit
            </a>
          )}
        </div>

        {/* Progress pills */}
        <div className={styles.pills}>
          {STEPS.map((_, i) => (
            <button
              key={i}
              className={`${styles.pill} ${i === current ? styles.pillActive : ''} ${checks[i].every(Boolean) ? styles.pillDone : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>

        {/* Step card */}
        <div className={styles.card}>
          <div className={styles.stepMeta}>Step {current + 1} of {STEPS.length}</div>
          <h2 className={styles.stepTitle}>{step.title}</h2>
          <p className={styles.stepDesc}>{step.desc}</p>

          {step.tip && (
            <div className={styles.tip}>
              <span className={styles.tipIcon}>💡</span>
              {step.tip}
            </div>
          )}

          {/* Special download CTA on step 1 */}
          {step.cta === 'download' && downloadUrl && (
            <a
              className={styles.downloadBig}
              href={`${process.env.REACT_APP_API_URL || ''}${downloadUrl}`}
              download
            >
              ↓ Download Store Kit
            </a>
          )}

          <ul className={styles.checklist}>
            {step.checks.map((c, i) => {
              const checked = checks[current][i];
              return (
                <li key={i} className={styles.checkItem} onClick={() => toggleCheck(i)}>
                  <div className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}>
                    {checked && '✓'}
                  </div>
                  <span className={`${styles.checkLabel} ${checked ? styles.checkLabelDone : ''}`}>{c}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer nav */}
        <div className={styles.footer}>
          <button
            className={styles.backBtn}
            onClick={() => setCurrent(c => c - 1)}
            disabled={current === 0}
          >
            ← Back
          </button>

          <div className={styles.footerCenter}>
            {!allChecked && (
              <span className={styles.checkHint}>Check off items as you complete them</span>
            )}
          </div>

          <button
            className={`${styles.nextBtn} ${isLast ? styles.nextBtnFinish : ''}`}
            onClick={handleNext}
          >
            {isLast ? 'Finish 🚀' : 'Continue →'}
          </button>
        </div>

      </div>
    </div>
  );
}
