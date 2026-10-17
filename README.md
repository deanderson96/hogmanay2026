# Hogmanay 2026 — family information site

A responsive, static site for the family celebration on **Thursday 31 December 2026**.

## Update the details

Edit **[details.js](details.js)** on GitHub. All editable event information is in one place:
- Start time, venue name/address and directions link
- Food and drinks, dress code, travel, overnight stays
- Timeline and frequently asked questions
- Optional organiser email address

Leave fields blank until arrangements are agreed. The site then displays a clear 'to be confirmed' message instead of publishing invented details. Avoid putting private home addresses, personal phone numbers or other sensitive details on a public site unless you're comfortable sharing them publicly.

## Publish with GitHub Pages

1. In this repository, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then save.
4. Once published, visit **https://deanderson96.github.io/hogmanay2026/**.

This is a public static website with no server or authentication. Anyone with the URL can see its details, so do not treat it as a private family portal.

## Files

- `index.html` — page sections and accessible markup
- `styles.css` — responsive visual design
- `details.js` — editable family event information
- `app.js` — countdown, itinerary, FAQ rendering and safe links

No build process, hosting subscription or dependencies are required. Google Fonts needs an internet connection; local fallback fonts are provided.
