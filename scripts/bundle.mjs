// Inlines all CSS and JS into one HTML file (dist/the-bullpen.html) for publishing as a single page.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const root = new URL('../', import.meta.url);
let html = readFileSync(new URL('index.html', root), 'utf8');
html = html.replace(/<link rel="stylesheet" href="(css\/[^"]+)">/g, (_, f) => `<style>\n${readFileSync(new URL(f, root), 'utf8')}\n</style>`);
html = html.replace(/<script src="(js\/[^"]+)"><\/script>/g, (_, f) => `<script>\n${readFileSync(new URL(f, root), 'utf8').replace(/<\/script/gi, '<\\/script')}\n</script>`);
mkdirSync(new URL('dist/', root), { recursive: true });
writeFileSync(new URL('dist/the-bullpen.html', root), html);
console.log(`Wrote dist/the-bullpen.html (${(html.length / 1024).toFixed(0)} KB)`);
// Claude artifact version: the page body only (the artifact host supplies doctype/head/body).
const frag = html.replace(/<!doctype html>\s*<html[^>]*>\s*<head>\s*/i, '').replace(/<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*/i, '')
  .replace(/<\/head>\s*<body>/i, '').replace(/<\/body>\s*<\/html>\s*$/i, '')
  .replace('<title>The Bullpen</title>', '<title>The Bullpen</title>\n<meta name="claude:viewport-fit-sides" content="cover">');
writeFileSync(new URL('dist/artifact.html', root), frag);
console.log('Wrote dist/artifact.html');
