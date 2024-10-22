// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  description: "Generated by @sveltejs/adapter-cloudflare",
  include: [
    "/*"
  ],
  exclude: [
    "/_app/*",
    "/favicon.png",
    "/global-style/color-mode.js",
    "/global-style/global.css"
  ]
};

// ../../.local/share/fnm/node-versions/v20.17.0/installation/lib/node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/home/l/Desktop/color-matcher/.wrangler/tmp/pages-EDsmOp/bundledWorker-0.48917056905589007.mjs";
import { isRoutingRuleMatch } from "/home/l/.local/share/fnm/node-versions/v20.17.0/installation/lib/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/home/l/Desktop/color-matcher/.wrangler/tmp/pages-EDsmOp/bundledWorker-0.48917056905589007.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        if (worker.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return worker.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=ki8r81m6v89.js.map
