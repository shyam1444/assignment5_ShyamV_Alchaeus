// Autofill textarea with selected text from the page (if any)
window.onload = function() {
    const input = document.getElementById("highlightInput");
    if (!input) return;
    if (chrome.tabs && chrome.scripting) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          chrome.scripting.executeScript(
            {
              target: {tabId: tabs[0].id},
              func: () => window.getSelection().toString()
            },
            (results) => {
              if (chrome.runtime.lastError) return;
              if (results && results[0] && results[0].result) {
                input.value = results[0].result;
              }
            }
          );
        }
      });
    }
  };
  
  document.getElementById("saveHighlightBtn").onclick = () => {
    const text = document.getElementById("highlightInput").value.trim();
    if (!text) {
      alert("Please enter or paste some highlighted text.");
      return;
    }
    try {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (chrome.runtime.lastError) {
          alert("Could not get tab info: " + chrome.runtime.lastError.message);
          return;
        }
        const tab = tabs[0] || {};
        const url = tab.url || "";
        const title = tab.title || "";
        const timestamp = new Date().toISOString();
        // Fill preview modal
        document.getElementById("previewText").textContent = text;
        document.getElementById("previewUrl").textContent = url;
        document.getElementById("previewTitle").textContent = title;
        document.getElementById("previewTimestamp").textContent = timestamp;
        // Show modal
        document.getElementById("previewModal").style.display = "flex";
        // Store data for sending
        window._pendingHighlightData = { text, url, title, timestamp };
      });
    } catch (err) {
      alert("Unexpected error: " + err.message);
    }
  };
  
  document.getElementById("cancelSendBtn").onclick = () => {
    document.getElementById("previewModal").style.display = "none";
    window._pendingHighlightData = null;
  };
  
  document.getElementById("confirmSendBtn").onclick = () => {
    const data = window._pendingHighlightData;
    if (!data) return;
    const scriptURL = "https://script.google.com/macros/s/AKfycbyXoLOc09QmyT_nB3UHi2JL1xYo_m12yGKBLiNMr1vejBOEtOg-k_TCXfng93_YflQfWw/exec";
    const confirmBtn = document.getElementById("confirmSendBtn");
    confirmBtn.disabled = true;
    fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(() => {
      alert("Highlight saved to Google Sheet!");
      document.getElementById("highlightInput").value = "";
      document.getElementById("previewModal").style.display = "none";
      window._pendingHighlightData = null;
      confirmBtn.disabled = false;
    }).catch((err) => {
      alert("Failed to save highlight. " + (err && err.message ? err.message : ""));
      document.getElementById("previewModal").style.display = "none";
      window._pendingHighlightData = null;
      confirmBtn.disabled = false;
    });
  };