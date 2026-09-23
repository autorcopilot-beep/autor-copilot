from __future__ import annotations

import json
import re
import shutil
from collections import defaultdict, deque
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "DOCUMENTACAO_ATUAL"
SRC = ROOT / "src"
EXCLUDED = {"node_modules", ".next", ".git", "DOCUMENTACAO_ATUAL"}
CODE_SUFFIXES = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py"}


def relative(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def project_files() -> list[Path]:
    return sorted(path for path in ROOT.rglob("*") if path.is_file() and not any(part in EXCLUDED for part in path.relative_to(ROOT).parts))


def title(text: str) -> str:
    return text.replace("_", " ").replace("-", " ").title()


def area_for(path: str) -> str:
    rules = [
        ("Ambiente de escrita", ["src/app/(writing)", "src/features/writing"]),
        ("Administração", ["src/app/admin", "src/features/admin"]),
        ("Conta e preferências", ["src/app/(workspace)/account", "src/features/account"]),
        ("Biblioteca", ["src/app/(workspace)/library", "src/features/library"]),
        ("Visão geral", ["src/app/(workspace)/overview", "src/features/overview"]),
        ("Som e mídia", ["src/features/sound", "src/app/api/sound"]),
        ("Extensões", ["src/features/extensions"]),
        ("Guias do produto", ["src/features/guidance"]),
        ("OmniPublish e publicação", ["src/features/omnipublish", "api/"]),
        ("Autenticação", ["src/features/auth", "src/app/(auth)", "src/lib/supabase"]),
        ("Legal", ["src/app/legal", "src/components/legal", "src/lib/legal"]),
        ("Acessibilidade", ["src/features/accessibility"]),
        ("Interface compartilhada", ["src/components/ui", "src/app/globals.css", "src/app/writing-workspace.css"]),
        ("Banco e infraestrutura", ["supabase/", "netlify.toml", "next.config", "proxy.ts", "package.json", ".env.example"]),
        ("Documentação", ["docs/", "README.md", "NETLIFY_DEPLOY.md"]),
    ]
    for area, prefixes in rules:
        if any(path.startswith(prefix) or prefix in path for prefix in prefixes):
            return area
    return "Outros"


def copy_existing_docs(files: list[Path]) -> list[str]:
    copied: list[str] = []
    target_root = OUT / "fontes-existentes"
    for path in files:
        rel = path.relative_to(ROOT)
        if path.suffix.lower() not in {".md", ".txt"}:
            continue
        target = target_root / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, target)
        copied.append(rel.as_posix())
    return copied


IMPORT_RE = re.compile(r"(?:from\s+|import\s*\()?['\"]([^'\"]+)['\"]")


def resolve_import(source: Path, specifier: str) -> Path | None:
    if specifier.startswith("@/"):
        base = ROOT / "src" / specifier[2:]
    elif specifier.startswith("."):
        base = source.parent / specifier
    else:
        return None
    candidates = [base, *(Path(str(base) + suffix) for suffix in [".ts", ".tsx", ".js", ".jsx", ".css"]), *(base / f"index{suffix}" for suffix in [".ts", ".tsx", ".js", ".jsx"])]
    for candidate in candidates:
        if candidate.is_file() and ROOT in candidate.resolve().parents:
            return candidate.resolve()
    return None


def dependency_closure(starts: list[Path]) -> list[Path]:
    queue = deque(path.resolve() for path in starts if path.exists())
    seen: set[Path] = set()
    while queue:
        path = queue.popleft()
        if path in seen:
            continue
        seen.add(path)
        if path.suffix not in {".ts", ".tsx", ".js", ".jsx"}:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        for specifier in IMPORT_RE.findall(text):
            resolved = resolve_import(path, specifier)
            if resolved and resolved not in seen:
                queue.append(resolved)
    return sorted(seen)


FUNC_PATTERNS = [
    ("função", re.compile(r"(?P<export>export\s+(?:default\s+)?)?(?P<async>async\s+)?function\s+(?P<name>[A-Za-z_$][\w$]*)\s*\((?P<params>[^)]*)\)", re.M)),
    ("arrow", re.compile(r"(?P<export>export\s+)?(?:const|let)\s+(?P<name>[A-Za-z_$][\w$]*)\s*=\s*(?P<async>async\s+)?\((?P<params>[^)]*)\)\s*=>", re.M)),
    ("arrow", re.compile(r"(?P<export>export\s+)?(?:const|let)\s+(?P<name>[A-Za-z_$][\w$]*)\s*=\s*(?P<async>async\s+)?(?P<params>[A-Za-z_$][\w$]*)\s*=>", re.M)),
]


