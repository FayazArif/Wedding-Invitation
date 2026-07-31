/**
 * Google Apps Script for the Wedding Invitation "Send your wishes" form.
 *
 * SETUP (one time, ~3 minutes):
 *  1. Go to https://sheets.google.com and create a new blank spreadsheet.
 *     (Name it anything, e.g. "Wedding Wishes".)
 *  2. In that sheet: menu  Extensions  ->  Apps Script.
 *  3. Delete whatever code is there and paste ALL of this file.
 *  4. Click Save (disk icon).
 *  5. Click Deploy  ->  New deployment.
 *  6. Click the gear icon  ->  choose "Web app".
 *  7. Settings:
 *        Execute as:        Me (your Google account)
 *        Who has access:    Anyone
 *  8. Click Deploy. Approve/authorize when Google asks
 *     (choose your account -> Advanced -> Go to project -> Allow).
 *  9. Copy the "Web app URL" it shows (it ends with /exec).
 * 10. Send me that URL (or paste it into script.js as SHEET_ENDPOINT).
 *
 * After that, every wish submitted on the website appears as a new row
 * in the spreadsheet: Timestamp | Name | Wishes.
 */

// Email address that gets notified whenever a new wish is submitted.
var NOTIFY_EMAIL = "fayazarif@prostem.org";

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Wishes") || ss.insertSheet("Wishes");

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Wishes"]);
    }

    var data = JSON.parse(e.postData.contents);
    var name = data.name || "";
    var wish = data.wish || "";
    sheet.appendRow([new Date(), name, wish]);

    // Email notification each time a new wish arrives.
    try {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "New wedding wish from " + name,
        body: "You received a new wish for Fayaz Arif & Sabreen\n\n"
            + "From: " + name + "\n\n"
            + wish + "\n\n"
            + "View all wishes: " + ss.getUrl()
      });
    } catch (mailErr) {
      // Ignore email errors so the wish is still saved to the sheet.
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you open the /exec URL in a browser to confirm it's deployed.
function doGet() {
  return ContentService.createTextOutput("Wedding wishes endpoint is live.");
}

/**
 * RUN THIS ONCE from the Apps Script editor to test email + authorize mail access.
 *  1. Select "sendTestEmail" in the function dropdown at the top.
 *  2. Click Run.
 *  3. Approve the authorization prompt (your account -> Advanced -> Allow).
 *  4. Check the inbox of NOTIFY_EMAIL for a "TEST" email.
 * If no email arrives, open View -> Executions (or the run log) to see the error.
 */
function sendTestEmail() {
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: "TEST - wedding wishes notification",
    body: "If you can read this, email notifications are working. Remaining daily quota: "
        + MailApp.getRemainingDailyQuota()
  });
  Logger.log("Test email sent to " + NOTIFY_EMAIL);
}
