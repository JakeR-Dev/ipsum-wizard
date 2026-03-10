# Ipsum Wizard 🧙‍♂️

Conjure dummy text whenever you need it.

## What it does

- Generates Lorem Ipsum paragraphs from the popup.
- Inserts text into the currently focused editable field on the active tab.
- Supports:
	- `<input>` fields
	- `<textarea>` fields
	- Rich text editors using `contenteditable` (raw-text mode only)

## Install (Chrome)

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this project folder.

## How to use

1. Open any web page.
2. Click into a text input, textarea, or rich text editor (in raw-text mode).
3. Click the **Ipsum Wizard** extension icon.
4. Choose the number of paragraphs.
5. Click **Conjure**.

## Permissions

- `activeTab`: lets the popup target the currently active tab.
- `scripting`: supports script interaction patterns for extension behavior.
- `content_scripts`: loads `content.js` on matching pages so it can receive messages and insert text.

## Project structure

- `manifest.json`: extension metadata, permissions, popup registration, and content script setup.
- `popup.html`: popup UI.
- `src/popup.css`: popup styles.
- `src/popup.ts`: lorem generation + message sending to active tab.
- `src/content.ts`: receives message and inserts text at the active caret/selection.
- `dist/*.js`: compiled JavaScript output used by the extension at runtime.

## Build (TypeScript)

- `npm run build`: one-time TypeScript compile (`src` -> `dist`).
- `npm run watch`: recompile automatically while developing.
- `npm run build:prod`: compile without source maps for packaging.

## Known limitations

- Chrome blocks extensions on restricted pages, including:
	- `chrome://*`
	- Chrome Web Store pages
	- other browser-internal pages
- Some rich editors inside cross-origin iframes may not be accessible.

## Troubleshooting

### Error: "Could not establish connection. Receiving end does not exist."

This means the content script was not available in the current tab.

Try this:

1. Switch to a normal website tab (not `chrome://` or extension store pages).
2. Refresh the page after loading/reloading the extension.
3. Click inside an editable field before pressing **Conjure**.

### Text does not appear in a rich text editor

- Make sure the editor is focused and has a visible caret.
- Some sites use protected iframe editors that extensions cannot access.
- Try using the raw-text mode inside the rich text editor instead.

## Development notes

- Manifest version: `3`
- Current extension version: `1.2.0`

## Ideas for next improvements

- Add "Copy to clipboard" mode.
- Add support for iframe-based richtext editors.