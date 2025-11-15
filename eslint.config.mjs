// @ts-check

import eslintPluginAstro from 'eslint-plugin-astro'

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...eslintPluginAstro.configs.recommended,
  // Ignore files
  {
    ignores: ['public/scripts/*', 'scripts/*', '.astro/', 'src/env.d.ts'],
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    }
  }
]

export default config
