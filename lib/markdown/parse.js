import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: function (str, lang) {
        return `<pre class="code-block"><code class="language-${lang || "text"}">${md.utils.escapeHtml(str)}</code></pre>`;
    },
});

export function parseMarkdown(source) {
    return md.render(source);
}
