import type * as d from '../../../../declarations';
import { getNodeModuleFetchUrl, getStencilModuleUrl, getStencilRootUrl, skipFilePathFetch } from '../fetch-utils';
import { createSystem } from '../../stencil-sys';

describe('fetch module', () => {
  let compilerExe: string;

  beforeEach(() => {
    compilerExe = 'http://localhost:3333/stencil-hotfix/compiler/stencil.js';
  });

  it('getStencilRootUrl', () => {
    expect(getStencilRootUrl(compilerExe)).toBe('http://localhost:3333/stencil-hotfix/');

    compilerExe = 'https://cdn.stenciljs.com/npm/stencil-hotfix@1.2.3/compiler/stencil.js';
    expect(getStencilRootUrl(compilerExe)).toBe('https://cdn.stenciljs.com/npm/stencil-hotfix@1.2.3/');
  });

  describe('getStencilModulePath', () => {
    it('cdn w/ version w/out node_module prefix', () => {
      compilerExe = 'https://cdn.stenciljs.com/npm/stencil-hotfix@1.2.3/compiler/stencil.js';
      const p = 'internal/client/index.mjs';
      const m = getStencilModuleUrl(compilerExe, p);
      expect(m).toBe('https://cdn.stenciljs.com/npm/stencil-hotfix@1.2.3/internal/client/index.mjs');
    });

    it('cdn w/ version', () => {
      compilerExe = 'https://cdn.jsdelivr.net/npm/stencil-hotfix@1.2.3/compiler/stencil.js';
      const p = '/some/path/node_modules/stencil-hotfix/package.json';
      const m = getStencilModuleUrl(compilerExe, p);
      expect(m).toBe('https://cdn.jsdelivr.net/npm/stencil-hotfix@1.2.3/package.json');
    });

    it('cdn w/out version', () => {
      compilerExe = 'https://cdn.jsdelivr.net/npm/stencil-hotfix/compiler/stencil.js';
      const p = '/node_modules/stencil-hotfix/internal/client/index.mjs';
      const m = getStencilModuleUrl(compilerExe, p);
      expect(m).toBe('https://cdn.jsdelivr.net/npm/stencil-hotfix/internal/client/index.mjs');
    });

    it('local w/out version w/out node_module prefix', () => {
      const p = 'package.json';
      const m = getStencilModuleUrl(compilerExe, p);
      expect(m).toBe('http://localhost:3333/stencil-hotfix/package.json');
    });

    it('local w/out version', () => {
      const p = '/node_modules/stencil-hotfix/package.json';
      const m = getStencilModuleUrl(compilerExe, p);
      expect(m).toBe('http://localhost:3333/stencil-hotfix/package.json');
    });
  });
});

