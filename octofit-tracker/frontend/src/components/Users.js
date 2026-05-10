import React from 'react';
import DataSection from './DataSection';

const Users = () => {
  const endpointPath = 'users/';
  console.log('Users component using endpointPath:', endpointPath);

  return (
    <DataSection
      title="Users"
      endpointPath={endpointPath}
      description="Browse user profiles and participation data in a unified Bootstrap table."
    />
  );
};

export default Users;
