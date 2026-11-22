# Maruf.dev — Modern Creative Portfolio Website

A state-of-the-art, high-performance personal portfolio website built with semantic **HTML5**, modern **CSS3**, and pure **Vanilla JavaScript**. Designed with an Awwwards-inspired aesthetic featuring glassmorphism, fluid responsive layouts, interactive particle canvas, developer CLI terminal, and dual light/dark themes.

---

## 🌟 Key Features

1. **Modern Visual Aesthetics**:
   - **Glassmorphism & Depth**: Multi-layered backdrop filters, glowing gradients, and subtle borders.
   - **Dark & Light Mode**: Seamless theme toggling with `localStorage` persistence and automatic system preference detection.
   - **Interactive Ambient Canvas**: Gentle particle constellation mesh responding dynamically to mouse movements and resizing.
   - **Custom Magnetic Cursor**: Dual dot and trailing outline with smooth physics on hoverable targets (auto-disabled on mobile/touch screens).
   - **Fluid Typography**: Responsive scale using Google Fonts (*Plus Jakarta Sans*, *Space Grotesk*, and *JetBrains Mono*).

2. **Engaging Hero Section**:
   - Live availability badge with animated ping indicator (`Available for select projects & roles`).
   - Dynamic typing animation cycling through 5 core competencies.
   - Animated numerical counters (+5 Years Exp, 45+ Projects, 99% Satisfaction) driven by IntersectionObserver.
   - Stylized avatar showcase card with floating micro-badges (`React`, `100/100 Lighthouse`, `Clean Code`).

3. **Skills & Tech Ecosystem**:
   - Interactive category filtering: *Frontend & UI*, *Backend & DB*, *DevOps & Cloud*, *Design & Tools*.
   - Animated progress bars and skill badges with brand icons.

4. **Curated Projects Showcase**:
   - Dynamic filtering by project category (*Full-Stack*, *Frontend & UI*, *AI & Systems*).
   - 6 rich project case studies featuring hover overlay links, tech tags, and real-world impact metrics.
   - **Interactive Modal Popup Dialog**: Detailed view containing project highlights, architecture overview, and external links (supports `ESC` key, backdrop click, and close button).

5. **Career & Education Timeline**:
   - Glowing vertical milestone roadmap showcasing professional trajectory and academic credentials.

6. **Interactive Developer CLI Terminal**:
   - In-browser interactive console supporting commands: `help`, `about`, `skills`, `projects`, `experience`, `hire`, `sudo hire`, `clear`, `date`, `whoami`.
   - Quick one-click command buttons for visitors on mobile or recruiters in a rush.

7. **Client Testimonials**:
   - Card grid with star ratings, quotes, author credentials, and avatars.

8. **Contact & Connect**:
   - 1-Click Copy-to-Clipboard for email address with toast feedback.
   - Live local time clock displaying the viewer's current time and timezone.
   - Validated contact form with interactive loading spinner and success notification.
   - Direct links to GitHub, LinkedIn, X, CodePen, and Dribbble.

---

## 📁 File Structure

```
New Project/
├── index.html        # Semantic HTML5 markup, accessibility attributes & metadata
├── style.css         # Modern CSS custom properties, grid/flexbox, animations & responsive media queries
├── script.js         # Modular Vanilla JS for canvas, typing, filters, modals, terminal & forms
└── README.md         # Documentation & guide
```

---

## 🚀 How to Run & Preview

You can open the website in any modern web browser:

### Option 1: Direct File Open
Double click on `index.html` or open it directly in Google Chrome, Safari, Firefox, or Edge.

### Option 2: Local HTTP Server (Python)
Run the following command in your terminal:
```bash
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

### Option 3: VS Code Live Server
If you use VS Code, install the **Live Server** extension, right-click `index.html`, and select **"Open with Live Server"**.

---

## 🎨 Customization Guide

- **Personal Information**: Open `index.html` and search for "Maruf" to swap in your own name, bio, email, or social profile URLs.
- **Projects**: Edit the `projectsDatabase` object in `script.js` to customize screenshots, project titles, tech tags, and descriptions.
- **Color Theme**: Update the CSS custom properties in `style.css` under `:root` to personalize your primary accent colors (default: Indigo `#6366f1` and Cyan `#06b6d4`).
