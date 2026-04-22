import React from 'react';
import styles from './Complete.module.css';

export default function Complete({ stats, downloadUrl, onReset }) {
  const apiBase = process.env.REACT_APP_API_URL || '';

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <div className={styles.icon}>🎉</div>
        <h1 className={styles.title}>You're live.</h1>
        <p className={styles.sub}>
          Your store kit is ready. Products imported, ads written, emails built, policies done.
          Time to post your first TikTok.
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statVal}>{stats?.products || 50}</div>
            <div className={styles.statLbl}>Products</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statVal}>{stats?.margin || 30}%</div>
            <div className={styles.statLbl}>Margin</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statVal} style={{ color: 'var(--green)' }}>5</div>
            <div className={styles.statLbl}>Documents</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statVal} style={{ color: 'var(--green)' }}>Ready</div>
            <div className={styles.statLbl}>Status</div>
          </div>
        </div>

        <div className={styles.actions}>
          {downloadUrl && (
            <a
              className={styles.primaryBtn}
              href={`${apiBase}${downloadUrl}`}
              download
            >
              ↓ Download Store Kit
            </a>
          )}
          <button className={styles.secondaryBtn} onClick={onReset}>
            Build another store
          </button>
        </div>

        <div className={styles.nextSteps}>
          <h3 className={styles.nextTitle}>What happens now</h3>
          <div className={styles.nextList}>
            {[
              ['Day 1', 'Shopify account live, products imported, payments active'],
              ['Day 2', 'First TikTok video posted, DSers and Spocket connected'],
              ['Day 3', 'First paid TikTok Spark Ad live ($50), Facebook ad running ($20/day)'],
              ['Day 7+', 'Email flows live in Klaviyo, retargeting ads running'],
              ['Day 30', 'Target: $500–1,500/month revenue with optimized ads'],
            ].map(([day, text]) => (
              <div key={day} className={styles.nextItem}>
                <span className={styles.nextDay}>{day}</span>
                <span className={styles.nextText}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
