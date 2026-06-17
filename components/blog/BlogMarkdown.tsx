interface Props {
  content: string;
}

export default function BlogMarkdown({ content }: Props) {
  const html = parseMarkdown(content);
  return (
    <div
      className="prose prose-sm max-w-none text-gray-600
        prose-headings:font-heading prose-headings:text-navy prose-headings:font-normal
        prose-h2:text-2xl prose-h3:text-xl
        prose-a:text-gold prose-a:no-underline hover:prose-a:underline
        prose-strong:text-navy prose-strong:font-normal
        prose-li:text-gray-500
        prose-blockquote:border-gold prose-blockquote:text-gray-400
        prose-table:text-sm prose-th:bg-cream prose-th:text-navy prose-th:font-normal"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function parseMarkdown(md: string): string {
  return md
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
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
