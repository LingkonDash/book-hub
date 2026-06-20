
export default async function uploadToImgBB(file) {

  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: formData,
  });


  console.log(res, 'res');

  if (!res.ok) throw new Error("Image upload failed."); // use toast here !

  const data = await res.json();
  return data.data.url;
}