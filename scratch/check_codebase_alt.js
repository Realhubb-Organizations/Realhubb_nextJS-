const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\REALHUBB VENTURES\\OneDrive\\Desktop\\realhubb-next-website';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git' && f !== '.gemini' && f !== '.claude') {
        walkDir(dirPath, callback);
      }
    } else {
      if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.js')) {
        callback(dirPath);
      }
    }
  });
}

console.log("Scanning codebase for img/Image tags missing or having empty alt attributes...");

walkDir(rootDir, (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // A regex that matches <img ... > or <Image ... > tags (even multi-line)
  // Let's find matches. Note: we need to handle multi-line tags, so we'll match from `<img` or `<Image` to `>`
  const imageRegex = /<(img|Image)\b([\s\S]*?)>/gi;
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];
    const attributes = match[2];
    
    // Check if alt attribute is present
    // alt can be: alt="..." or alt={...} or alt='...'
    const altRegex = /\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|{([^}]*)})/i;
    const altMatch = attributes.match(altRegex);
    
    // Calculate line number
    const beforeMatch = content.substring(0, match.index);
    const lineNumber = beforeMatch.split('\n').length;
    
    if (!altMatch) {
      console.log(`[MISSING ALT] File: ${filePath}:${lineNumber}`);
      console.log(`Tag: ${fullTag.replace(/\s+/g, ' ')}\n`);
    } else {
      // It has alt attribute, check if it's empty
      const valDouble = altMatch[1];
      const valSingle = altMatch[2];
      const valExpr = altMatch[3];
      
      let isEmpty = false;
      if (valDouble !== undefined && valDouble.trim() === '') isEmpty = true;
      if (valSingle !== undefined && valSingle.trim() === '') isEmpty = true;
      if (valExpr !== undefined && (valExpr.trim() === '""' || valExpr.trim() === "''" || valExpr.trim() === 'null' || valExpr.trim() === 'undefined')) isEmpty = true;
      
      if (isEmpty) {
        console.log(`[EMPTY ALT] File: ${filePath}:${lineNumber}`);
        console.log(`Tag: ${fullTag.replace(/\s+/g, ' ')}\n`);
      }
    }
  }
});

console.log("Scan completed.");
