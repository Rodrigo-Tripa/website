from pathlib import Path
import re

ROOT = Path.cwd()
HTML_FILES = [
    'index.html', 'projects.html', 'knowledge.html', 'security.html',
    'research.html', 'ia.html', 'about.html', 'report.html'
]

DESCRIBEDBY = '    <link rel="describedby" href="/llms.txt">'

for rel in HTML_FILES:
    path = ROOT / rel
    if not path.exists():
        continue
    text = path.read_text(encoding='utf-8')

    if 'rel="describedby" href="/llms.txt"' not in text:
        marker = re.search(r'(\s*<link\s+rel="canonical"[^>]*>)', text, re.I)
        if marker:
            text = text[:marker.end()] + '\n' + DESCRIBEDBY + text[marker.end():]
        else:
            text = text.replace('<head>', '<head>\n' + DESCRIBEDBY, 1)

    if rel == 'index.html':
        # Keep the deferred loader in <head>; remove the duplicate non-deferred loader near </body>.
        text = re.sub(r'\n\s*<script\s+src="assets/js/main\.js"></script>\s*\n\s*</body>', '\n</body>', text, count=1, flags=re.I)

    if rel == 'report.html':
        if 'name="robots" content="noindex, follow"' not in text:
            head_meta = '    <meta name="robots" content="noindex, follow">'
            text = text.replace('<head>', '<head>\n' + head_meta, 1)
        if 'id="legacy-report-redirect"' not in text:
            redirect = '''
<script id="legacy-report-redirect">
(function () {
  const edition = new URLSearchParams(location.search).get('edition');
  if (!edition || !/^\\d{4}\\/week-\\d{2}$/.test(edition)) return;
  const target = '/security/' + edition + '/';
  if (location.pathname !== target) window.location.replace(target);
})();
</script>
'''
            text = text.replace('</head>', redirect + '</head>', 1)

    path.write_text(text, encoding='utf-8')
    print(f'[updated] {rel}')

print('[done] Existing HTML discovery patches applied.')
