import {PluginOption} from 'vite';
import createWorkspacesRegistry, {Registry} from './createWorkspacesRegistry';
import {parse} from 'es-module-lexer';
import MagicString from 'magic-string';

type Options = {
  cwd?: string,
};

/* istanbul ignore next */
export default (options: Options = {cwd: undefined}): Promise<PluginOption> => {
  let registry: Registry = {};

  return Promise.resolve({
    name: 'vite-plugin-workspace-tree-shaking',
    apply: 'serve',
    enforce: 'post',
    configResolved: async ({createResolver}) => {
      registry = await createWorkspacesRegistry(createResolver(), options.cwd);
    },
    transform: (code, path) => {
      const workspaces = Object.keys(registry);
      const src = new MagicString(code);

      try {
        const [imports] = parse(code);
        imports
          .filter(i => workspaces.includes(i.n))
          .forEach(iw => {
            const replacement = (code.slice(iw.ss, iw.se).match(/{([\s\S]*?)}/)[1]).split('?')
              .map(ni => ni.split(','))
              .flat()
              .map(ni => ni.trim())
              .map(ni => `import { ${ni} } from "${registry[iw.n][ni]}";`)
              .join('\n');

            src.overwrite(iw.ss, iw.se + 1, replacement);
          });
      } catch (e) {
        console.warn(e);
      }

      return src.toString();
    },
  });
};
