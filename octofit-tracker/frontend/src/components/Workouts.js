import React from 'react';
import DataSection from './DataSection';

const Workouts = () => {
  const endpointPath = 'workouts/';
  console.log('Workouts component using endpointPath:', endpointPath);

  return (
    <DataSection
      title="Workouts"
      endpointPath={endpointPath}
      description="Explore workout routines and statistics in a clean dashboard-style table."
    />
  );
};

export default Workouts;
