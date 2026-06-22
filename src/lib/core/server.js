

const baseUrl = process.env.NEXT_PUBLIC_API_URL

export const serverFetch = async (path) => {

  const res = await fetch(`${baseUrl}${path}`);

  const data = await res.json();
  return data;
}