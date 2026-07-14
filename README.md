# Fayaz Arif & Sabreen Wedding Invitation

A cinematic, mobile-responsive wedding invitation website with a white and pink romantic heart theme.

## Files

- `index.html` - page structure, Open Graph metadata, and invitation content
- `style.css` - romantic theme, responsive layout, pink shine, glass panels, and hearts
- `script.js` - tap-to-open, countdown, scratch reveal, heart particles, music, reveal animations
- `assets/images/` - lightweight visual placeholders for hero, couple portraits, gallery, venue, and preview
- `assets/music/` - place `wedding-music.mp3` here

## Customize

Replace these placeholder images with real photos using the same filenames:

- `assets/images/groom-portrait.svg`
- `assets/images/bride-portrait.svg`
- `assets/images/gallery-1.svg`
- `assets/images/gallery-2.svg`
- `assets/images/gallery-3.svg`
- `assets/images/gallery-4.svg`

For background music, add:

`assets/music/wedding-music.mp3`

Update the venue text in `index.html` if you want the exact hall name and address shown on the page. The venue section includes an embedded Google Maps view for:

`https://maps.app.goo.gl/T9LLrzE86vH5gifKA`

## WhatsApp Preview

The Open Graph metadata is included in `index.html`. When hosting the site publicly, replace:

`https://example.com/wedding-invitation`

with the final website URL. For the most reliable WhatsApp preview, use a public absolute URL for `og:image`; the current local build points to `assets/images/og-preview.svg`.

## Run

Open `index.html` directly in a browser, or serve the folder with any static web server.
