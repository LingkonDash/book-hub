'use server'

import { headers } from "next/headers";
import { auth } from "../auth";

export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return session?.user || null;
}


const getJwtToken = async () => {
    const { token } = await auth.api.getToken({ headers: await headers() })
    return token;
}

export default getJwtToken;