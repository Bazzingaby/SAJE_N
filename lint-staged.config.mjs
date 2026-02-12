// lint-staged runs from the repo root but ESLint's config lives in apps/web/.
// Pass --config explicitly so ESLint v9 flat-config resolution works in a
// monorepo where there is no root-level eslint.config.js.
export default {
  '*.{js,jsx,ts,tsx}': (files) => [
    `eslint --config apps/web/eslint.config.mjs --fix ${files.join(' ')}`,
    `prettier --write ${files.join(' ')}`,
  ],
  '*.{json,md,yaml,yml,css}': ['prettier --write'],
};
