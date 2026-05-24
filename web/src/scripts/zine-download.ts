/** v0.6.7 · download current zine spread image. */

export function initZineDownload(root: HTMLElement): void {
  const btn = root.querySelector<HTMLButtonElement>("[data-zine-download]");
  if (!btn) return;
  const url = btn.dataset.downloadUrl;
  if (!url) return;
  const filename = btn.dataset.downloadName ?? "mini-zine-page.png";
  btn.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
}
