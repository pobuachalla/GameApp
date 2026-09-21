# Vendored third-party code

Not part of the app bundle (see `build.cjs`'s `FILES` list) — loaded as its
own `<script>` tag in `index.html` so it's cached offline via `sw.js`
without being concatenated into `js/bundle.js`.

- **html2canvas.min.js** — v1.4.1, MIT License, <https://html2canvas.hertzen.com>.
  Renders the match report to a PNG for sharing via the Web Share API,
  since `window.print()` doesn't work in an iOS home-screen app. Update by
  running `npm pack html2canvas@<version>` and copying `dist/html2canvas.min.js`
  here.
