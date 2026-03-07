// util function for testing to see if an element is a text input or textarea
function isTextInput(el) {
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
}

// util function to return the current active element, determine if its a text input, textarea, or rich text editor
function getEditableTarget() {
  const activeEl = document.activeElement;

  // test for input or textarea
  if (activeEl && isTextInput(activeEl)) {
    return activeEl;
  }

  // test for rich text editors
  if (activeEl && activeEl instanceof HTMLElement && activeEl.isContentEditable) {
    return activeEl;
  }

  // otherwise, get the cursor position via browser api
  const selection = window.getSelection();
  if (!selection || !selection.anchorNode) {
    return null;
  }

  // make sure we have a valid richtext element to edit
  const node = selection.anchorNode;
  const anchorEl = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  if (!anchorEl || !(anchorEl instanceof Element)) {
    return null;
  }

  return anchorEl.closest('[contenteditable]:not([contenteditable="false"])');
}

// util function for inserting into text inputs and textareas
function insertIntoInput(el, text) {
  const value = el.value;
  const start = el.selectionStart ?? value.length;
  const end = el.selectionEnd ?? value.length;

  el.value = value.slice(0, start) + text + value.slice(end);

  const caret = start + text.length;
  el.selectionStart = caret;
  el.selectionEnd = caret;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

// util function for inserting into rich text editors
function insertIntoContentEditable(el, text) {
  el.focus();

  const usedExecCommand = document.execCommand && document.execCommand("insertText", false, text);
  if (usedExecCommand) {
    return;
  }

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    el.append(document.createTextNode(text));
    el.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  range.setStartAfter(textNode);
  range.setEndAfter(textNode);
  selection.removeAllRanges();
  selection.addRange(range);

  el.dispatchEvent(new Event("input", { bubbles: true }));
}

// TODO: handle edge cases like WP and Drupal richtext editors

// communicate with active tab to get cursor position and insert text
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action !== "insert") return;

  const target = getEditableTarget();
  if (!target) return;

  // if simple text input or textarea, insert directly
  if (isTextInput(target)) {
    insertIntoInput(target, msg.text);
    return;
  }

  // if rich text editor, use execCommand or Range API to insert
  if (target instanceof HTMLElement && target.isContentEditable) {
    insertIntoContentEditable(target, msg.text);
  }
});