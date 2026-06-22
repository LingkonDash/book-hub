

const baseUrl = process.env.NEXT_PUBLIC_API_URL

export const serverFetch = async (path) => {

  const res = await fetch(`${baseUrl}${path}`);
  const data = await res.json();

  return data;
}


export const serverMutation = async (path, data, method = 'POST') => {
    const res = await fetch(`${baseUrl}${path}`, {
        method: method,
        // headers: {
        //     'Content-Type': 'application/json',
        //     ... await authHeader()
        // },
        body: JSON.stringify(data),
    });

}