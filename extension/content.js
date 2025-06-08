console.log("Email writing assistant");

function findComposeToolBar() {}
function createExtensionButton() {}

function injectButton() {
  const existingButton = document.querySelector(".extension-reply-button");
  if (existingButton) existingButton.remove();
  const toolbar = findComposeToolBar();

  if (!toolbar) {
    console.log("Toolbar not found");
    return;
  }
  console.log("Toolbar found, creating Extension button");
  const button = createExtensionButton();
  button.classList.add(".extension-reply-button");
  button.addEventListener("click", async () => {});

  toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);
    const hasComposeElements = addedNodes.some(
      (node) =>
        (node.nodeType === Node.ELEMENT_NODE &&
          node.matches('.aDh, .btC, [role="dialog"]')) ||
        node.querySelector('.aDh, .btC, [role="dialog"]')
    );

    if (hasComposeElements) {
      console.log("Compose window detected");
      setTimeout(injectButton, 500);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
