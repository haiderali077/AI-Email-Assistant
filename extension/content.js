console.log("Email writing assistant");

function findComposeToolBar() {
  const selectors = [".btC", ".aDh", '[role="toolbar"]', ".gU.Up"];
  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) {
      return toolbar;
    }
  }
  return null;
}

function getEmailContent() {
  const selectors = [".h7", ".a3s.aiL", "gmail_quote", '[role="presentation"]'];
  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) {
      return content.innerText.trim();
    }
  }
  return "";
}

function createExtensionButton() {
  const button = document.createElement("div");
  button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
  button.style.marginRight = "8px";
  button.innerHTML = "AI Reply";
  button.setAttribute("role", "button");
  button.setAttribute("data-tooltip", "Generate AI reply");
  return button;
}

function createToneSelector() {
  const container = document.createElement("div");
  container.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
  container.style.marginRight = "8px";
  container.style.position = "relative";
  container.style.display = "inline-block";

  const button = document.createElement("div");
  button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
  button.innerHTML = "Select Tone ▼";
  button.setAttribute("role", "button");
  button.setAttribute("data-tooltip", "Select email tone");
  button.style.cursor = "pointer";
  button.style.width = "max-content";
  button.style.maxWidth = "180px";

  const dropdown = document.createElement("div");
  dropdown.className = "tone-dropdown";
  dropdown.style.display = "none";
  dropdown.style.position = "absolute";
  dropdown.style.backgroundColor = "#fff";
  dropdown.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
  dropdown.style.borderRadius = "4px";
  dropdown.style.zIndex = "1000";
  dropdown.style.minWidth = "max-content";
  dropdown.style.maxWidth = "200px";

  const tones = ["Professional", "Friendly", "Casual"];
  tones.forEach(tone => {
    const option = document.createElement("div");
    option.className = "tone-option";
    option.innerHTML = tone;
    option.style.padding = "8px 12px";
    option.style.cursor = "pointer";
    option.style.borderBottom = "1px solid #eee";
    option.style.color = "black";
    option.addEventListener("mouseover", () => {
      option.style.backgroundColor = "#f5f5f5";
    });
    option.addEventListener("mouseout", () => {
      option.style.backgroundColor = "#fff";
    });
    option.addEventListener("click", () => {
      button.innerHTML = `${tone} ▼`;
      dropdown.style.display = "none";
      window.selectedTone = tone.toLowerCase();
    });
    dropdown.appendChild(option);
  });

  button.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  container.appendChild(button);
  container.appendChild(dropdown);
  return container;
}

function injectButton() {
  const existingButton = document.querySelector(".extension-reply-button");
  if (existingButton) existingButton.remove();
  
  const existingToneSelector = document.querySelector(".tone-selector-container");
  if (existingToneSelector) existingToneSelector.remove();
  
  const toolbar = findComposeToolBar();

  if (!toolbar) {
    console.log("Toolbar not found");
    return;
  }
  console.log("Toolbar found, creating Extension button");
  const button = createExtensionButton();
  const toneSelector = createToneSelector();
  toneSelector.classList.add("tone-selector-container");
  button.classList.add("extension-reply-button");
  button.addEventListener("click", async () => {
    try {
      button.innerHTML = "Generating...";
      button.disabled = true;

      const emailContent = getEmailContent();
      const response = await fetch("https://email-writer-sb-latest-1ox0.onrender.com/api/email/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Origin": "https://mail.google.com"
        },
        mode: "cors",
        credentials: "include",
        body: JSON.stringify({
          emailContent: emailContent,
          tone: window.selectedTone || "professional",
        }),
      });
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      const generatedReply = await response.text();
      const composeBox = document.querySelector(
        '[role="textbox"][g_editable="true"]'
      );
      if (composeBox) {
        composeBox.focus();
        document.execCommand("insertText", false, generatedReply);
      } else {
        console.error("ComposeBox was not found");
      }
    } catch (error) {
      console.error("Error generating reply:", error);
      alert(`Failed to generate the reply: ${error.message}`);
    } finally {
      button.innerHTML = "AI Reply";
      button.disabled = false;
    }
  });

  toolbar.insertBefore(toneSelector, toolbar.firstChild);
  toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);
    const hasComposeElements = addedNodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node.matches('.aDh, .btC, [role="dialog"]') ||
          node.querySelector('.aDh, .btC, [role="dialog"]'))
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
