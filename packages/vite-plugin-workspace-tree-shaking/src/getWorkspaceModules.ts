import getExportedModules from './getExportedModules';
import {ParseTools} from './models/ParseTools';

type Workspace = {
  name: string,
  directory: string,
}
type Modules = { [module: string]: string };

const getWorkspaceModules = async (workspace: Workspace, tools: ParseTools,): Promise<Modules> => {
  const path = await tools.resolver(workspace.name);
  /* istanbul ignore next */
  if (path === undefined) {
    throw Error(`Path ${path} cannot be resolved`);
  }

  const modules = await getExportedModules(path, tools);

  Object.keys(modules).forEach(key => {
    const regexnodemodule = new RegExp(`.*\\/node_modules\\/${workspace.name}\\/(.*)\\.(tsx|ts|jsx|js)`);
    const regexdirectory = new RegExp(`${workspace.directory}\\/(.*)\\.(tsx|ts|jsx|js)`);
    /* istanbul ignore next */
    const [, path] = (modules[key].match(regexnodemodule) ?? modules[key].match(regexdirectory));
    modules[key] = `${workspace.name}/${path}`;
  });

  return modules;
};

export default getWorkspaceModules;
