// The wire contract shared by @boilerplate/api (which requires the CommonJS
// `dist`) and @boilerplate/web (which compiles this TypeScript source directly).
// Keep the explicit `.js` specifiers: the package's own `node16` build requires
// them.
export * from "./api.js";
export * from "./error-codes.js";
export * from "./auth.js";
export * from "./uploads.js";
