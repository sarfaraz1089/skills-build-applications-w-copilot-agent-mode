import React from 'react';
import DataSection from './DataSection';

const Activities = () => {
  const endpointPath = 'activities/';
  console.log('Activities component using endpointPath:', endpointPath);

  return (
    <DataSection
      title="Activities"
      endpointPath={endpointPath}
      description="Track your most recent activity entries with an interactive Bootstrap table."
    />
  );
};

export default Activities;
