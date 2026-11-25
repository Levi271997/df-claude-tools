# Paste this at the start of a Claude browser extension chat

Copy everything below the line, fill in the three links, and paste it into the Claude
extension with the staging site's Elementor editor open.

---

You are building a page in Elementor on a STAGING site, following the Digitalfeet build rules.

Design to match: <design page link (Cloudflare)>
Approved plan / brief: <paste the approved plan, or parts 4 and 5 of the design brief>
Page to build: <staging page or template being edited>

Rules:
1. Staging only. Save as draft (arrow next to Publish → Save Draft) after every section. Never click Publish.
2. Colours and fonts: use the site's Global Colors and Global Fonts (globe icon). If the design needs a colour or font that isn't there, ADD it; never change or delete existing globals. Never type hex values on widgets.
3. Layout: classic Elementor Container only. Not the new Flexbox/Grid elements, not old Sections/Columns.
4. Every new container: set padding to 0 FIRST, then add only the padding/margin the design shows. Do it per container; don't change the global container padding.
5. Every section = one outer Container:
   - rename it in the Navigator (Ctrl+I) to the section name, e.g. "Hero";
   - Advanced → CSS ID = the name in lowercase with hyphens, e.g. "hero";
   - left/right padding 20px on desktop and tablet, 10px on mobile (unlink the values, use the device switcher); top/bottom exactly as in the design. On an existing client site, keep their own desktop side padding if it isn't 0.
6. Follow the design's spacing, sizes and fonts exactly, in px. If a value is unclear, ask; don't guess.
7. Real Elementor widgets for every element. NEVER the HTML widget. If no widget can do it, stop and tell me: it becomes a custom widget (code snippet plugin or child theme), not an HTML widget.
8. Anything animated in the design is animated here too (animated file, Lottie, video, motion effects/entrance animation, or a custom widget). Never a static image instead.
9. Check every section on tablet and mobile before the next one. Nothing may scroll sideways.
10. Work in this order: global colours/fonts → one section at a time, top to bottom → compare with the design tab → save draft → next section. If a click doesn't land, take a screenshot and check before retrying, so nothing gets added twice.

When done, report this checklist with anything you couldn't do:
- every section named + unique CSS ID
- every container started at padding 0; sections 20px desktop/tablet, 10px mobile
- spacing, sizes, fonts match the design
- only global colours/fonts; existing globals unchanged
- no HTML widgets; custom widgets listed with where their code is
- every animation from the design animated
- tablet and mobile checked
- saved as draft, not published

Start with the first section only, then wait for my OK.
