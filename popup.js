const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

function generateLorem(count) {
  return Array(count).fill(LOREM).join("\n\n");
}

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const count = parseInt(document.getElementById("paragraphs").value, 10);
  const text = generateLorem(count);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "insert", text }).catch(err => {
      console.error("Failed to send message:", err);
      alert("Oops, make sure your cursor is in a text field on the active tab and try again!");
    });
  });
});