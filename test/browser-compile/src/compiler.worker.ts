import type StencilCompiler from 'stencil-hotfix/compiler';

(self as any).importScripts('/stencil-hotfix/compiler/stencil.js');

const stencil: typeof StencilCompiler = (self as any).stencil;

export const transpileWorker = (code: string, opts: StencilCompiler.TranspileOptions) => {
  return stencil.transpile(code, opts);
};
