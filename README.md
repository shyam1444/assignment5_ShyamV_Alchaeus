# Web-to-Sheet Logger

A Chrome extension to capture highlighted text from any webpage and log it to a connected Google Sheet, along with metadata (timestamp, page URL, and title).
Link to the Google Sheet - https://docs.google.com/spreadsheets/d/12Nd4nxFvhwL257rrEJ4-XbEhV3TgVNxXk-aeSstLy7U/edit?usp=sharing
---

## Features
- Highlight text on any webpage and save it to Google Sheets
- Floating "Save to Sheet" button and context menu
- Popup UI for manual entry and metadata preview
- Metadata captured: selected text, page URL, page title, timestamp
- Confirmation modal before sending
- Robust error handling and user-friendly design

---

## Permissions Used
- `activeTab`: To access the current tab's URL and title for metadata
- `scripting`: To inject scripts for context menu and popup autofill
- `contextMenus`: To add the right-click "Save selection to Sheet" option
- `host_permissions: <all_urls>`: To allow the extension to run on any webpage

---

## Setup Instructions

### 1. Google Apps Script Backend
- Go to [Google Apps Script](https://script.google.com) and create a new project.
- Replace `Code.gs` with:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.openById("YOUR_SHEET_ID").getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.text, data.url, data.title, data.timestamp]);
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}

function doGet(e) {
  var html = `...`; // (UI HTML as provided in the project)
  return HtmlService.createHtmlOutput(html);
}
```
- Replace `YOUR_SHEET_ID` with your actual Google Sheet ID (from the sheet URL).
- Deploy as **Web App**:
  - Click **Deploy > New deployment**
  - Select **Web app**
  - Set **Who has access** to **Anyone**
  - Click **Deploy** and **Authorize** if prompted
  - Copy the Web App URL (ends with `/exec`)
  - https://script.google.com/macros/s/AKfycbyXoLOc09QmyT_nB3UHi2JL1xYo_m12yGKBLiNMr1vejBOEtOg-k_TCXfng93_YflQfWw/exec - Web URL of my project

### 2. Chrome Extension Setup
- Clone or download this repository.
- In both `popup.js` and `content.js`, replace `YOUR_WEB_APP_URL` with your Apps Script Web App URL.
- Go to `chrome://extensions` in Chrome.
- Enable **Developer Mode**.
- Click **Load unpacked** and select the extension folder.
- Pin the extension for easy access.

### 3. Usage
- **Highlight text** on any webpage. Click the floating "Save to Sheet" button or use the context menu.
- **Or:** Open the extension popup, paste/type text, preview metadata, and confirm.
- **Check your Google Sheet** for new entries.

---

## Known Limitations
- **No authentication:** Anyone with the Web App URL can POST data to your sheet. (For personal/research use only.)
- **CORS:** Uses `mode: "no-cors"` for fetch; no response is available to the extension.
- **Works only on pages where content scripts are allowed:** Not on Chrome Web Store, chrome:// pages, or some Google Docs/Sheets pages.
- **No bulk/multi-select:** Only one highlight at a time (bonus: can be added).
- **No tags/categories:** (bonus: can be added).
- **No switching between multiple sheets:** (bonus: can be added).

---

## Demo
- Highlight text → click "Save to Sheet" → check Google Sheet for new row.
- Popup: Paste/type text → preview metadata → confirm → check Google Sheet.

---

## Credits
- Developed for internship assignment at AlfaLeus Tech.
- Powered by Chrome Extensions and Google Apps Script. 
