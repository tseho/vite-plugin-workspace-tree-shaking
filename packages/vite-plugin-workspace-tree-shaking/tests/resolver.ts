import {existsSync, readFileSync} from 'fs';

const cwd = process.cwd();

const resolver = (id: string) => {
  if (existsSync(`${cwd}/tests/project-with-workspaces/node_modules/${id}/package.json`)) {
    const {main} = JSON.parse(readFileSync(`${cwd}/tests/project-with-workspaces/node_modules/${id}/package.json`, 'utf-8'));
    return Promise.resolve(`${cwd}/tests/project-with-workspaces/node_modules/${id}/${main}`);
  }

  if (existsSync(`${id}/index.ts`)) {
    return Promise.resolve(`${id}/index.ts`);
  }

  if (existsSync(`${id}/index.js`)) {
    return Promise.resolve(`${id}/index.js`);
  }

  const extensions = ['tsx', 'ts', 'jsx', 'js'];

  for (const extension of extensions) {
    if (existsSync(`${id}.${extension}`)) {
      return Promise.resolve(`${id}.${extension}`);
    }
  }

  return Promise.reject(`File ${id} not found`);
};

export default resolver;
