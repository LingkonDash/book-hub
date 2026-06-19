'use server'

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const getSession = async () => {
  const session = await auth.api.getSession({headers: await headers()})
  return session;
};

export default getSession;