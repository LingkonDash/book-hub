import { getAllUsers } from '@/lib/api/admin/getAdminApi';
import { getUserSession } from '@/lib/core/session';
import UserManagementTable from './UserManagementComponent';

const ManageUsersPage = async () => {
  const users = await getAllUsers();
  const currentUser = await getUserSession();

  return (
    <div className="px-4 sm:px-6 py-8 mx-auto pt-5 md:pt-18 lg:pt-8">

      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3 mb-7">
        <div>
          <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#fc4a32] mb-1">
            Admin Dashboard
          </p>
          <h1 className="text-[26px] font-bold text-slate-900 tracking-tight leading-none">
            Manage Users
          </h1>
        </div>

        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fce8e5] text-[#fc4a32] text-sm font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#fc4a32]" />
          {users.length} {users.length === 1 ? 'user' : 'users'}
        </span>
      </div>

      {/* Table */}
      <UserManagementTable users={users} currentUser={currentUser} />
    </div>
  );
};

export default ManageUsersPage;