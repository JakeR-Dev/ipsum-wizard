type TextInputTarget = HTMLInputElement | HTMLTextAreaElement;
type EditableTarget = TextInputTarget | HTMLElement;

// util function for testing to see if an element is a text input or textarea
function isTextInput(el: Element | null): el is TextInputTarget {
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
}

// util function to return the current active element, determine if its a text input, textarea, or rich text editor
function getEditableTarget(): EditableTarget | null {
  const activeEl = document.activeElement;

  // test for input or textarea
  if (activeEl && isTextInput(activeEl)) {
    return activeEl;
  }

  // test for rich text editors
  if (activeEl instanceof HTMLElement && activeEl.isContentEditable) {
    return activeEl;
  }

  // otherwise, get the cursor position via browser api
  const selection = window.getSelection();
  if (!selection?.anchorNode) {
    return null;
  }

  // make sure we have a valid richtext element to edit
  const node = selection.anchorNode;
  const anchorEl = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  if (!anchorEl) {
    return null;
  }

  // otherwise, look for a contenteditable parent element near the cursor
  const editable = anchorEl.closest('[contenteditable]:not([contenteditable="false"])');
  return editable instanceof HTMLElement ? editable : null;
}

// util function for inserting into text inputs and textareas
function insertIntoInput(el: HTMLInputElement | HTMLTextAreaElement, text: string): void {
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
function insertIntoContentEditable(el: HTMLElement, text: string): void {
  el.focus();

  const usedExecCommand = (typeof document.execCommand === "function" && document.execCommand("insertText", false, text));

  if (usedExecCommand) {
    return;
  }

  // if no selection, just append the text to the end of the content and exit
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    el.append(document.createTextNode(text));
    el.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }

  // if we have a selection, use the Range API to insert text at the cursor position
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

// declare InsertMessage type for safety when receiving messages from popup
type InsertMessage = {
  action: "insert";
  text: string;
};

// communicate with active tab to get cursor position and insert text
chrome.runtime.onMessage.addListener((msg: unknown) => {
  const message = msg as Partial<InsertMessage>;
  if (message.action !== "insert" || typeof message.text !== "string") {
    return;
  }

  // make sure we have a target element to insert into
  const target = getEditableTarget();
  if (!target) {
    return;
  }

  // if simple text input or textarea, insert directly
  if (isTextInput(target)) {
    insertIntoInput(target, message.text);
    return;
  }

  // if rich text editor, use execCommand or Range API to insert
  if (target.isContentEditable) {
    insertIntoContentEditable(target, message.text);
  }
});