# Wonguk Lee — Academic website

Complete GitHub Pages package. Updated 3 November 2026.

## Upload

Extract the ZIP and upload its contents to the root of the existing repository. index.html must sit alongside style.css, site.js, assets/, and materials/. Keep the existing GitHub Pages main/root settings. No installation, build, API key, third-party fonts, or hosting service is required.

## Visual direction

White page, warm neutral surfaces, deep burgundy accents, charcoal text, and Georgia headings. The profile, research bibliography, clinical figures, patent records, and downloadable documents have distinct layouts appropriate to their content. A small monogram and a consistent title hierarchy connect the four sections.

Published and forthcoming papers, Working papers, and Work in progress are now nested tabs. Counts refer to papers, excluding books. Individual statuses remain visible as text and are not conveyed by color alone. Registered patents, applications, and the previously supplied specification are separately grouped.

Original research images, all 16 paper titles and author lists, their individual statuses, all 11 patent records, and downloadable PDF bytes are preserved. The CV retains the user's original Times New Roman format. The clinical architecture is the second image supplied by the user, not a newly invented framework.

## Design references

References informed typography, hierarchy, and composition; layouts and assets were not copied.

- Locomotive, Editorial New: the agency credits its designers and lists Awwwards Site of the Month, Site of the Day, Developer Award, and Mobile Excellence. Reference: https://locomotive.ca/en/work/editorial-new
- Cristóbal Balenciaga Museum, designed by Koalition: CSS Design Awards Website of the Day, 30 July 2021. Reference: https://cssdesignawards.com/sites/cristobal-balenciaga-museum/39305/
- Editorial New award announcement: https://www.awwwards.com/editorial-new-variable-typeface-by-locomotive-wins-site-of-the-month-october.html
- W3C WCAG 2.2 text contrast guidance: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
- W3C WCAG 2.2 target-size guidance: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum

## Interaction and accessibility

- Labeled navigation and nested tabs with selected states, arrow-key navigation, and Home/End support.
- Visible keyboard focus, a working skip link, and focus transfer after mobile navigation and deep links.
- Persistent deep links and browser Back/Forward support for paper categories and individual records.
- Main buttons use at least 44 px target heights. Text links have adequate height or spacing; in-paragraph links retain normal text flow.
- Text color pairs meet WCAG AA thresholds. A computed-style sample of 71 visible text elements passed; its lowest normal-text contrast was 5.56:1. This is not a claim of an independent WCAG certification.
- Responsive review at 320, 390, 768, and 1024 px widths, plus the desktop browser viewport. Research diagrams may scroll inside their own enlargement or figure container without forcing page-level horizontal scrolling.
- Native image dialog supports Escape and returns focus to its trigger. Motion preference is respected. There is no autoplay or scroll hijacking.
- Without JavaScript, content is available as ordinary sections. Print CSS includes every paper category.

## Maintenance

Update content in index.html, visual tokens and layouts in style.css, and navigation behavior in site.js. Keep all linked files in their original folders. The dated CV filename avoids cached old PDFs. Update the CSS and JavaScript version suffixes after future design changes.
