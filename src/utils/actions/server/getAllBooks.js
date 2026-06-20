'use server'

export async function getAllBooks (query) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mockBook.json?${query && query}`);
  const data = await res.json();

  return data;
}