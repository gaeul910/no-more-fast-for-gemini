/**
 * Content script for gemini.google.com only.
 * If "빠른 모델" (Flash) is the currently selected model,
 * automatically clicks the "Pro" option to switch to it.
 * "사고 모델" is left unchanged.
 */

const FAST_MODEL_TEXT = "빠른 모델";
const PRO_MODEL_TEXT = "Pro";

// Find an element by its visible text content (exact or partial match)
function findElementByText(text, selector = "*") {
  const elements = document.querySelectorAll(selector);
  for (const el of elements) {
    if (
      el.children.length === 0 && // leaf text node
      el.textContent.trim() === text
    ) {
      return el;
    }
  }
  return null;
}

// Check if "빠른 모델" is the currently selected model
// by looking for it in the model selector button/label (outside dropdown)
function isFastModelSelected() {
  // Check aria-checked, aria-selected, or data-selected attributes
  const allText = document.querySelectorAll("*");
  for (const el of allText) {
    if (
      el.children.length === 0 &&
      el.textContent.trim() === FAST_MODEL_TEXT
    ) {
      // Walk up to find the parent item and check if it's selected
      let parent = el.parentElement;
      for (let i = 0; i < 5; i++) {
        if (!parent) break;
        if (
          parent.getAttribute("aria-checked") === "true" ||
          parent.getAttribute("aria-selected") === "true" ||
          parent.getAttribute("data-selected") === "true" ||
          parent.classList.contains("selected") ||
          parent.classList.contains("active")
        ) {
          return { found: true, element: parent };
        }
        parent = parent.parentElement;
      }
    }
  }
  return { found: false };
}

// Try to open the model dropdown and click the Pro option
async function switchToProModel() {
  // Step 1: Check if the model selector button shows "빠른 모델"
  // (the label shown in the header/toolbar when dropdown is closed)
  const modelButton = findModelSelectorButton();
  if (!modelButton) return false;

  // Step 2: Click to open the dropdown
  modelButton.click();
  await wait(500);

  // Step 3: Find and click the Pro option inside the dropdown
  const proOption = findProOption();
  if (proOption) {
    proOption.click();
    console.log("[no-more-gemini-fast] Switched to Pro model.");
    return true;
  } else {
    // Close the dropdown if Pro option not found
    modelButton.click();
    return false;
  }
}

// Find the model selector button (closed state showing current model name)
function findModelSelectorButton() {
  // Look for a button/div that contains "빠른 모델" text
  const allElements = document.querySelectorAll(
    "button, [role='button'], [role='combobox']"
  );
  for (const el of allElements) {
    if (el.textContent.includes(FAST_MODEL_TEXT)) {
      return el;
    }
  }
  return null;
}

// Find the Pro option inside an open dropdown
function findProOption() {
  const candidates = document.querySelectorAll(
    "[role='option'], [role='menuitem'], [role='listitem'], li, button"
  );
  for (const el of candidates) {
    const text = el.textContent.trim();
    // Match "Pro" option but NOT "빠른 모델 → Pro" (our renamed text)
    if (text.startsWith(PRO_MODEL_TEXT) || text.includes("3.1 Pro")) {
      return el;
    }
  }
  return null;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Keep retrying until the page/model selector is ready
async function trySwitch(retries = 10, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    const modelButton = findModelSelectorButton();
    if (modelButton) {
      await switchToProModel();
      return;
    }
    await wait(delayMs);
  }
  console.log("[no-more-gemini-fast] Model selector not found after retries.");
}

// Start after DOM is ready
if (document.body) {
  trySwitch();
} else {
  document.addEventListener("DOMContentLoaded", () => trySwitch());
}
