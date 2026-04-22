import React from 'react';
import styles from './BuildProgress.module.css';

const BUILD_STEPS = [
  'Selecting top products for your niche',
  'Writing Facebook and TikTok ad copy',
  'Building email sequences',
  'Writing store policies',
  'Generating homepage copy',
  'Packaging your store kit',
];

export default function BuildProgress({ jobState, storeName }) {
  const { progress, step, status } = jobState;

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <div className={styles.topLabel}>Building {storeName || 'your store'}...</div>
        <h2 className={styles.title}>
          {status === 'error' ? 'Something went wrong' : step || 'Starting up...'}
        </h2>

        {status === 'error' ? (
          <p className={styles.errorMsg}>{jobState.error}</p>
        ) : (
          <>
            <div className={styles.track}>
              <div className={styles.fill} style={{ width: `${progress}%` }} />
            </div>
            <p className={styles.pct}>{progress}%</p>

            <div className={styles.stepsList}>
              {BUILD_STEPS.map((s, i) => {
                const stepProgress = ((i + 1) / BUILD_STEPS.length) * 100;
                const done = progress >= stepProgress;
                const active = !done && progress >= (i / BUILD_STEPS.length) * 100;
                return (
                  <div key={s} className={`${styles.stepItem} ${done ? styles.done : ''} ${active ? styles.active : ''}`}>
                    <div className={styles.stepIcon}>
                      {done ? '✓' : active ? <span className={styles.spin}>⟳</span> : <span className={styles.dot} />}
                    </div>
                    <span className={styles.stepText}>{s}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
