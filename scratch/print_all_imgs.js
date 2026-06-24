const http = require('http');

http.get('http://localhost:3000/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Match all img tags including multiline
    const imgRegex = /<img([\s\S]*?)>/gi;
    const matches = [];
    let match;
    while ((match = imgRegex.exec(data)) !== null) {
      matches.push(match[0]);
    }
    
    console.log(`Total images found: ${matches.length}`);
    matches.forEach((img, idx) => {
      const srcMatch = img.match(/src\s*=\s*(?:"([^"]*)"|'([^']*)'|{([^}]*)})/i);
      const altMatch = img.match(/alt\s*=\s*(?:"([^"]*)"|'([^']*)'|{([^}]*)})/i);
      
      const src = srcMatch ? (srcMatch[1] || srcMatch[2] || srcMatch[3]) : 'NO SRC';
      const alt = altMatch ? (altMatch[1] || altMatch[2] || altMatch[3]) : 'NO ALT';
      
      console.log(`[Image ${idx + 1}]`);
      console.log(`Tag: ${img.replace(/\s+/g, ' ')}`);
      console.log(`Src: ${src}`);
      console.log(`Alt: ${alt}`);
      console.log('-----------------------------------');
    });
  });
}).on('error', (e) => {
  console.error(e);
});
