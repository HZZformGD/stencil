import type * as d from '../../../declarations';
import { isCommonDirModuleFile, isTsFile, isTsxFile } from '../resolve/resolve-utils';
import { isFunction, normalizePath } from '@utils';

export const httpFetch = (sys: d.CompilerSystem, input: RequestInfo, init?: RequestInit): Promise<Response> => {
  console.trace(input);
  if (sys && isFunction(sys.fetch)) {
    return sys.fetch(input, init);
  }
  return fetch(input, init);
};

export const packageVersions = new Map<string, string>();
export const known404Urls = new Set<string>();

export const getStencilRootUrl = (compilerExe: string) => new URL('../', compilerExe).href;

export const getStencilModuleUrl = (compilerExe: string, p: string) => {
  p = normalizePath(p);
  let parts = p.split('/');
  const nmIndex = parts.lastIndexOf('node_modules');
  if (nmIndex > -1 && nmIndex < parts.length - 1) {
    parts = parts.slice(nmIndex + 1);
    if (parts[0].startsWith('@')) {
      parts = parts.slice(2);
    } else {
      parts = parts.slice(1);
    }
    p = parts.join('/');
  }
  return new URL('./' + p, getStencilRootUrl(compilerExe)).href;
};

export const getStencilInternalDtsUrl = (compilerExe: string) =>
  getStencilModuleUrl(compilerExe, 'internal/index.d.ts');

export const getCommonDirUrl = (
  sys: d.CompilerSystem,
  pkgVersions: Map<string, string>,
  dirPath: string,
  fileName: string
) => getNodeModuleFetchUrl(sys, pkgVersions, dirPath) + '/' + fileName;

export const getNodeModuleFetchUrl = (sys: d.CompilerSystem, pkgVersions: Map<string, string>, filePath: string) => {
  // /node_modules/lodash/package.json
  filePath = normalizePath(filePath);

  // ["node_modules", "lodash", "package.json"]
  let pathParts = filePath.split('/').filter((p) => p.length);

  const nmIndex = pathParts.lastIndexOf('node_modules');
  if (nmIndex > -1 && nmIndex < pathParts.length - 1) {
    pathParts = pathParts.slice(nmIndex + 1);
  }

  let moduleId = pathParts.shift();

  if (moduleId.startsWith('@')) {
    moduleId += '/' + pathParts.shift();
  }

  const path = pathParts.join('/');
  if (moduleId === 'stencil-hotfix') {
    const compilerExe = sys.getCompilerExecutingPath();
    return getStencilModuleUrl(compilerExe, path);
  }

  return sys.getRemoteModuleUrl({
    moduleId,
    version: pkgVersions.get(moduleId),
    path,
  });
};

export const skipFilePathFetch = (filePath: string) => {
  if (isTsFile(filePath) || isTsxFile(filePath)) {
    // don't bother trying to resolve  node_module packages w/ typescript files
    // they should already be .js files
    return true;
  }

  const pathParts = filePath.split('/');
  const secondToLast = pathParts[pathParts.length - 2];
  const lastPart = pathParts[pathParts.length - 1];
  if (secondToLast === 'node_modules' && isCommonDirModuleFile(lastPart)) {
    // /node_modules/index.js
    // /node_modules/lodash.js
    // we just already know this is bogus, so don't bother
    return true;
  }

  return false;
};

export const skipUrlFetch = (url: string) =>
  // files we just already know not to try to resolve request
  knownUrlSkips.some((knownSkip) => url.endsWith(knownSkip));

const knownUrlSkips = [
  '/stencil-hotfix/internal.js',
  '/stencil-hotfix/internal.json',
  '/stencil-hotfix/internal.mjs',
  '/stencil-hotfix/internal/stencil-core.js/index.json',
  '/stencil-hotfix/internal/stencil-core.js.json',
  '/stencil-hotfix/internal/stencil-core.js/package.json',
  '/stencil-hotfix.js',
  '/stencil-hotfix.json',
  '/stencil-hotfix.mjs',
  '/stencil-hotfix.css',
  '/stencil-hotfix/index.js',
  '/stencil-hotfix/index.json',
  '/stencil-hotfix/index.mjs',
  '/stencil-hotfix/index.css',
  '/@stencil/package.json',
];
