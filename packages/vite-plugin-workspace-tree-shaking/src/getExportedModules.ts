import {readFileSync} from 'fs';
import {dirname, resolve} from 'path';
import {parse as parseEs} from 'es-module-lexer';
import * as acorn from 'acorn';
import jsx from 'acorn-jsx';
import {ParseTools} from './models/ParseTools';

const JSXParser = acorn.Parser.extend(jsx());
const parseJsx = JSXParser.parse.bind(JSXParser);

type ReExport = {
  modules: '*' | string[],
  path: string,
};
type NamedImport = {
  modules: string[],
  path: string,
};
type Export = string;
type Modules = { [module: string]: string };
type SourceFile = [string, ReExport[], Export[]];

const readSourceFile = async (path: string, tools: ParseTools): Promise<SourceFile> => {
  const content = readFileSync(path, 'utf-8');
  const reexports: ReExport[] = [];
  const namedimports: NamedImport[] = [];

  if (path.endsWith('tsx')) {
    /* istanbul ignore next */
    if (tools.tsxParser === undefined) {
      throw new Error('Your workspaces contains tsx files but tsx support is not enabled in "vite-plugin-workspace-tree-shaking".');
    }

    return tools.tsxParser(content);
  }

  if (path.endsWith('jsx')) {
    const ast = parseJsx(content, {
      ecmaVersion: '2020',
      sourceType: 'module',
    });
    const exports = ast.body.filter(n => n.type === 'ExportNamedDeclaration').map(n => n.specifiers.map(s => s.exported.name)).flat();

    return Promise.resolve([
      content,
      [], // todo
      exports,
    ]);
  }

  const [_imports, exports] = await parseEs(content);
  await Promise.all(_imports.map(async (i) => {
    const subindex = resolve(dirname(path) + '/' + i.n);
    const subpath = await tools.resolver(subindex);
    /* istanbul ignore next */
    if (subpath === undefined) {
      return;
    }
    /* istanbul ignore next */
    const [, keyword, , submodules] = (content.slice(i.ss, i.se).match(/(export|import) *(type)* (.*) from/)) ?? [];
    if (keyword === 'import') {
      /* istanbul ignore next */
      const importedmodules = submodules.match(/(\w+)/gm) ?? [];

      namedimports.push({
        modules: importedmodules,
        path: subpath,
      });

      return;
    }
    if (submodules === '*') {
      reexports.push({
        modules: '*',
        path: subpath,
      });
    }
  }));

  exports.forEach(e => {
    namedimports.forEach(i => {
      if (i.modules.includes(e.ln)) {
        reexports.push({
          modules: [e.ln],
          path: i.path,
        });
      }
    });
  });

  return Promise.resolve([content, reexports, []]);
};

const getExportedModules = async (path: string, tools: ParseTools): Promise<Modules> => {
  // await init();
  let modules: Modules = {};
  const [, reexports, exports] = await readSourceFile(path, tools);

  for (const e of exports) {
    modules[e] = path;
  }

  for (const line of reexports) {
    modules = {
      ...modules,
      ...await getExportedModules(line.path, tools),
    };
  }

  return modules;
};

export default getExportedModules;
