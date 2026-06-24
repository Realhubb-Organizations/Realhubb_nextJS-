import os
import re

def search_files(directory):
    img_regex = re.compile(r'<(img|Image)\b[^>]*>', re.IGNORECASE)
    alt_regex = re.compile(r'\balt\s*=\s*(?:"[^"]*"|\'[^\']*\'|{[^}]+})', re.IGNORECASE)
    
    results = []
    
    for root, dirs, files in os.walk(directory):
        # Exclude directories
        if any(ignored in root for ignored in ['node_modules', '.next', '.git', 'scratch']):
            continue
            
        for file in files:
            if not file.endswith(('.tsx', '.ts', '.html', '.jsx', '.js')):
                continue
                
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Find all img or Image tags
                tags = img_regex.findall(content)
                # Find positions to report context
                for match in re.finditer(r'<(img|Image)\b[^>]*>', content, re.IGNORECASE):
                    tag_content = match.group(0)
                    # Check if alt attribute exists
                    if not alt_regex.search(tag_content):
                        # Find line number
                        line_no = content[:match.start()].count('\n') + 1
                        results.append({
                            'file': file_path,
                            'line': line_no,
                            'tag': tag_content,
                            'reason': 'Missing alt attribute'
                        })
                    else:
                        # Check for empty alt, e.g. alt="" or alt='' or alt={{}}
                        empty_alt = re.search(r'\balt\s*=\s*(?:"\s*"|\'\s*\'|{\s*""\s*}|{\s*\'\'\s*}|{\s*})', tag_content, re.IGNORECASE)
                        if empty_alt:
                            line_no = content[:match.start()].count('\n') + 1
                            results.append({
                                'file': file_path,
                                'line': line_no,
                                'tag': tag_content,
                                'reason': 'Empty alt attribute'
                            })
            except Exception as e:
                pass
                
    return results

if __name__ == '__main__':
    project_dir = r"c:\Users\REALHUBB VENTURES\OneDrive\Desktop\realhubb-next-website"
    findings = search_files(project_dir)
    print(f"Found {len(findings)} matches:")
    for f in findings:
        print(f"File: {f['file']}:{f['line']}")
        print(f"Tag:  {f['tag']}")
        print(f"Reason: {f['reason']}")
        print("-" * 50)
