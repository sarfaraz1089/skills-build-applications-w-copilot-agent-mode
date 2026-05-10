import React from 'react';
import DataSection from './DataSection';

const Teams = () => {
  const endpointPath = 'teams/';
  console.log('Teams component using endpointPath:', endpointPath);

  return (
    <DataSection
      title="Teams"
      endpointPath={endpointPath}
      description="View team details and performance metrics in a responsive table layout."
    />
  );
};

export default Teams;
