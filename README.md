# Web-to-Sheet Logger

## Features
- Highlight text on any webpage, save to Google Sheet with metadata (URL, title, timestamp)
- Floating "Save to Sheet" button or context menu
- Google Apps Script backend

## Setup
1. Deploy Apps Script, get Web App URL, set Sheet ID.
2. Update extension files with your URLs.
3. Load extension in Chrome.

## Permissions
- activeTab, scripting, contextMenus

## Known Limitations
- Only works on pages where content scripts are allowed
- No authentication (anyone with link can POST)

## Google Apps Script Backend
1. Go to [Google Apps Script](https://script.google.com).
2. Create a new project.
3. Replace `Code.gs` with:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.openById("YOUR_SHEET_ID").getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.text, data.url, data.title, data.timestamp]);
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}
```
- Deploy as Web App: **Anyone with the link can access**.

## Demo
- Highlight text → click "Save to Sheet" → check Google Sheet for new row. 