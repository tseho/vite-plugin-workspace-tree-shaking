import createWorkspacesRegistry from '../src/createWorkspacesRegistry';
import resolver from './resolver';
import {resolve} from 'path';

const cwd = process.cwd();

test('it returns the registry of workspaces modules', async () => {
  expect(await createWorkspacesRegistry(
    {resolver},
    resolve(`${cwd}/tests/project-with-workspaces`),
  ))
    .toEqual({
      '@tests/colors-js': expect.objectContaining({
        'Aero': `@tests/colors-js/src/components/blue/Aero`,
      }),
      // '@tests/colors-ts': expect.objectContaining({
      //   'Aero': `@tests/colors-ts/src/components/blue/Aero`,
      // }),
    });
});
