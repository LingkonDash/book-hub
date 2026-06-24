import getJwtToken from "./session";


const baseUrl = process.env.NEXT_PUBLIC_API_URL

// get public data
export const serverFetch = async (path) => {
    const res = await fetch(`${baseUrl}${path}`);
    const data = await res.json();

    return data;
}

// get protected data
export const protectedServerFetch = async (path) => {
    const res = await fetch(`${baseUrl}${path}`,
        {
            headers: await authHeader()
        }
    );
    const data = await res.json()
    return data;
}


// server mutation

export const serverMutation = async (path, data, method = 'POST') => {
    const res = await fetch(`${baseUrl}${path}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            ... await authHeader()
        },
        body: JSON.stringify(data),
    });

    return res.json();
}

// auth header
export const authHeader = async () => {
    const token = await getJwtToken();
    const header = token ? {
        authorization: `Bearer ${token}`
    } : {};

    return header;
}