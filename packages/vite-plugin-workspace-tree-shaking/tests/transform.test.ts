import transform from '../src/transform';

test('it transform one import', async () => {
  const result = await transform({
    '@tests/colors-js': {
      'GoldMetallic': `@tests/colors-js/src/components/yellow/GoldMetallic`,
    },
  }, `
import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { GoldMetallic } from "@tests/colors-js";
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsxDEV(React.StrictMode, { children: [
  /* @__PURE__ */ jsxDEV(GoldMetallic, {}, void 0, false, {
    fileName: "/tmp/vite-plugin-workspace-tree-shaking/tests/react-ts-with-workspace/src/main.tsx",
    lineNumber: 6,
    columnNumber: 5
  }, this)
] }, void 0, true, {
  fileName: "/tmp/vite-plugin-workspace-tree-shaking/tests/react-ts-with-workspace/src/main.tsx",
  lineNumber: 5,
  columnNumber: 62
}, this));
  `);

  expect(result).toEqual(`
import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { GoldMetallic } from "@tests/colors-js/src/components/yellow/GoldMetallic";
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsxDEV(React.StrictMode, { children: [
  /* @__PURE__ */ jsxDEV(GoldMetallic, {}, void 0, false, {
    fileName: "/tmp/vite-plugin-workspace-tree-shaking/tests/react-ts-with-workspace/src/main.tsx",
    lineNumber: 6,
    columnNumber: 5
  }, this)
] }, void 0, true, {
  fileName: "/tmp/vite-plugin-workspace-tree-shaking/tests/react-ts-with-workspace/src/main.tsx",
  lineNumber: 5,
  columnNumber: 62
}, this));
  `);
});

test('it transform multiple imports', async () => {
  const result = await transform({
    '@tests/colors-js': {
      'GoldMetallic': `@tests/colors-js/src/components/yellow/GoldMetallic`,
      'CobaltBlue': `@tests/colors-js/src/components/blue/CobaltBlue`,
    },
  }, `
import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { GoldMetallic, CobaltBlue } from "@tests/colors-js";
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsxDEV(React.StrictMode, { children: [
  /* @__PURE__ */ jsxDEV(GoldMetallic, {}, void 0, false, {
    fileName: "/tmp/vite-plugin-workspace-tree-shaking/tests/react-ts-with-workspace/src/main.tsx",
    lineNumber: 5,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ jsxDEV(CobaltBlue, {}, void 0, false, {
    fileName: "/tmp/vite-plugin-workspace-tree-shaking/tests/react-ts-with-workspace/src/main.tsx",
    lineNumber: 6,
    columnNumber: 5
  }, this)
] }, void 0, true, {
  fileName: "/tmp/vite-plugin-workspace-tree-shaking/tests/react-ts-with-workspace/src/main.tsx",
  lineNumber: 4,
  columnNumber: 62
}, this));
  `);

  expect(result).toEqual(`
import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { GoldMetallic } from "@tests/colors-js/src/components/yellow/GoldMetallic";
import { CobaltBlue } from "@tests/colors-js/src/components/blue/CobaltBlue";
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsxDEV(React.StrictMode, { children: [
  /* @__PURE__ */ jsxDEV(GoldMetallic, {}, void 0, false, {
    fileName: "/tmp/vite-plugin-workspace-tree-shaking/tests/react-ts-with-workspace/src/main.tsx",
    lineNumber: 5,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ jsxDEV(CobaltBlue, {}, void 0, false, {
    fileName: "/tmp/vite-plugin-workspace-tree-shaking/tests/react-ts-with-workspace/src/main.tsx",
    lineNumber: 6,
    columnNumber: 5
  }, this)
] }, void 0, true, {
  fileName: "/tmp/vite-plugin-workspace-tree-shaking/tests/react-ts-with-workspace/src/main.tsx",
  lineNumber: 4,
  columnNumber: 62
}, this));
  `);
});
