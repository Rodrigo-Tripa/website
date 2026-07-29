#!/usr/bin/env bash
#
# fix-navbar.sh
# Padroniza a navbar em todas as páginas do site rodrigotripa.dev
#
# Uso:
#   Corre este script a partir da raiz do repositório (~/Website),
#   onde estão index.html, about.html, projects.html, etc.
#
#   ./fix-navbar.sh
#
# O script faz backup de cada ficheiro (.bak) antes de o alterar.
# Precisa de python3 (já vem instalado na maioria das distros Linux).

set -euo pipefail

# --- Verificações ---------------------------------------------------------

if ! command -v python3 &> /dev/null; then
    echo "Erro: python3 não encontrado. Instala com: sudo apt install python3"
    exit 1
fi

REQUIRED_FILES=(index.html about.html projects.html security.html report.html knowledge.html research.html)
for f in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$f" ]; then
        echo "Aviso: '$f' não encontrado neste diretório. A ignorar."
    fi
done

echo "A corrigir navbars..."
echo ""

# --- Lógica principal (Python) --------------------------------------------
# Ficheiros que já usam <header class="header"> + <nav class="navbar">:
#   apenas substituímos o bloco <nav class="navbar">...</nav>
#
# Ficheiros com estrutura diferente (knowledge.html, research.html):
#   substituímos o <header>...</header> inteiro pelo template canónico.

python3 << 'PYEOF'
import re
import os

# Template canónico do bloco <nav>, com {ACTIVE} substituído pela página atual
NAV_TEMPLATE = '''<nav class="navbar">
                <ul class="nav-links">
                    <li><a href="/"{a_home}>Home</a></li>
                    <li><a href="/projects.html"{a_projects}>Projects</a></li>
                    <li><a href="/knowledge.html"{a_knowledge}>Knowledge</a></li>
                    <li><a href="/security.html"{a_security}>Security</a></li>
                    <li><a href="/research.html"{a_research}>Research</a></li>
                    <li><a href="/ia.html"{a_ia}>AI Assistant</a></li>
                    <li><a href="/about.html"{a_about}>About</a></li>
                </ul>
            </nav>'''

# Template canónico do <header> completo (usado só onde falta a estrutura toda)
HEADER_TEMPLATE = '''<header class="header">
        <div class="container">
            <a href="/" class="logo">
                Rodrigo Tripa
            </a>

            {nav}

            <div class="social-links">
                <a href="https://github.com/Rodrigo-Tripa" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    GitHub
                </a>
                <a href="https://www.linkedin.com/in/rodrigo-tripa" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    LinkedIn
                </a>
            </div>

            <button class="menu-toggle" aria-label="Toggle Navigation Menu">
                ☰
            </button>
        </div>
    </header>'''

# path -> chave usada para marcar a active class
PAGE_KEY = {
    "index.html": "home",
    "about.html": "about",
    "projects.html": "projects",
    "security.html": "security",
    "report.html": None,       # report.html não está no menu principal; nenhum link ativo
    "knowledge.html": "knowledge",
    "research.html": "research",
}

# Ficheiros que só precisam de troca do <nav>...</nav>
NAV_ONLY_FILES = ["index.html", "about.html", "projects.html", "security.html", "report.html"]

# Ficheiros que precisam do <header> inteiro substituído
FULL_HEADER_FILES = ["knowledge.html", "research.html"]

def build_nav(active_key):
    slots = {
        "a_home": "", "a_projects": "", "a_knowledge": "", "a_security": "",
        "a_research": "", "a_ia": "", "a_about": "",
    }
    key_map = {
        "home": "a_home", "projects": "a_projects", "knowledge": "a_knowledge",
        "security": "a_security", "research": "a_research", "ia": "a_ia", "about": "a_about",
    }
    if active_key in key_map:
        slots[key_map[active_key]] = ' class="active"'
    return NAV_TEMPLATE.format(**slots)

changed = []
skipped = []

for filename in NAV_ONLY_FILES:
    if not os.path.exists(filename):
        skipped.append(filename)
        continue
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    new_nav = build_nav(PAGE_KEY[filename])

    # Substitui o primeiro bloco <nav class="navbar">...</nav> (non-greedy, DOTALL)
    pattern = re.compile(r'<nav class="navbar">.*?</nav>', re.DOTALL)
    if not pattern.search(content):
        print(f"  [AVISO] Não encontrei <nav class=\"navbar\"> em {filename}, a ignorar.")
        skipped.append(filename)
        continue

    # backup
    with open(filename + ".bak", "w", encoding="utf-8") as f:
        f.write(content)

    new_content = pattern.sub(lambda m: new_nav, content, count=1)

    with open(filename, "w", encoding="utf-8") as f:
        f.write(new_content)

    changed.append(filename)

for filename in FULL_HEADER_FILES:
    if not os.path.exists(filename):
        skipped.append(filename)
        continue
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    new_nav = build_nav(PAGE_KEY[filename])
    new_header = HEADER_TEMPLATE.format(nav=new_nav)

    pattern = re.compile(r'<header[^>]*>.*?</header>', re.DOTALL)
    if not pattern.search(content):
        print(f"  [AVISO] Não encontrei <header> em {filename}, a ignorar.")
        skipped.append(filename)
        continue

    with open(filename + ".bak", "w", encoding="utf-8") as f:
        f.write(content)

    new_content = pattern.sub(lambda m: new_header, content, count=1)

    with open(filename, "w", encoding="utf-8") as f:
        f.write(new_content)

    changed.append(filename)

print("")
print("Ficheiros corrigidos:")
for f in changed:
    print(f"  ✔ {f}  (backup em {f}.bak)")

if skipped:
    print("")
    print("Ficheiros ignorados/não encontrados:")
    for f in skipped:
        print(f"  - {f}")
PYEOF

echo ""
echo "Concluído. Revê as alterações com 'git diff' antes de fazer commit."
echo "Se algo correr mal, os .bak permitem reverter: mv ficheiro.html.bak ficheiro.html"