def functions(files: list[Path]) -> list[dict[str, object]]:
    found: list[dict[str, object]] = []
    for path in files:
        if path.suffix.lower() not in CODE_SUFFIXES:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        occupied: set[tuple[int, str]] = set()
        for kind, pattern in FUNC_PATTERNS:
            for match in pattern.finditer(text):
                key = (match.start(), match.group("name"))
                if key in occupied:
                    continue
                occupied.add(key)
                params = " ".join(match.group("params").split())[:220]
                found.append({
                    "name": match.group("name"),
                    "file": relative(path),
                    "line": text.count("\n", 0, match.start()) + 1,
                    "kind": "assíncrona " + kind if match.groupdict().get("async") else kind,
                    "exported": bool(match.groupdict().get("export")),
                    "params": params,
                    "area": area_for(relative(path)),
                })
    return sorted(found, key=lambda item: (str(item["area"]), str(item["file"]), int(item["line"])))


def app_route(path: Path) -> str:
    rel = path.relative_to(ROOT / "src" / "app")
    parts = []
    for part in rel.parts[:-1]:
        if part.startswith("(") and part.endswith(")"):
            continue
        parts.append(part)
    route = "/" + "/".join(parts)
    return route.replace("/page", "") or "/"


def write_markdown(files: list[Path], copied: list[str], funcs: list[dict[str, object]]) -> None:
    now = datetime.now().strftime("%d/%m/%Y %H:%M")
    areas: dict[str, list[str]] = defaultdict(list)
    for path in files:
        areas[area_for(relative(path))].append(relative(path))

    readme = ["# Documentação atual do Autor Copilot", "", f"> Snapshot gerado em {now} a partir do código presente no repositório.", "", "Esta pasta reúne o mapa técnico do produto, os documentos existentes copiados sem alteração e um catálogo pesquisável das funções implementadas.", "", "## Conteúdo", "", "- `areas/WRITE.md`: dependências reais carregadas pelo ambiente de escrita.", "- `inventarios/ARQUIVOS_POR_AREA.md`: todos os arquivos relevantes agrupados por domínio.", "- `inventarios/FUNCOES_DO_PROJETO.md`: funções nomeadas encontradas no código.", "- `inventarios/ROTAS_E_PAGINAS.md`: rotas, layouts, APIs e estados de carregamento.", "- `inventarios/BANCO_E_MIGRATIONS.md`: migrations e tabelas tipadas.", "- `fontes-existentes/`: cópia dos documentos Markdown e texto existentes.", "- `CATALOGO_COMPLETO_DE_FUNCOES.docx`: versão Word do catálogo funcional.", "", "## Números deste snapshot", "", f"- {len(files)} arquivos relevantes.", f"- {sum(1 for p in files if p.suffix in {'.ts', '.tsx'})} arquivos TypeScript ou TSX.", f"- {len(funcs)} funções nomeadas catalogadas.", f"- {len(copied)} documentos existentes copiados.", ""]
    (OUT / "README.md").write_text("\n".join(readme), encoding="utf-8")

    area_lines = ["# Arquivos por área", "", "Cada caminho é relativo à raiz do projeto.", ""]
    for area in sorted(areas):
        area_lines += [f"## {area}", "", f"Total: {len(areas[area])}", ""] + [f"- `{item}`" for item in areas[area]] + [""]
    (OUT / "inventarios" / "ARQUIVOS_POR_AREA.md").write_text("\n".join(area_lines), encoding="utf-8")

    starts = [ROOT / "src/app/(writing)/layout.tsx", ROOT / "src/app/(writing)/write/[view]/page.tsx", ROOT / "src/app/layout.tsx"]
    write_deps = dependency_closure(starts)
    write_lines = ["# Ambiente de escrita", "", "Este inventário é calculado seguindo imports locais a partir do layout e da rota dinâmica de `/write`. Assim ele inclui dependências compartilhadas efetivamente usadas, além dos arquivos exclusivos da feature.", "", "## Entradas", ""] + [f"- `{relative(path)}`" for path in starts if path.exists()] + ["", f"## Dependências locais transitivas {len(write_deps)} arquivos", ""]
    grouped: dict[str, list[str]] = defaultdict(list)
    for path in write_deps:
        rel = relative(path)
        group = "Componentes de escrita" if "/writing/" in rel else "Interface e utilidades compartilhadas" if rel.startswith("src/components") or rel.startswith("src/lib") else "Integrações e recursos adjacentes"
        grouped[group].append(rel)
    for group, items in grouped.items():
        write_lines += [f"### {group}", ""] + [f"- `{item}`" for item in items] + [""]
    write_lines += ["## Rotas do ambiente", "", "- `/write/editor`", "- `/write/chapters`", "- `/write/scenes`", "- `/write/notes`", "- `/write/encyclopedia`", "- `/write/relations`", ""]
    (OUT / "areas" / "WRITE.md").write_text("\n".join(write_lines), encoding="utf-8")

    for area, items in sorted(areas.items()):
        slug = re.sub(r"[^A-Z0-9]+", "_", area.upper()).strip("_")
        if slug == "AMBIENTE_DE_ESCRITA":
            continue
        lines = [f"# {area}", "", f"Arquivos associados: {len(items)}", ""] + [f"- `{item}`" for item in items] + [""]
        (OUT / "areas" / f"{slug}.md").write_text("\n".join(lines), encoding="utf-8")

    route_lines = ["# Rotas e páginas", "", "## Páginas", ""]
    for path in sorted((ROOT / "src/app").rglob("page.tsx")):
        route_lines.append(f"- `{app_route(path)}` — `{relative(path)}`")
    route_lines += ["", "## APIs", ""]
    for path in sorted((ROOT / "src/app").rglob("route.ts")):
        route_lines.append(f"- `{app_route(path)}` — `{relative(path)}`")
    route_lines += ["", "## Layouts e carregamento", ""]
    for path in sorted((ROOT / "src/app").rglob("*.tsx")):
        if path.name in {"layout.tsx", "loading.tsx", "error.tsx", "not-found.tsx"}:
            route_lines.append(f"- `{relative(path)}`")
    (OUT / "inventarios" / "ROTAS_E_PAGINAS.md").write_text("\n".join(route_lines) + "\n", encoding="utf-8")

    function_lines = ["# Funções do projeto", "", f"Catálogo automático de {len(funcs)} funções nomeadas. Funções anônimas passadas diretamente como callbacks não aparecem como itens independentes.", ""]
    by_area: dict[str, list[dict[str, object]]] = defaultdict(list)
    for item in funcs:
        by_area[str(item["area"])].append(item)
    for area in sorted(by_area):
        function_lines += [f"## {area}", ""]
        current_file = ""
        for item in by_area[area]:
            if item["file"] != current_file:
                current_file = str(item["file"])
                function_lines += [f"### `{current_file}`", ""]
            visibility = "exportada" if item["exported"] else "interna"
            function_lines.append(f"- **{item['name']}** — linha {item['line']}; {item['kind']}; {visibility}; parâmetros: `{item['params'] or 'nenhum'}`")
        function_lines.append("")
    (OUT / "inventarios" / "FUNCOES_DO_PROJETO.md").write_text("\n".join(function_lines), encoding="utf-8")

    migrations = sorted((ROOT / "supabase/migrations").glob("*.sql"))
    types_path = ROOT / "src/types/database.generated.ts"
    types_text = types_path.read_text(encoding="utf-8", errors="ignore") if types_path.exists() else ""
    tables_match = re.search(r"Tables:\s*\{(.*?)\n\s*Views:", types_text, re.S)
    table_names = sorted(set(re.findall(r"^\s{6}([A-Za-z0-9_]+):\s*\{", tables_match.group(1), re.M))) if tables_match else []
    db_lines = ["# Banco de dados e migrations", "", f"## Tabelas tipadas {len(table_names)}", ""] + [f"- `{name}`" for name in table_names] + ["", f"## Migrations {len(migrations)}", ""] + [f"- `{relative(path)}`" for path in migrations] + [""]
    (OUT / "inventarios" / "BANCO_E_MIGRATIONS.md").write_text("\n".join(db_lines), encoding="utf-8")
    (OUT / "inventarios" / "funcoes.json").write_text(json.dumps(funcs, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    for directory in [OUT, OUT / "areas", OUT / "inventarios", OUT / "fontes-existentes"]:
        directory.mkdir(parents=True, exist_ok=True)
    files = project_files()
    copied = copy_existing_docs(files)
    funcs = functions(files)
    write_markdown(files, copied, funcs)
    print(json.dumps({"files": len(files), "documents": len(copied), "functions": len(funcs), "output": str(OUT)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
