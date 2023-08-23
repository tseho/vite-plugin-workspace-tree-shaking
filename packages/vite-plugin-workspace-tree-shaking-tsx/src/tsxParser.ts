import {transpile} from 'typescript';
import {init, parse as parseJs} from 'cjs-module-lexer';

type ReExport = {
  modules: '*' | string[],
  path: string,
};
type Export = string;
type SourceFile = [string, ReExport[], Export[]];

const tsxParser = async (content: string): Promise<SourceFile> => {
  await init();
  const compilerOptions = {jsx: 2, module: 1};
  const transpiled = transpile(content, compilerOptions);
  const {exports} = parseJs(transpiled);

  return Promise.resolve([
    content,
    [], // todo
    exports.filter(e => e !== '__esModule'),
  ]);
};

export default tsxParser;
