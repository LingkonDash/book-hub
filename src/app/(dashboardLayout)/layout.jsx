import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { getUserSession } from "@/lib/core/session";

const DashboardLayout = async ({ children }) => {

  const data = await getUserSession();
  const session = {user: data}

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar session={session}/>
      <div className="flex-1 flex flex-col min-w-0 lg:ml-75">
        <main className="flex-1 pt-15 lg:pl-4 md:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
