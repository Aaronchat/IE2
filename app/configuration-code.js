const input = document.querySelector("#configuration-code-input");
const clearButton = document.querySelector("#configuration-code-clear");
const generateButton = document.querySelector("#generate-prompt");
const codeOutput = document.querySelector("#seed-output");

if (input) {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/gu, "").slice(0, 10);
  });
}

if (clearButton && input) {
  clearButton.addEventListener("click", () => {
    input.value = "";
    input.focus();
  });
}

if (generateButton && codeOutput) {
  generateButton.addEventListener("click", () => {
    setTimeout(() => {
      const code = globalThis.__IE2_LAST_CONFIGURATION_CODE;
      if (!code) return;
      codeOutput.textContent = `Configuration Code: ${code}`;
    }, 0);
  });
}
