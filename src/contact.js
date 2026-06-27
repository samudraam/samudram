const EMAIL = "r.samudrala234@gmail.com";
const COPIED_LABEL = "copied!";
const COPY_LABEL = "email";

/**
 * Copies text to the clipboard using the modern API with a legacy fallback.
 * @param {string} text - Text to copy.
 * @returns {Promise<boolean>} Whether the copy succeeded.
 */
const copyToClipboard = async (text) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
};

/**
 * Shows temporary feedback on the email copy button.
 * @param {HTMLButtonElement} button - The copy button element.
 * @param {HTMLElement} feedback - Screen-reader live region.
 */
const showCopyFeedback = (button, feedback) => {
  const label = button.querySelector(".contact-btn__label");
  if (!label) return;

  const originalText = label.textContent;
  label.textContent = COPIED_LABEL;
  button.classList.add("contact-btn--copied");
  feedback.textContent = `Email ${EMAIL} copied to clipboard`;

  window.setTimeout(() => {
    label.textContent = originalText ?? COPY_LABEL;
    button.classList.remove("contact-btn--copied");
    feedback.textContent = "";
  }, 2000);
};

/**
 * Wires up the email copy-to-clipboard button on the contact page.
 */
const initContactPage = () => {
  const copyButton = document.getElementById("contact-copy-email");
  const feedback = document.getElementById("contact-copy-feedback");
  if (!copyButton || !feedback) return;

  const handleCopyEmail = async () => {
    const copied = await copyToClipboard(EMAIL);
    if (copied) {
      showCopyFeedback(copyButton, feedback);
    }
  };

  copyButton.addEventListener("click", handleCopyEmail);
};

initContactPage();
