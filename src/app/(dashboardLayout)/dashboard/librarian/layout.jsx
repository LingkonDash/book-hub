import { requireRole } from "@/lib/core/session";

const layout = async ({ children }) => {
  await requireRole('librarian')
  return ( <> {children} </> );
};

export default layout;