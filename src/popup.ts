const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const IPSUM = "Integer facilisis, augue at auctor suscipit, dolor arcu pulvinar justo, eu iaculis risus risus egestas ex. Praesent tincidunt, velit quis tincidunt pharetra, turpis felis finibus nunc, ut fermentum enim nulla eget tellus. Vestibulum ac ex orci. Ut aliquet iaculis dolor a ornare. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac metus quis mauris aliquet consectetur. Aliquam et odio vel lectus hendrerit dictum in eu odio. Sed varius malesuada elementum.";
const DOLOR = "Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor.";
const SIT = "Sit et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem.";
const AMET = "Amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet. Nisi est sit amet facilisis magna etiam tempor. Amet nisl suscipit adipiscing bibendum est ultricies integer quis auctor.";

function generateLorem(count: number): string {
  const snippets = [LOREM, IPSUM, DOLOR, SIT, AMET];
  // init an array of `count` length, insert random snippet for each slot
  const lorems = Array.from({ length: count }, () => {
    const randomIndex = Math.floor(Math.random() * snippets.length);
    return snippets[randomIndex];
  });
  // return string from array joined by two newlines
  return lorems.join("\n\n");
}

// grab the popup form and input elements
const form = document.querySelector("form");
const paragraphsInput = document.getElementById("paragraphs") as HTMLInputElement | null;

if (!form || !paragraphsInput) {
  throw new Error("Popup form elements were not found.");
}

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const count = Number.parseInt(paragraphsInput.value, 10);
  const text = generateLorem(Number.isNaN(count) ? 1 : count);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab?.id) {
      alert("No active tab found.");
      return;
    }
    // send the generated text to the active tab's content script
    chrome.tabs.sendMessage(activeTab.id, { action: "insert", text }).catch((err: unknown) => {
        console.error("Failed to send message:", err);
        alert("Oops, make sure your cursor is in a text field on the active tab and try again!");
      });
  });
});