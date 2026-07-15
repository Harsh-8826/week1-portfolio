# Harsh Pratap Singh — Portfolio

A dark-theme, glassmorphism portfolio built with plain HTML5, CSS3, and vanilla JavaScript
(no frameworks, no Bootstrap).

## Folder structure

```
portfolio/
├── index.html
├── css/
│   ├── style.css        → design tokens, layout, components
│   ├── animations.css   → keyframes + scroll-reveal utility classes
│   └── responsive.css   → breakpoints (laptop / tablet / mobile) + nav
├── js/
│   ├── particles.js     → hero canvas particle network
│   ├── navigation.js    → header, mobile menu, scroll progress, theme toggle
│   ├── animations.js    → reveals, counters, skill bars/rings, typing effect,
│   │                      project filtering, testimonial slider, FAQ, cursor
│   └── app.js           → loading screen + contact form validation
├── images/
│   └── icons/           → add project screenshots here (project1.jpg, etc.)
└── assets/
    ├── resume.pdf        → add your real resume here
    └── favicon.ico       → add a real favicon here
```

## Things to personalize before publishing

1. **Profile photo** — already added at `images/profile.jpg` (cropped to a square and
   lightly enhanced for contrast/sharpness). Swap the file for a different photo any time —
   the `<img class="profile-img">` tag and CSS are already wired up.
2. **Project images** — each `.project-media` block has an SVG icon placeholder with a
   comment showing which `images/projectN.jpg` to drop in; swap the SVG for an `<img>` tag.
3. **Contact details** — update the email, phone number, GitHub and LinkedIn links
   (currently placeholders as provided in the brief).
4. **Resume** — a starter `assets/resume.pdf` is included, generated from the details you
   gave me (profile, skills, experience, all 10 projects, education, achievements) so the
   "Download Resume" button works out of the box. Swap it for your real resume whenever
   you have one ready — same filename, same location.
5. **Favicon** — add `assets/favicon.ico`.
6. **Contact form backend** — the form validates client-side but does not send anywhere.
   Wire the `fetch()` call in `js/app.js`'s submit handler to your email service, form
   endpoint (e.g. Formspree), or serverless function.
7. **Google Maps** — the contact section has a placeholder map panel; swap it for a real
   embedded `<iframe>` from Google Maps if you want an interactive map.
8. **GitHub / Live Demo links** — each project card's links currently point to `#`; update
   them to your real repositories and deployed demos.

## Running locally

Because the fonts load from Google Fonts, serve the folder over HTTP rather than opening
`index.html` directly from disk:

```
cd portfolio
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
