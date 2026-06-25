import { requireRole } from "@/lib/core/session";

const layout = async ({ children }) => {
  await requireRole('admin')
  return ( <> {children} </> );
};

export default layout;