/** Promote lazy-loaded gallery thumbnails after region/page filters reveal cards. */
export function kickLazyImagesIn(root: ParentNode): void {
  root
    .querySelectorAll<HTMLImageElement>(
      ".glass-zine-card:not(.is-gallery-region-hidden):not(.is-gallery-page-hidden) img[loading='lazy'], " +
        ".glass-poster:not(.is-gallery-region-hidden):not(.is-gallery-page-hidden) img[loading='lazy']",
    )
    .forEach((img) => {
      if (img.complete) return;
      img.loading = "eager";
    });
}
