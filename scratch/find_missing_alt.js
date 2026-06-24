const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== '.next') {
        getFiles(fullPath, files);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

const workspace = 'c:\\Users\\REALHUBB VENTURES\\OneDrive\\Desktop\\realhubb-next-website';
const files = getFiles(workspace);

files.forEach(file => {
  if (file.includes('find_missing_alt.js')) return;
  const content = fs.readFileSync(file, 'utf8');
  
  const imgRegex = /<(img|Image)\b([\s\S]*?)\/?>/g;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const tag = match[0];
    const attributes = match[2];
    
    // Extract alt value
    // e.g. alt="xyz" or alt={'xyz'} or alt={variable}
    const altMatch = /alt\s*=\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`|\{([^}]+)\})/i.exec(attributes);
    const altValue = altMatch ? (altMatch[1] || altMatch[2] || altMatch[3] || altMatch[4]) : 'MISSING';
    
    const offset = match.index;
    const lineNumber = content.substring(0, offset).split('\n').length;
    console.log(`${file.replace(workspace, '')}:${lineNumber} -> alt: ${altValue.trim()}`);
  }
});
