import getExportedModules from '../src/getExportedModules';
import resolver from './resolver';
import {resolve} from 'path';
import {tsxParser} from 'vite-plugin-workspace-tree-shaking-tsx';

const cwd = process.cwd();

describe('Exported modules with js files', () => {
  test('it returns the list of modules re-exported by a js file', async () => {
    const root = resolve(`${cwd}/../colors-js`);

    expect(await getExportedModules(
      `${root}/src/components/blue/index.js`,
      {resolver},
    ))
      .toEqual(expect.objectContaining({
        'Aero': `${root}/src/components/blue/Aero.jsx`,
        'AirForceBlue': `${root}/src/components/blue/AirForceBlue.jsx`,
        'AirSuperiorityBlue': `${root}/src/components/blue/AirSuperiorityBlue.jsx`,
      }));
  });

  test('it returns the list of modules imported/exported by a js file', async () => {
    const root = resolve(`${cwd}/../colors-js`);

    expect(await getExportedModules(
      `${root}/src/components/pink/index.js`,
      {resolver},
    ))
      .toEqual(expect.objectContaining({
        'Blush': `${root}/src/components/pink/Blush.jsx`,
      }));
  });
});

describe('Exported modules with tsx files', () => {
  test('it returns the list of modules re-exported by a tsx file', async () => {
    const root = resolve(`${cwd}/../colors-ts`);

    expect(await getExportedModules(
      `${root}/src/components/blue/index.ts`,
      {resolver, tsxParser},
    ))
      .toEqual(expect.objectContaining({
        'Aero': `${root}/src/components/blue/Aero.tsx`,
        'AirForceBlue': `${root}/src/components/blue/AirForceBlue.tsx`,
        'AirSuperiorityBlue': `${root}/src/components/blue/AirSuperiorityBlue.tsx`,
      }));
  });

  test('it returns the list of modules imported/exported by a tsx file', async () => {
    const root = resolve(`${cwd}/../colors-ts`);

    expect(await getExportedModules(
      `${root}/src/components/pink/index.ts`,
      {resolver, tsxParser},
    ))
      .toEqual(expect.objectContaining({
        'Blush': `${root}/src/components/pink/Blush.tsx`,
      }));
  });
});
