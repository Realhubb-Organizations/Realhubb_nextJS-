async function run() {
  const url = "https://res.cloudinary.com/dr0fl3ak5/image/upload/v1782369142/realhubb/resumes/djwxeeytxhdgqmxhfqg5.pdf";
  try {
    console.log("Fetching URL:", url);
    const res = await fetch(url, { method: "HEAD" });
    console.log("Status:", res.status);
    console.log("Status Text:", res.statusText);
    console.log("Headers:");
    res.headers.forEach((val, key) => {
      console.log(`  ${key}: ${val}`);
    });
  } catch (err) {
    console.error("Error fetching:", err);
  }
}
run();
