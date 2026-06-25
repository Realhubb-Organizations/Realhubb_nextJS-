interface Props {
  content: string;
}

export default function BlogMarkdown({ content }: Props) {
  const html = parseMarkdown(content);
  return (
    <div
      className="blog-content blog-content-with-dropcap transition-all duration-300"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function parseMarkdown(md: string): string {
  // Check if the content is HTML
  const isHtml = /<p\b|<h[1-6]\b|<div\b|<ul\b|<ol\b/i.test(md);

  if (isHtml) {
    // 1. Clean attributes (remove style and dir) from common elements
    let cleaned = md.replace(/<([a-z1-6]+)([^>]*)>/gi, (match, tagName, attrs) => {
      const lowerTag = tagName.toLowerCase();
      if (["h1", "h2", "h3", "h4", "h5", "h6", "p", "div", "span", "a", "ul", "ol", "li", "strong", "em", "b", "i"].includes(lowerTag)) {
        let cleanAttrs = attrs
          .replace(/\s+style\s*=\s*["'][^"']*["']/gi, "")
          .replace(/\s+dir\s*=\s*["'][^"']*["']/gi, "");
        return `<${tagName}${cleanAttrs}>`;
      }
      return match;
    });

    // 2. Remove Google Docs container span wrapper
    cleaned = cleaned.replace(/<span[^>]*id="docs-internal-guid-[^>]*">([\s\S]*?)<\/span>/gi, "$1");

    // 3. Remove all other span tags entirely but keep contents
    for (let i = 0; i < 5; i++) {
      cleaned = cleaned.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, "$1");
    }

    // 4. Collapse headings and paragraphs spread across multiple lines
    cleaned = cleaned.replace(/(<(h[1-6]|p)\b[^>]*>)([\s\S]*?)(<\/h[1-6]|<\/p>)/gi, (match, openTag, tagName, content, closeTag) => {
      const cleanContent = content.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
      return `${openTag}${cleanContent}${closeTag}`;
    });

    // 5. Remove stand-alone br tags that add double spacing
    cleaned = cleaned.replace(/<br\s*\/?>\s*/gi, "");

    // 6. Clean up double paragraph markers
    cleaned = cleaned.replace(/\n\s*\n/g, "\n\n");

    return cleaned;
  }

  // Fallback to Markdown parser
  let cleaned = md;

  // 1. Clean attributes
  cleaned = cleaned.replace(/<([a-z1-6]+)([^>]*)>/gi, (match, tagName, attrs) => {
    const lowerTag = tagName.toLowerCase();
    if (["h1", "h2", "h3", "h4", "h5", "h6", "p", "div", "span", "a", "ul", "ol", "li", "strong", "em", "b", "i"].includes(lowerTag)) {
      let cleanAttrs = attrs
        .replace(/\s+style\s*=\s*["'][^"']*["']/gi, "")
        .replace(/\s+dir\s*=\s*["'][^"']*["']/gi, "");
      return `<${tagName}${cleanAttrs}>`;
    }
    return match;
  });

  // 2. Remove Google Docs container span wrapper
  cleaned = cleaned.replace(/<span[^>]*id="docs-internal-guid-[^>]*">([\s\S]*?)<\/span>/gi, "$1");

  // 3. Remove all span tags entirely but keep contents
  for (let i = 0; i < 5; i++) {
    cleaned = cleaned.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, "$1");
  }

  // 4. Collapse headings and paragraphs spread across multiple lines
  cleaned = cleaned.replace(/(<(h[1-6]|p)\b[^>]*>)([\s\S]*?)(<\/h[1-6]|<\/p>)/gi, (match, openTag, tagName, content, closeTag) => {
    const cleanContent = content.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
    return `${openTag}${cleanContent}${closeTag}`;
  });

  cleaned = cleaned.replace(/\n\s*\n/g, "\n\n");

  return cleaned
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^## (.+)$/gm, (_, title) => {
      const id = title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      return `<h2 id="${id}">${title}</h2>`;
    })
    .replace(/^### (.+)$/gm, (_, title) => {
      const id = title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      return `<h3 id="${id}">${title}</h3>`;
    })
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]+?<\/li>)/g, "<ul>$1</ul>")
    .replace(/^\|(.+)\|$/gm, (line) => {
      const cells = line.split("|").slice(1, -1).map((c) => c.trim());
      return "<tr>" + cells.map((c) => `<td>${c}</td>`).join("") + "</tr>";
    })
    .replace(/(<tr>[\s\S]+?<\/tr>)/g, "<table>$1</table>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^([^<\n].+)$/gm, (line) => (line.startsWith("<") ? line : `<p>${line}</p>`))
    .replace(/<p><\/p>/g, "");
}

