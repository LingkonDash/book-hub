import { getAdminStats } from '@/lib/api/admin/getAdminApi';
import React from 'react';

const AdminPage = async () => {

  const adminStats = getAdminStats();

  console.log(adminStats);

  return (
    <div>
      <h1>hi admin</h1>
    </div>
  );
};

export default AdminPage;