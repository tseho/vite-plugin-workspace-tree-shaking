type ReExport = {
  modules: '*' | string[],
  path: string,
};
type Export = string;
export type SourceFileInfo = [string, ReExport[], Export[]];
