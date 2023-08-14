import {ResolveFn} from 'vite';
import getExportedModules from './getExportedModules';

type Workspace = {
  name: string,
  directory: string,
}
type Modules = { [module: string]: string };

const getWorkspaceModules = async (workspace: Workspace, resolver: ResolveFn): Promise<Modules> => {
  const path = await resolver(workspace.name);
  /* istanbul ignore next */
  if (path === undefined) {
    throw Error(`Path ${path} cannot be resolved`);
  }

  const modules = await getExportedModules(path, resolver);

  Object.keys(modules).forEach(key => {
    const regexnodemodule = new RegExp(`.*\/node_modules\/${workspace.name}\\/(.*)\\.(tsx|ts|jsx|js)`);
    const regexdirectory = new RegExp(`${workspace.directory}\\/(.*)\\.(tsx|ts|jsx|js)`);
    /* istanbul ignore next */
    const [, path] = (modules[key].match(regexnodemodule) ?? modules[key].match(regexdirectory));
    modules[key] = `${workspace.name}/${path}`;
  });

  return modules;
};

export default getWorkspaceModules;
