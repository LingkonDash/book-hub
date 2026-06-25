import { requireRole } from "@/lib/core/session";

const layout = async ({ children }) => {
  await requireRole('user')
  return ( <> {children} </> );
};

export default layout;