---
name: elementor-build-rules
description: Digitalfeet's house rules for building WordPress pages in Elementor. Use this whenever you build, rebuild, edit or fix a page, section, template or widget in Elementor, including working in the Elementor editor through the Claude browser extension (Claude in Chrome), planning a build, writing the build prompt for the extension, or turning a design, mockup, Cloudflare link or design brief into an Elementor page. Also use it when reviewing an Elementor build, even if the user only says "build this page" or "make this in WordPress".
---

# Digitalfeet Elementor build rules

These rules describe how Digitalfeet builds in Elementor, so every page is built the same
way no matter who (or which Claude) built it. The developer will maintain the page after
you, so build it the way they would: tidy, named, made of real Elementor widgets, and
driven by the site's global settings.

If a design brief exists (from the `design-brief` agent, in `design-briefs` on the user's Desktop),
read it first: it has the exact colours, fonts, sizes, spacing and section list.

## 1. Before you start

Check these on the site and say what you found before building:

1. **Elementor Pro or not.** Look under Plugins or the Elementor menu (Theme Builder,
   Custom Code). This decides whether Pro widgets are available (section 4).
2. **Child theme or not.** Appearance → Themes. Custom code needs a place to live:
   - Child theme active → custom code goes in the child theme's `functions.php`.
   - No child theme → stop and ask the developer to install a code snippet plugin
     (e.g. Code Snippets / WPCode), then put the code there. Never edit the parent
     theme: its files are overwritten on the next theme update.
3. **Existing global colours and fonts.** Site Settings → Global Colors / Global Fonts.
4. **Existing section padding.** On an existing client site, open a few existing
   sections and note their left/right padding (section 3).
5. **Where you are.** Work on staging, save as draft, and leave publishing to the
   developer.

## 2. Colours and typography

- Take colours and typography from the design brief, or from the design itself.
- **New site (no globals yet):** create them as Global Colors and Global Fonts, named by
  role (Primary, Secondary, Text, Accent, Dark background...).
- **Existing globals:** keep every existing colour and font as it is, and only *add* the
  new ones the design needs. Other pages use the existing ones, so changing them would
  change the whole site.
- Then use the globals everywhere. Pick the global colour/font on each widget instead
  of typing a hex value or font size, so a later brand change is one edit.

## 3. Structure: containers, names, IDs, padding

**Use the classic Elementor Container.** Don't use the new Flexbox or Grid elements, and
don't use the old Section/Column layout. Set row/column direction, gap and alignment on
the Container itself.

**Every section is one outer Container:**

| Setting | Rule |
|---|---|
| Name (Navigator) | Rename it to the section's name from the design or brief, e.g. `Hero`, `Let's talk about`, `Contact`. The developer finds sections by these names. |
| CSS ID (Advanced → CSS ID) | Always set one: the section name in lowercase with hyphens, e.g. `hero`, `lets-talk-about`, `contact`. Unique on the page. Menus and "jump to" links use these. |
| Padding left/right | **20px** on desktop and tablet, **10px on mobile**. On an existing client site, use their existing left/right section padding on desktop instead, unless it is 0. |
| Padding top/bottom | Exactly as in the design. |

**Padding starts at 0 on every container.** When you add a container (outer or inner),
first set its padding to 0, then add only the padding or margin the design shows.
Elementor gives new containers default padding, so skipping this adds spacing the
design doesn't have. Do it on each container one by one. Don't change the global
container padding in Site Settings, because that would affect every existing page.

**Follow the spacing exactly.** Padding, margins, gaps between items, widths and heights
come from the design or brief, in px, not by eye. When a value isn't clear, measure it
in the design's source or ask. Don't guess.

## 4. Widgets: always real Elementor widgets

- Build every element with an Elementor widget: Heading, Text Editor, Image, Button,
  Icon, Icon List, Form, Tabs, Loop Grid, Carousel... The developer and the client can
  then edit the content in the editor.
- **Don't use the HTML widget.** Code inside it can't be edited by the client, doesn't
  follow the globals, and is easy to break.
- **When Elementor has no widget for it**, write a custom Elementor widget instead.
  This covers Pro widgets on a site without Elementor Pro, and design parts no widget
  can do. The widget lives in the child theme's `functions.php` (or a file it
  includes), or in the code snippet plugin if there's no child theme. Pattern:
  - register it on the `elementor/widgets/register` hook, class extending
    `\Elementor\Widget_Base`;
  - give it controls for its content (text, images, links, repeaters) so it is edited
    like any other widget, not by changing code;
  - style it with the global colours/fonts (`var(--e-global-color-primary)`,
    `var(--e-global-typography-primary-font-family)`), not hard-coded values;
  - prefix names with `df_` / `df-` so they don't clash with plugins.

## 5. Animations

If something moves in the design, it moves on the built page too. Never replace an
animated image, element or effect with a static image or screenshot.

Read the design's source to see what animates and how (CSS `@keyframes`, transitions,
JS, GIF/animated WebP, Lottie, video), and match the timing (duration, delay, stagger).
Use the simplest real option:

| In the design | Build it with |
|---|---|
| Animated GIF / WebP | Image widget with the animated file itself (not a still frame) |
| Lottie / JSON animation | Lottie widget (Pro), or a custom widget without Pro |
| Video or looping clip | Video widget (autoplay, muted, loop as in the design) |
| Fade/slide in on scroll | Motion Effects / Entrance Animation on the widget or container |
| Hover effects | Widget hover settings (colour, transform, transition) |
| Custom sequences (staggered pop-ins, tooltips, rings) | Custom widget (section 4) with its CSS/JS |

## 6. Tablet and mobile

Check every section at tablet and mobile before moving on. If the design has no mobile
version: section side padding is 20px on tablet and **10px on mobile**; scale large vertical padding and big headings down
(about half on mobile), and stack row containers into columns. Nothing should overflow
sideways.

## 7. Working order

1. Checks (section 1), then globals (section 2).
2. Build section by section, top to bottom. For each section: outer Container (padding
   0 → name → ID → padding), inner Containers (padding 0 first), widgets, animations,
   then tablet/mobile.
3. Compare each finished section with the design before starting the next one.
4. Repeated parts (header, footer, cards used on several pages) go in a saved
   template or the Theme Builder, not copied by hand.

## 8. Working in the editor with the browser extension

Digitalfeet builds through the Claude browser extension: Claude works in the Elementor
editor on the staging site the way a developer would, by clicking. (Novamira and other
WordPress MCP connections are no longer used for building.)

- **Two tabs:** the Elementor editor on staging, and the design page (Cloudflare link) to
  compare with. Build one section, then look at both before the next.
- **Name:** open the Navigator (Ctrl+I), double-click the container, type the section name.
- **CSS ID:** select the outer container → Advanced tab → CSS ID.
- **Padding per device:** Advanced → Padding, unlink the values (chain icon), and use the
  device switcher next to the field (desktop / tablet / mobile) to set 20px / 20px / 10px
  sides. Desktop values otherwise carry down to tablet and mobile.
- **Globals:** pick colours and fonts with the globe icon next to the field, never by
  typing a hex value.
- **Save as draft:** the arrow next to Publish → Save Draft. Never click Publish. Save
  after every section, so a browser hiccup loses at most one section.
- **Custom code** (custom widgets, CSS): in the browser this means the code snippet
  plugin's screen in wp-admin, or Appearance → Theme File Editor on the child theme if it
  is enabled. If neither is available, write the code out in the reply and hand it to the
  developer instead of using an HTML widget.
- **When the editor is slow or a click doesn't land**, take a screenshot and check the
  state before trying again; don't repeat a step blindly (it can add duplicate widgets).

If the extension does not load this skill by itself, paste the short version in
`extension-prompt.md` (next to this file) at the start of the chat.

## 9. Before you hand over

Report this checklist to the developer, with anything you couldn't do and why:

- [ ] Every section container is named and has a unique CSS ID
- [ ] Every container started at padding 0; sections have the right left/right padding
      (20px desktop/tablet, 10px mobile)
- [ ] Spacing, sizes and fonts match the design
- [ ] Only global colours and fonts used; existing globals unchanged
- [ ] No HTML widgets; any custom widgets listed with where their code is
- [ ] Every animation from the design is animated
- [ ] Tablet and mobile checked
- [ ] Saved as draft on staging, not published
