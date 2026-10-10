# Mari Kawan Creative website

Static site: plain HTML pages, one stylesheet, one script. Upload everything to your hosting root.

## Structure

- `index.html`, `about.html`, `services.html`, `case-studies.html`, `contact.html`
- `case-*.html`: one detail page per case study
- `assets/style.css`: the whole design system (tokens, type scale, components)
- `assets/main.js`: mobile menu, scroll reveal, case filter (animated), count-up numbers, hero slider

## Common edits

**Fonts and sizes.** The type scale follows the PHI typography standard with Inter: H1 36-42px (32px mobile), hero subtitle 19px (16px), column heading 16px, overline 13px (11px), body 15px (13.5px), UI text 14px, meta 12-13px. All values are variables in `assets/style.css`, section 1. Pages only use `t-display`, `t-h1`, `t-h2` (all H1 size), `t-h3`, `t-lead` (hero subtitle), `t-body`, `t-small`, `t-eyebrow`, so changing a variable updates every page.

**Colors.** Same file, section 1. Tailwind colors (`blue`, `darkBlue`, `lightBlue`, `light`) are set in the `tailwind.config` block in each page's `<head>`.

**Logo.** Put your file in `assets/` and replace the `<span class="brand__mark">MKC</span>` in the header and footer with `<img src="assets/logo.svg" alt="" class="brand__logo">`. Header height is `--nav-h`.

**Hero slider.** In `index.html`, find the comment `Hero slider`. Each `<article class="slide">` is one slide: edit the text, buttons and visual, or copy a block to add a slide. When you add or remove a slide, add or remove a matching `dot-btn` button in the `slider-dots` group. Timing is `DELAY` in `main.js`. All slides share one background tone (`.slide-light` in `style.css`).

**Counting numbers.** Any `<span data-count="6" data-suffix="%">` counts up from 0 when it scrolls into view.

**Case study images.** The browser and phone frames are CSS placeholders (`.mk`, `.phn`). Replace the `<div class="mk ...">` block with `<img src="assets/case-name.webp" alt="...">` when you have screenshots.

**Social links.** Search for `marikawanid` and update the URLs if a handle changes.

**Contact form.** In `contact.html`, replace `YOUR_FORM_ID` with your Formspree form ID, or point `action` at your own backend. Also update the email, phone, address and WhatsApp number in the footer and contact page.

## Notes

- Header and footer are repeated in every page (no build step). When you change them, update each file, or ask for a regenerated set.
- The Tailwind CDN is convenient but heavy. For best performance, compile a static CSS file before a high-traffic launch.
