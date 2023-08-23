import {readFileSync} from 'fs';
import {resolve} from 'path';
import getWorkspaceModules from './getWorkspaceModules';
import {Registry} from './models/Registry';
import {ParseTools} from './models/ParseTools';

export default async (
  tools: ParseTools,
  /* istanbul ignore next */ cwd: string = ''
): Promise<Registry> => {
  const {workspaces} = JSON.parse(readFileSync(resolve(cwd, 'package.json'), 'utf-8'));
  /* istanbul ignore next */
  if (workspaces === undefined) {
    return {};
  }

  const result: Registry = {};

  await Promise.all(workspaces.map(async (workspace: string) => {
    const {name} = JSON.parse(readFileSync(resolve(cwd, workspace + '/package.json'), 'utf-8'));
    const directory = resolve(cwd, workspace);
    result[name] = await getWorkspaceModules({name, directory}, tools);
  }));

  return result;
};
