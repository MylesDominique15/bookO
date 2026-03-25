import * as pdfjsLib from "pdfjs-dist";

// Same-origin worker from /public (created by `npm run copy-pdf-worker` / postinstall).
const prefix = (process.env.PUBLIC_URL || "").replace(/\/$/, "");
pdfjsLib.GlobalWorkerOptions.workerSrc = `${prefix}/pdf.worker.min.mjs`;
