Not part of the app bundle (see `build.cjs`'s `FILES` list) — loaded as its
own `<script>` tag in `index.html` so it's cached offline via `sw.js`
without being concatenated into `js/bundle.js`.

- **html2pdf.bundle.min.js** — v0.14.0, MIT License,
  <https://github.com/eKoopmans/html2pdf.js>. Renders the match report to a
  paginated PDF for sharing, since `window.print()` doesn't work in an iOS
  home-screen app. This is the self-contained bundle (includes html2canvas
  and jsPDF internally) rather than hand-rolling canvas rasterization and
  page-break math ourselves — that was tried first and got the pagination
  wrong (content bleeding across page boundaries). html2pdf.js's own
  `pagebreak: {mode:'css', avoid:[...]}` option handles keeping report cards
  and table rows intact across page breaks correctly. Exposes
  `window.html2pdf`. Update by running `npm pack html2pdf.js@<version>` and
  copying `dist/html2pdf.bundle.min.js` here (not `html2pdf.js`/
  `html2pdf.min.js`, which expect html2canvas/jsPDF loaded separately).
