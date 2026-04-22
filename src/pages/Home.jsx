import React, { useState } from 'react';
import BuildWizard from '../components/BuildWizard';
import BuildProgress from '../components/BuildProgress';
import ModalWalkthrough from '../components/ModalWalkthrough';
import Complete from '../components/Complete';
import { useJobPoller } from '../hooks/useJobPoller';

// Phases: wizard → building → walkthrough → complete
export default function Home() {
  const [phase, setPhase] = useState('wizard'); // wizard | building | walkthrough | complete
  const [jobId, setJobId] = useState(null);
  const [buildConfig, setBuildConfig] = useState(null);

  const jobState = useJobPoller(jobId);

  // When job completes, advance to walkthrough
  React.useEffect(() => {
    if (jobState.status === 'complete' && phase === 'building') {
      setPhase('walkthrough');
    }
  }, [jobState.status, phase]);

  function handleBuildStart(config, newJobId) {
    setBuildConfig(config);
    setJobId(newJobId);
    setPhase('building');
  }

  function handleWalkthroughComplete() {
    setPhase('complete');
  }

  function handleReset() {
    setPhase('wizard');
    setJobId(null);
    setBuildConfig(null);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {phase === 'wizard' && (
        <BuildWizard onStart={handleBuildStart} />
      )}
      {phase === 'building' && (
        <BuildProgress jobState={jobState} storeName={buildConfig?.storeName} />
      )}
      {phase === 'walkthrough' && (
        <ModalWalkthrough
          storeName={buildConfig?.storeName}
          downloadUrl={jobState.downloadUrl}
          onComplete={handleWalkthroughComplete}
        />
      )}
      {phase === 'complete' && (
        <Complete
          stats={jobState.stats}
          downloadUrl={jobState.downloadUrl}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
