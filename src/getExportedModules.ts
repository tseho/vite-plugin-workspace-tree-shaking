import {readFileSync} from 'fs';
import {dirname, resolve} from 'path';
import {parse as parseEs} from 'es-module-lexer';
import {init, parse as parseJs} from 'cjs-module-lexer';
import {ResolveFn} from 'vite';
import {transpile} from 'typescript';
import * as acorn from 'acorn';
import jsx from 'acorn-jsx';

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

const readSourceFile = async (path: string, resolver: ResolveFn): Promise<SourceFile> => {
  let content = readFileSync(path, 'utf-8');
  let reexports: ReExport[] = [];
  let namedimports: NamedImport[] = [];

  if (path.endsWith('tsx')) {
    const compilerOptions = {jsx: 2, module: 1};
    const transpiled = transpile(content, compilerOptions);
    const {exports} = parseJs(transpiled);
    return [
      content,
      [], // todo
      exports.filter(e => e !== '__esModule'),
    ];
  }

  if (path.endsWith('jsx')) {
    const ast = parseJsx(content, {
      ecmaVersion: '2020',
      sourceType: 'module',
    });
    const exports = ast.body.filter(n => n.type === 'ExportNamedDeclaration').map(n => n.specifiers.map(s => s.exported.name)).flat();

    return [
      content,
      [], // todo
      exports,
    ];
  }

  const [_imports, exports] = await parseEs(content);
  await Promise.all(_imports.map(async (i) => {
    const subindex = resolve(dirname(path) + '/' + i.n);
    const subpath = await resolver(subindex);
    /* istanbul ignore next */
    if (subpath === undefined) {
      return;
    }
    /* istanbul ignore next */
    const [, keyword, _type, submodules] = (content.slice(i.ss, i.se).match(/(export|import) *(type)* (.*) from/)) ?? [];
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
        })
      }
    });
  });

  return [content, reexports, []];
};

const getExportedModules = async (path: string, resolver: ResolveFn): Promise<Modules> => {
  await init();
  let modules: Modules = {};
  const [_raw, reexports, exports] = await readSourceFile(path, resolver);

  for (let e of exports) {
    modules[e] = path;
  }

  for (let line of reexports) {
    modules = {
      ...modules,
      ...await getExportedModules(line.path, resolver),
    };
  }

  return modules;
};

export default getExportedModules;
