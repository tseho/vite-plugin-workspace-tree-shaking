import {PluginOption} from 'vite';
import createWorkspacesRegistry from './createWorkspacesRegistry';
import transform from './transform';
import {Registry} from './models/Registry';
import {JsxParser} from './models/JsxParser';

type Options = {
  tsxParser?: JsxParser;
}

export default (options: Options = {}): Promise<PluginOption> => {
  let registry: Registry = {};

  return Promise.resolve({
    name: 'vite-plugin-workspace-tree-shaking',
    apply: 'serve',
    enforce: 'post',
    configResolved: async ({createResolver}) => {
      registry = await createWorkspacesRegistry({
        resolver: createResolver(),
        tsxParser: options.tsxParser,
      });
    },
    transform: async (code) => await transform(registry, code),
  });
};
