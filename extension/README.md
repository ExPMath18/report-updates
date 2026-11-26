# Email Templates side panel (Chrome extension)

Opens the Email Builder in a panel beside Gmail: Progress Update and Risk-Free Assessment emails from Radius PDFs, plus the center's email templates. Click Copy and paste into the email.

It is the Email Builder page opened with `?panel=1`, so every change to the site shows up in the panel with no update. It needs one permission (`sidePanel`) and never reads Gmail. The page remembers the center sign-in on that computer, the same as the normal Email Builder.

## For staff: install

1. Open the install link your center director sent you, in Chrome.
2. Click **Add to Chrome**, then **Add extension**.
3. Click the puzzle-piece icon in the Chrome toolbar and pin **Mathnasium Email Templates**.
4. In Gmail, click **Compose**, then click the pinned icon. The panel opens on the right.
5. The first time, sign in with your center name and password. After that it remembers you.
6. Choose **Progress Update**, **Risk-Free Assessment** or **Templates**. For the first two, drop in the Radius PDFs and click **Analyze all**. For Templates, pick one and fill in the blanks. Then click **Generate email**, then **Copy to clipboard**, and paste into your email.
7. The panel is narrow. Drag its left edge to make it wider when you are checking the skill table.

## Trying it before it is on the Web Store (developer mode)

1. Download the `extension` folder from this repo.
2. In Chrome, open `chrome://extensions` and turn on **Developer mode** (top right).
3. Click **Load unpacked** and choose the `extension` folder.
4. Pin the icon and use it as above.

Developer-mode extensions show a "disable developer mode extensions" notice when Chrome starts on some computers. The Web Store version does not.

## Publishing (for the owner)

1. Register at the Chrome Web Store developer dashboard (one-time fee).
2. Zip the contents of the `extension` folder (the files themselves, not the folder), leaving out this README.
3. Upload the zip, set **Visibility** to **Unlisted**, and fill in the listing with the text below.
4. Submit for review. Unlisted listings are reviewed too, then anyone with the link can install.
5. To update later, raise `version` in `manifest.json`, zip again and upload.

### Listing text

**Name:** Mathnasium Email Templates

**Summary (132 characters max):** Draft parent emails in a side panel next to Gmail: progress updates, assessment emails and your center's templates.

**Description:**
Staff at participating Mathnasium centers use this to write parent emails faster. Click the icon to open a side panel beside Gmail. Sign in with your center, then drop in Radius report PDFs to draft a progress update or risk-free assessment email, or pick one of the center's templates and fill in the blanks. Copy the finished email into your message. Each center has its own templates and settings. The panel is the same Email Builder page the center already uses, so it is always up to date.

**Single purpose:** Show the Email Builder in a side panel so staff can draft parent emails and copy them into Gmail.

**Permission justification (`sidePanel`):** Needed to show the Email Builder in Chrome's side panel next to Gmail.

**Privacy statement:** This extension does not sell personal data and does not read your Gmail or any web page. The side panel loads the Email Builder page (expmath18.github.io/report-updates). The only information sent anywhere is the center name and password, which go to the center's own template workspace so staff can sign in; the panel remembers that sign-in on the computer. Templates contain no student information. Report PDFs are read inside the panel on the computer and are not uploaded. Anything staff type stays in the panel and is not sent anywhere.

**Privacy policy URL:** https://expmath18.github.io/report-updates/privacy.html

**Category:** Productivity
