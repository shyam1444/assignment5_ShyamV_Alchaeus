let floatBtn = null;

// Replace with your Apps Script Web App URL
const scriptURL = "https://script.google.com/macros/s/AKfycbyXoLOc09QmyT_nB3UHi2JL1xYo_m12yGKBLiNMr1vejBOEtOg-k_TCXfng93_YflQfWw/exec";

document.addEventListener("mouseup", (e) => {
  const selection = window.getSelection().toString();
  if (selection.length > 0) {
    showFloatingButton(e.pageX, e.pageY, selection);
  } else {
    removeFloatingButton();
  }
});

function showFloatingButton(x, y, selectedText) {
  removeFloatingButton();
  floatBtn = document.createElement("button");
  floatBtn.innerText = "Save to Sheet";
  floatBtn.style.position = "absolute";
  floatBtn.style.top = `${y + 10}px`;
  floatBtn.style.left = `${x + 10}px`;
  floatBtn.style.zIndex = 9999;
  floatBtn.style.background = "#4285F4";
  floatBtn.style.color = "#fff";
  floatBtn.style.border = "none";
  floatBtn.style.padding = "8px 12px";
  floatBtn.style.borderRadius = "5px";
  floatBtn.style.cursor = "pointer";
  floatBtn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  document.body.appendChild(floatBtn);

  floatBtn.onclick = () => {
    const data = {
      text: selectedText,
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString()
    };
    sendToSheet(data);
    removeFloatingButton();
  };
}

function removeFloatingButton() {
  if (floatBtn) {
    floatBtn.remove();
    floatBtn = null;
  }
}

function sendToSheet(data) {
  fetch(scriptURL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(() => {
    alert("Saved to Google Sheet!");
  }).catch(() => {
    alert("Failed to save. Try again.");
  });
}

// Listen for context menu event from background
window.addEventListener("message", (event) => {
  if (event.data.type === "SAVE_TO_SHEET") {
    const data = {
      text: event.data.text,
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString()
    };
    sendToSheet(data);
  }
});
