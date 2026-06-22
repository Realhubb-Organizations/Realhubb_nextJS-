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
  return md
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

