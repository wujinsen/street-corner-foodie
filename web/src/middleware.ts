import { defineMiddleware } from "astro:middleware";

import { legacyLangRedirect } from "./lib/locale-path";



/** `?lang=en|ja` �?`/en/...` (v0.3 compatibility). */

export const onRequest = defineMiddleware((context, next) => {

  const target = legacyLangRedirect(context.url);

  if (target) {

    return context.redirect(target, 302);

  }

  return next();

});

