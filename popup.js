const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
const IPSUM = 'Integer facilisis, augue at auctor suscipit, dolor arcu pulvinar justo, eu iaculis risus risus egestas ex. Praesent tincidunt, velit quis tincidunt pharetra, turpis felis finibus nunc, ut fermentum enim nulla eget tellus. Vestibulum ac ex orci. Ut aliquet iaculis dolor a ornare. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac metus quis mauris aliquet consectetur. Aliquam et odio vel lectus hendrerit dictum in eu odio. Sed varius malesuada elementum.';
const DOLOR = 'Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor.';
const AMET = 'Amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet. Nisi est sit amet facilisis magna etiam tempor. Amet nisl suscipit adipiscing bibendum est ultricies integer quis auctor.';

function generateLorem(count) {
  const snippets = [LOREM, IPSUM, DOLOR, AMET];
  // init an array of `count` length, insert random snippet for each slot
  const lorems = Array.from({ length: count }, () => {
    const randomIndex = Math.floor(Math.random() * snippets.length);
    return snippets[randomIndex];
  });
  // return array joined by two newlines
  return lorems.join("\n\n");
}

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const count = parseInt(document.getElementById("paragraphs").value, 10);
  const text = generateLorem(count);

  // send the generated text to the active tab's content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "insert", text }).catch(err => {
      console.error("Failed to send message:", err);
      alert("Oops, make sure your cursor is in a text field on the active tab and try again!");
    });
  });
});