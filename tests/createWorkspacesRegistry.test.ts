import createWorkspacesRegistry from '../src/createWorkspacesRegistry';
import resolver from './resolver';

const cwd = process.cwd();

test('it returns the registry of workspaces modules', async () => {
  const root = `${cwd}/tests/colors-ts`;

  expect(await createWorkspacesRegistry(
    resolver,
    `${cwd}/tests/react-ts-with-workspace`,
  ))
    .toEqual({
      '@tests/colors-js': expect.objectContaining({
        'Aero': `@tests/colors-js/src/components/blue/Aero`,
      }),
      '@tests/colors-ts': expect.objectContaining({
        'Aero': `@tests/colors-ts/src/components/blue/Aero`,
      }),
    });
});
