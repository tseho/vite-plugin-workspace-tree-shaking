import {readFileSync} from 'fs';
import {resolve} from 'path';
import {ResolveFn} from 'vite';
import getWorkspaceModules from './getWorkspaceModules';

type Modules = { [module: string]: string };
export type Registry = { [workspace: string]: Modules };

export default async (
  resolver: ResolveFn,
  /* istanbul ignore next */ cwd: string = ''
): Promise<{ [workspace: string]: Modules }> => {
  const {workspaces} = JSON.parse(readFileSync(resolve(cwd, 'package.json'), 'utf-8'));
  /* istanbul ignore next */
  if (workspaces === undefined) {
    return {};
  }

  const result: Registry = {};

  await Promise.all(workspaces.map(async (workspace: string) => {
    const {name} = JSON.parse(readFileSync(resolve(cwd, workspace + '/package.json'), 'utf-8'));
    const directory = resolve(cwd, workspace);
    result[name] = await getWorkspaceModules({name, directory}, resolver);
  }));

  return result;
};
