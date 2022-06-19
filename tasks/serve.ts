/** EXTERNALS **/

import {
  Application,
  Middleware,
  Router,
} from "https://deno.land/x/oak@v10.2.0/mod.ts";
import { getText, out } from "https://deno.land/x/jog@v0.0.8/mod.ts";

/** HELPERS **/

const HTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Chess</title>
    <script type="module" src="index.js"></script>
  </head>
  <body></body>
</html>
`.trim();

function logRequest(): Middleware {
  return async (ctx, next) => {
    console.log(`[serve] ${ctx.request.method} ${ctx.request.url}`);
    await next();
    console.log(`[serve] ${ctx.response.status} ${ctx.request.url}`);
  };
}

/** MAIN **/

if (import.meta.main) {
  const router = new Router()
    .get("/", (ctx) => {
      ctx.response.headers.set("Content-Type", "text/html");
      ctx.response.body = HTML;
    })
    .get("/index.js", async (ctx) => {
      ctx.response.headers.set("Content-Type", "application/javascript");
      ctx.response.headers.set("Access-Control-Allow-Origin", "*");
      ctx.response.headers.set("Access-Control-Allow-Headers", "*");
      ctx.response.body = await out({
        cmd: ["deno", "bundle", "--no-check", "index.ts"],
        map: getText,
      });
    });

  const app = new Application();

  app.use(
    logRequest(),
    router.allowedMethods(),
    router.routes(),
  );

  app.addEventListener("listen", ({ hostname, secure, port }) => {
    const url = `${secure ? "https" : "http"}://${hostname}:${port}`;
    console.log(
      `[serve] started: ${url}`,
    );
  });

  app.listen({
    port: 8080,
    hostname: "localhost",
  });
}
