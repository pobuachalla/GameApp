# Vendored third-party code

Not part of the app bundle (see `build.cjs`'s `FILES` list) — loaded as its
own `<script>` tag in `index.html` so it's cached offline via `sw.js`
without being concatenated into `js/bundle.js`.

- **html2canvas.min.js** — v1.4.1, MIT License, <https://html2canvas.hertzen.com>.
  Renders the match report to a canvas for the PDF export below, since
  `window.print()` doesn't work in an iOS home-screen app. Update by running
  `npm pack html2canvas@<version>` and copying `dist/html2canvas.min.js` here.
- **jspdf.umd.min.js** — v2.5.2, MIT License, <https://github.com/parallax/jsPDF>.
  Wraps the html2canvas render into a paginated PDF for sharing. Exposes
  `window.jspdf.jsPDF`. Update by running `npm pack jspdf@<version>` and
  copying `dist/jspdf.umd.min.js` here (not `jspdf.umd.js`, which is
  unminified, or the polyfills bundle, which isn't needed for our supported
  browsers).
