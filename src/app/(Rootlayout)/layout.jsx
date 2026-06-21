'use server'

import Navbar from "@/components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import { getUserSession } from "@/lib/core/session";


export default async function RootLayout({ children }) {

  const user = await getUserSession();
  const session = {user};

  return (
    <>
      <Navbar session={session} />
      <main>{children}</main>
      <Footer />
    </>
  );
}