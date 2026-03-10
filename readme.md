# Ipsum Wizard 🧙‍♂️

Conjure dummy text whenever you need it.

## What it does

- Generates Lorem Ipsum paragraphs from the popup.
- Inserts text into the currently focused editable field on the active tab.
- Supports:
	- `<input>` fields
	- `<textarea>` fields
	- Rich text editors using `contenteditable`

## Install (Chrome)

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this project folder.

## How to use

1. Open any normal web page.
2. Click into a text input, textarea, or rich text editor.
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
- `popup.css`: popup styles.
- `popup.js`: lorem generation + message sending to active tab.
- `content.js`: receives message and inserts text at the active caret/selection.

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

## Development notes

- Manifest version: `3`
- Current extension version: `1.0`

## Ideas for next improvements

- Add "Copy to clipboard" mode.
- Add support for iframe-based richtext editors.