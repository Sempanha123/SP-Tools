from pathlib import Path
import re
import shutil
from datetime import datetime

PACK_ROOT = Path(__file__).resolve().parent

def find_repo():
    for candidate in [Path.cwd(), PACK_ROOT, PACK_ROOT.parent]:
        if (candidate / "frontend/package.json").exists():
            return candidate
    raise SystemExit(
        "Could not find SP-Tools repository root containing frontend/package.json."
    )

repo = find_repo()

header = repo / "frontend/components/site/Header.vue"
category_page = repo / "frontend/pages/news/category/[slug].vue"
category_nav = repo / "frontend/components/news/home/CategoryNav.vue"
database_seeder = repo / "backend/database/seeders/DatabaseSeeder.php"
category_expansion = repo / "backend/database/seeders/CategoryExpansionSeeder.php"
css = repo / "frontend/assets/css/main.css"

for required in [header, category_page, category_nav, database_seeder, css]:
    if not required.exists():
        raise SystemExit(f"Missing required file: {required}")

backup = repo / (".ui-v17-backup-" + datetime.now().strftime("%Y%m%d-%H%M%S"))

for source in [header, category_page, category_nav, database_seeder, css]:
    destination = backup / source.relative_to(repo)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)

if category_expansion.exists():
    destination = backup / category_expansion.relative_to(repo)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(category_expansion, destination)

print()
print("SP-Tools V17 — Header + Complete Category Archives")
print("Repository:", repo)
print("Backup:    ", backup)
print()

# Full category replacements.
shutil.copy2(
    PACK_ROOT / "payload/frontend/pages/news/category/[slug].vue",
    category_page,
)
print("updated  frontend/pages/news/category/[slug].vue")

shutil.copy2(
    PACK_ROOT / "payload/frontend/components/news/home/CategoryNav.vue",
    category_nav,
)
print("updated  frontend/components/news/home/CategoryNav.vue")

shutil.copy2(
    PACK_ROOT / "payload/backend/database/seeders/CategoryExpansionSeeder.php",
    category_expansion,
)
print("added    backend/database/seeders/CategoryExpansionSeeder.php")

# Header balance pass.
text = header.read_text(encoding="utf-8")

if "sp-site-header-v17" not in text:
    text = text.replace(
        'class="sticky top-0 z-50 border-b transition-all duration-300"',
        'class="sp-site-header-v17 sticky top-0 z-50 border-b transition-all duration-300"',
        1,
    )

text = text.replace(
    'class="flex h-[72px] items-center justify-between gap-6"',
    'class="flex h-[80px] items-center justify-between gap-7"',
    1,
)

text = text.replace(
    'h-10 w-10 items-center justify-center overflow-hidden rounded-[13px]',
    'h-11 w-11 items-center justify-center overflow-hidden rounded-[14px]',
    1,
)

text = text.replace(
    'class="h-[17px] w-[17px]"',
    'class="h-[19px] w-[19px]"',
    1,
)

text = text.replace(
    'class="text-[17px] font-[720]',
    'class="text-[18px] font-[740]',
    1,
)

text = text.replace(
    'class="hidden h-[44px] items-center gap-1 rounded-[15px]',
    'class="hidden h-[48px] items-center gap-1 rounded-[16px]',
    1,
)

# Increase primary desktop nav item sizing without touching mobile content.
text = text.replace(
    'px-3.5 text-[13px] font-semibold',
    'px-4 text-[13.5px] font-semibold',
)

# Search action.
text = text.replace(
    'class="flex h-9 w-9 items-center justify-center rounded-[11px] border border-line bg-elevated text-fg-muted',
    'class="flex h-10 w-10 items-center justify-center rounded-[12px] border border-line bg-elevated text-fg-muted',
    1,
)

# CTA desktop.
text = text.replace(
    'class="sp-shimmer ml-1 inline-flex h-9 items-center justify-center gap-2 rounded-[11px]',
    'class="sp-shimmer ml-1 inline-flex h-10 items-center justify-center gap-2 rounded-[12px]',
    1,
)
text = text.replace(
    'px-[18px] text-[12px] font-semibold text-white',
    'px-5 text-[13px] font-semibold text-white',
    1,
)

header.write_text(text, encoding="utf-8")
print("updated  frontend/components/site/Header.vue")

# Fresh DB should always get the expanded category fixtures.
database = database_seeder.read_text(encoding="utf-8")
if "CategoryExpansionSeeder::class" not in database:
    database = database.replace(
        "            DemoNewsSeeder::class,\n",
        "            DemoNewsSeeder::class,\n            CategoryExpansionSeeder::class,\n",
        1,
    )
    database_seeder.write_text(database, encoding="utf-8")
    print("updated  backend/database/seeders/DatabaseSeeder.php")
else:
    print("ready    DatabaseSeeder already includes CategoryExpansionSeeder")

# Append V17 CSS last so older width/header rules cannot override it.
css_text = css.read_text(encoding="utf-8")
patch = (PACK_ROOT / "patches/v17-header-category.css").read_text(encoding="utf-8")
marker = "SP-Tools V17 — Header scale + category archive redesign"

if marker in css_text:
    start = css_text.rfind("/*", 0, css_text.find(marker))
    if start >= 0:
        css_text = css_text[:start].rstrip()

css.write_text(css_text + "\n\n" + patch + "\n", encoding="utf-8")
print("updated  frontend/assets/css/main.css")

nuxt = repo / "frontend/.nuxt"
if nuxt.exists():
    try:
        shutil.rmtree(nuxt)
        print("cleared  frontend/.nuxt")
    except Exception as exc:
        print("warning  Could not clear frontend/.nuxt:", exc)

print()
print("V17 applied successfully.")
print("Now run SEED_V17_CATEGORIES.ps1 to populate Business, Technology, Science, Climate and Health.")
