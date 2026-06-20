'use server'

import Navbar from "@/components/shared/Navbar";
import getSession from "@/utils/actions/server/getSession";
import Footer from "../../components/home/Footer";


export default async function RootLayout({ children }) {

  const session = await getSession();

  return (
    <>
      <Navbar session={session} />
      <main>{children}</main>
      <Footer />
    </>
  );
}