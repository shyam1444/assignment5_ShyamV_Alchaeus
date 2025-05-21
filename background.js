chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "saveToSheet",
      title: "Save selection to Sheet",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "saveToSheet") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (selectedText) => {
          window.postMessage({ type: "SAVE_TO_SHEET", text: selectedText }, "*");
        },
        args: [info.selectionText]
      });
    }
  });