// ESLint flat config. Replaces .eslintrc.json: ESLint 9 dropped the eslintrc
// format by default, and Next.js 16 removed the `next lint` command that used
// to bridge the two — so `pnpm lint` now runs the `eslint` CLI directly.
//
// `eslint-config-next` 16 exports ready-made flat-config arrays, so the shared
// Next rules (including core-web-vitals) spread in without @eslint/eslintrc's
// FlatCompat shim.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "coverage/**",
      "next-env.d.ts",
      "plugin/**",
    ],
  },
  ...nextCoreWebVitals,
];

export default config;