describe('getNodeModuleFetchUrl', () => {
  const pkgVersions = new Map<string, string>();
  const config: d.Config = {
    rootDir: '/my-app/',
    sys: createSystem(),
  };
  const sys = config.sys;

  beforeEach(() => {
    sys.getCompilerExecutingPath = null;
    pkgVersions.clear();
  });

  it('cdn stencil-hotfix', () => {
    const filePath = '/node_modules/stencil-hotfix/internal/hydrate/index.mjs';
    sys.getCompilerExecutingPath = () => 'http://localhost/stencil/core/compiler/stencil.js';
    const url = getNodeModuleFetchUrl(sys, pkgVersions, filePath);
    expect(url).toBe('http://localhost/stencil/core/internal/hydrate/index.mjs');
  });

  it('local stencil-hotfix', () => {
    const filePath = '/node_modules/stencil-hotfix/package.json';
    sys.getCompilerExecutingPath = () => 'http://cdn.stenciljs.com/npm/stencil-hotfix@1.2.3/compiler/stencil.js';
    const url = getNodeModuleFetchUrl(sys, pkgVersions, filePath);
    expect(url).toBe('http://cdn.stenciljs.com/npm/stencil-hotfix@1.2.3/package.json');
  });

  it('local stencil-hotfix, root dir', () => {
    const filePath = '/some/dir/node_modules/stencil-hotfix/package.json';
    sys.getCompilerExecutingPath = () => 'https://cdn.stenciljs.com/stencil-hotfix@1.2.3/compiler/stencil.js';
    const url = getNodeModuleFetchUrl(sys, pkgVersions, filePath);
    expect(url).toBe('https://cdn.stenciljs.com/stencil-hotfix@1.2.3/package.json');
  });

  it('w/ version number', () => {
    pkgVersions.set('lodash', '1.2.3');
    const filePath = '/node_modules/lodash/package.json';
    const url = getNodeModuleFetchUrl(sys, pkgVersions, filePath);
    expect(url).toBe('https://cdn.jsdelivr.net/npm/lodash@1.2.3/package.json');
  });

  it('w/ version number, root dir', () => {
    pkgVersions.set('lodash', '1.2.3');
    const filePath = '/some/dir/node_modules/lodash/package.json';
    const url = getNodeModuleFetchUrl(sys, pkgVersions, filePath);
    expect(url).toBe('https://cdn.jsdelivr.net/npm/lodash@1.2.3/package.json');
  });

  it('w/out version number', () => {
    const filePath = '/node_modules/lodash/package.json';
    const url = getNodeModuleFetchUrl(sys, pkgVersions, filePath);
    expect(url).toBe('https://cdn.jsdelivr.net/npm/lodash/package.json');
  });

  it('w/out version number, root dir', () => {
    const filePath = 'some/path/node_modules/lodash/package.json';
    const url = getNodeModuleFetchUrl(sys, pkgVersions, filePath);
    expect(url).toBe('https://cdn.jsdelivr.net/npm/lodash/package.json');
  });

  it('w/ scoped package', () => {
    const filePath = '/node_modules/@ionic/core/package.json';
    const url = getNodeModuleFetchUrl(sys, pkgVersions, filePath);
    expect(url).toBe('https://cdn.jsdelivr.net/npm/@ionic/core/package.json');
  });

  it('w/ scoped package, rootdir', () => {
    const filePath = '/some/dir/node_modules/@ionic/core/package.json';
    const url = getNodeModuleFetchUrl(sys, pkgVersions, filePath);
    expect(url).toBe('https://cdn.jsdelivr.net/npm/@ionic/core/package.json');
  });

  it('version w/ scoped package', () => {
    pkgVersions.set('@ionic/core', '1.2.3');
    const filePath = '/node_modules/@ionic/core/package.json';
    const url = getNodeModuleFetchUrl(sys, pkgVersions, filePath);
    expect(url).toBe('https://cdn.jsdelivr.net/npm/@ionic/core@1.2.3/package.json');
  });

  it('version w/ scoped package, rootdir', () => {
    pkgVersions.set('@ionic/core', '1.2.3');
    const filePath = '/some/path/node_modules/@ionic/core/package.json';
    const url = getNodeModuleFetchUrl(sys, pkgVersions, filePath);
    expect(url).toBe('https://cdn.jsdelivr.net/npm/@ionic/core@1.2.3/package.json');
  });
});

describe('skipFilePathFetch', () => {
  it('skip for known bogus node_module paths', () => {
    expect(skipFilePathFetch('/node_modules/index.mjs')).toBe(true);
    expect(skipFilePathFetch('/node_modules/lodash.js')).toBe(true);
    expect(skipFilePathFetch('/node_modules/lodash.md')).toBe(true);
    expect(skipFilePathFetch('/node_modules/lodash.json')).toBe(true);
    expect(skipFilePathFetch('/asdf/gadsf/aessd/gaes/node_modules/lodash.js')).toBe(true);
    expect(skipFilePathFetch('/asdf/node_modules/whatever/lodash.js')).toBe(false);
  });

  it('skip for ts and tsx', () => {
    expect(skipFilePathFetch('whatever.ts')).toBe(true);
    expect(skipFilePathFetch('whatever.tsx')).toBe(true);
  });
});
