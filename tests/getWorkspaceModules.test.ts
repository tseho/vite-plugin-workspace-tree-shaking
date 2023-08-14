import getWorkspaceModules from '../src/getWorkspaceModules';
import resolver from './resolver';

test('it returns the list of modules exported by a workspace', async () => {
  const directory = `${process.cwd()}/tests/colors-js`;
  const workspace = '@tests/colors-js';

  expect(await getWorkspaceModules(
    {name: workspace, directory},
    resolver,
  ))
    .toEqual(expect.objectContaining({
      'Aero': `${workspace}/src/components/blue/Aero`,
      'AirForceBlue': `${workspace}/src/components/blue/AirForceBlue`,
      'AirSuperiorityBlue': `${workspace}/src/components/blue/AirSuperiorityBlue`,
    }));
});
