import React from 'react';
import DataSection from './DataSection';

const Leaderboard = () => {
  const endpointPath = 'leaderboard/';
  console.log('Leaderboard component using endpointPath:', endpointPath);

  return (
    <DataSection
      title="Leaderboard"
      endpointPath={endpointPath}
      description="Review team and user rankings in a polished leaderboard view."
    />
  );
};

export default Leaderboard;
