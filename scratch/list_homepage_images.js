const http = require('http');

const req = http.get('http://localhost:3000/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const imgRegex = /<img[^>]*>/gi;
    const matches = data.match(imgRegex) || [];
    console.log(`Total images: ${matches.length}`);
    matches.forEach((img, idx) => {
      const srcMatch = img.match(/src="([^"]*)"/i) || img.match(/srcSet="([^"]*)"/i);
      const altMatch = img.match(/alt="([^"]*)"/i);
      const src = srcMatch ? srcMatch[1] : 'NO SRC';
      const alt = altMatch ? altMatch[1] : 'NO ALT';
      console.log(`${idx + 1}: src="${src.substring(0, 60)}" | alt="${alt}"`);
    });
  });
});

req.on('error', (e) => {
  console.error(e);
});
