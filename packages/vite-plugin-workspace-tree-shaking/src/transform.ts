import MagicString from 'magic-string';
import {parse} from 'es-module-lexer';
import {Registry} from './models/Registry';

const transform = async (registry: Registry, code: string) => {
  const workspaces = Object.keys(registry);
  const src = new MagicString(code);

  try {
    const [imports] = await parse(code);
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
    /* istanbul ignore next */
    console.warn(e);
  }

  return src.toString();
};

export default transform;
