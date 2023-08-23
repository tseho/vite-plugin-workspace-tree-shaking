# vite-plugin-workspace-tree-shaking

This plugin adds tree shaking to files exported by yarn workspaces in development mode.

---

In development mode, vite does not use an efficient tree shaking, especially when using re-exports like `export * from './Something';`.
It can result in hundreds of files, or even more, being slowly loaded if those re-exports are intensively used in mono-repositories with yarn workspaces.

This plugin dynamically transform the code to optimize imports when serving files:
```diff
- import {Button} from '@acme/ui';
+ import {Button} from '@acme/ui/components/Button';
```

## Install

```shell
# Using npm
npm install --save-dev vite-plugin-workspace-tree-shaking
# Using yarn 
yarn add --dev vite-plugin-workspace-tree-shaking
```

## Usage

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import WorkspaceTreeShaking from 'vite-plugin-workspace-tree-shaking';

export default defineConfig({
  plugins: [WorkspaceTreeShaking()],
})
```

### ⚠️ TSX files

TSX files are not supported by default. It can be optionnally enabled with an extension.

```shell
# Using npm
npm install --save-dev vite-plugin-workspace-tree-shaking-tsx
# Using yarn 
yarn add --dev vite-plugin-workspace-tree-shaking-tsx
```
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import WorkspaceTreeShaking from 'vite-plugin-workspace-tree-shaking';
import {jsxParser} from 'vite-plugin-workspace-tree-shaking-tsx'

export default defineConfig({
  plugins: [
    WorkspaceTreeShaking({
      jsxParser: jsxParser,
    }),
  ],
})
```

## Example

An example based on the `react-ts` vite template can be found [here](examples/react-ts-with-workspace).
