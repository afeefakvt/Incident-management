export async function uploadImages(files: File[]) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  const urls: string[] = [];
  for (const file of files) {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", preset);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud}/image/
upload`,
      { method: "POST", body: form }
    );
    const json = await res.json();
    urls.push(json.secure_url);
  }
  return urls;
}
