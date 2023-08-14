import getExportedModules from '../src/getExportedModules';
import resolver from './resolver';

const cwd = process.cwd();

describe('Exported modules with ts files', () => {
  test('it returns the list of modules re-exported by a ts file', async () => {
    const root = `${cwd}/tests/colors-ts`;

    expect(await getExportedModules(
      `${root}/src/components/blue/index.ts`,
      resolver,
    ))
      .toEqual(expect.objectContaining({
        'Aero': `${root}/src/components/blue/Aero.tsx`,
        'AirForceBlue': `${root}/src/components/blue/AirForceBlue.tsx`,
        'AirSuperiorityBlue': `${root}/src/components/blue/AirSuperiorityBlue.tsx`,
      }));
  });

  test('it returns the list of modules imported/exported by a ts file', async () => {
    const root = `${cwd}/tests/colors-ts`;

    expect(await getExportedModules(
      `${root}/src/components/pink/index.ts`,
      resolver,
    ))
      .toEqual(expect.objectContaining({
        'Blush': `${root}/src/components/pink/Blush.tsx`,
      }));
  });
});

describe('Exported modules with js files', () => {
  test('it returns the list of modules re-exported by a js file', async () => {
    const root = `${cwd}/tests/colors-js`;

    expect(await getExportedModules(
      `${root}/src/components/blue/index.js`,
      resolver,
    ))
      .toEqual(expect.objectContaining({
        'Aero': `${root}/src/components/blue/Aero.jsx`,
        'AirForceBlue': `${root}/src/components/blue/AirForceBlue.jsx`,
        'AirSuperiorityBlue': `${root}/src/components/blue/AirSuperiorityBlue.jsx`,
      }));
  });

  test('it returns the list of modules imported/exported by a js file', async () => {
    const root = `${cwd}/tests/colors-js`;

    expect(await getExportedModules(
      `${root}/src/components/pink/index.js`,
      resolver,
    ))
      .toEqual(expect.objectContaining({
        'Blush': `${root}/src/components/pink/Blush.jsx`,
      }));
  });
});
