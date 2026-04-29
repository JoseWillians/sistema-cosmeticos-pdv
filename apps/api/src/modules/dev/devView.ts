function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const css = `
  :root { color-scheme: dark; font-family: Inter, Segoe UI, Arial, sans-serif; }
  body { margin: 0; background: radial-gradient(circle at 10% 0%, rgba(236,72,153,.18), transparent 28rem), linear-gradient(135deg,#08111f,#111827 55%,#12143a); color: #e5e7eb; }
  main { width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 32px 0; }
  a { color: #7dd3fc; text-decoration: none; }
  .hero, .card { border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.07); border-radius: 12px; box-shadow: 0 18px 60px rgba(0,0,0,.35); backdrop-filter: blur(18px); }
  .hero { padding: 28px; margin-bottom: 20px; }
  .card { padding: 20px; margin: 18px 0; overflow: hidden; }
  h1, h2 { margin: 0 0 10px; color: #fff; }
  p { color: #94a3b8; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
  .pill { display: inline-flex; padding: 6px 10px; border-radius: 999px; background: rgba(52,211,153,.14); color: #bbf7d0; font-weight: 700; font-size: 12px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: rgba(255,255,255,.08); color: #cbd5e1; text-align: left; }
  th, td { border-bottom: 1px solid rgba(255,255,255,.08); padding: 10px 12px; vertical-align: top; }
  code, pre { color: #f0abfc; }
  .method { font-weight: 800; color: #c4b5fd; }
`;

export function renderDevLayout(title: string, body: string) {
  return `<!doctype html>
  <html lang="pt-BR">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(title)} - JW PDV</title>
      <style>${css}</style>
    </head>
    <body><main>${body}</main></body>
  </html>`;
}

export function renderTablePreview(table: { name: string; count: number; columns: string[]; rows: Record<string, unknown>[] }) {
  const header = table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
  const rows = table.rows.length
    ? table.rows.map((row) => `<tr>${table.columns.map((column) => `<td>${escapeHtml(row[column])}</td>`).join("")}</tr>`).join("")
    : `<tr><td colspan="${table.columns.length || 1}">Sem registros</td></tr>`;

  return `<section class="card">
    <h2>${escapeHtml(table.name)}</h2>
    <p>${table.count} registro(s). Prévia limitada a 50 linhas.</p>
    <div style="overflow:auto"><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div>
  </section>`;
}

export function renderJson(value: unknown) {
  return escapeHtml(JSON.stringify(value, null, 2));
}
