# Realm of Warriors Character Sheet (Shared)

This repo hosts the reusable character sheet template, static assets, and JS that render the Realm of Warriors character sheet. It is designed to be included as a Git submodule in Django projects.

## Contents
- `templates/characters/sheet_embed.html` — Django template for the multi-page sheet.
- `static/rowcharactersheet/blank_sheet.css` — Styles for all pages.
- `static/rowcharactersheet/js/sheet_embed.js` — Fills the sheet from injected JSON.
- `static/rowcharactersheet/images/` — Logos, QR art, corners/background.
- `standalone.html` — Plain HTML variant with relative paths for non-Django use (ships with a sample data block).

## How to consume (Django)
1) Add the repo as a submodule inside your project (e.g., at `rowcharactersheet/`).
2) Point Django to the submodule paths:
   - In `TEMPLATES[0]['DIRS']`, add `SHARED_SHEET_DIR / 'templates'` (or your chosen path).
   - In `STATICFILES_DIRS`, add `SHARED_SHEET_DIR / 'static'`.
3) Include the template where needed, for example:
   ```django
   {% include "characters/sheet_embed.html" %}
   ```
4) Ensure `collectstatic` runs so the assets are served. The template uses `{% static %}` for CSS/JS/images.

## How to consume (standalone / non-Django)
1) Serve or open `standalone.html` with the accompanying `static/rowcharactersheet/` folder in the same relative location.
2) Edit the inline `sampleData` and `window.sheetFallback` near the bottom of `standalone.html` to inject your payload (matches the Django data contract below).
3) Optional: point the QR image to your own URL by replacing the `static/rowcharactersheet/images/qrcode.png` path in `standalone.html`.

## Data contract
The view must set:
- `data_json` — serialized payload for the sheet (abilities, skills, features, talents, inventory, etc.).
- `character` — object with at least `code`, `name`, `player`, `profession` used for fallbacks and the QR link.

On render, the template seeds:
```html
<script>
  window.sheetData = {{ data_json|safe }} || {};
  window.sheetFallback = {
    code: "{{ character.code|escapejs }}",
    name: "{{ character.name|escapejs }}",
    player: "{{ character.player|escapejs }}",
    profession: "{{ character.profession|escapejs }}"
  };
</script>
```
`sheet_embed.js` then populates all `[data-field]` and list sections. The QR code image uses `/characters/{{ character.code }}/qr/` by default; adjust the URL in the template if your route differs.

## Updating this shared sheet
- Make changes inside this repo (template/CSS/JS/images), commit, and push to `main`.
- In consuming projects, update the submodule pointer (`git submodule update --remote rowcharactersheet`) and commit the new ref.

## Notes
- Cache-busting query strings are present on CSS/JS; bump them when you need to force client refreshes.
- `Corner.png` is included as a placeholder; swap with art if desired.
