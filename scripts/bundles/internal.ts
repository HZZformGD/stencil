import fs from 'fs-extra';
import type { BuildOptions } from '../utils/options';
import { cleanDts } from '../utils/bundle-dts';
import { internalAppData } from './internal-app-data';
import { internalClient } from './internal-platform-client';
import { internalHydrate } from './internal-platform-hydrate';
import { internalTesting } from './internal-platform-testing';
import { join } from 'path';
import { writePkgJson } from '../utils/write-pkg-json';

export async function internal(opts: BuildOptions) {
  const inputInternalDir = join(opts.buildDir, 'internal');

  await fs.emptyDir(opts.output.internalDir);

  await copyStencilInternalDts(opts, opts.output.internalDir);

  await copyStencilCoreEntry(opts);

  // copy stencil-hotfix/internal default entry, which defaults to client
  // but we're not exposing all of Stencil's internal code (only the types)
  await fs.copyFile(join(inputInternalDir, 'default.js'), join(opts.output.internalDir, 'index.js'));

  // write stencil-hotfix/internal/package.json
  writePkgJson(opts, opts.output.internalDir, {
    name: 'stencil-hotfix/internal',
    description:
      'Stencil internals only to be imported by the Stencil Compiler. Breaking changes can and will happen at any time.',
    main: 'index.js',
    types: 'index.d.ts',
    sideEffects: false,
  });

  const clientPlatformBundle = await internalClient(opts);
  const hydratePlatformBundles = await internalHydrate(opts);
  const testingPlatform = await internalTesting(opts);

  return [...clientPlatformBundle, ...hydratePlatformBundles, ...testingPlatform, await internalAppData(opts)];
}

async function copyStencilInternalDts(opts: BuildOptions, outputInternalDir: string) {
  const declarationsInputDir = join(opts.buildDir, 'declarations');

  // copy to stencil-hotfix/internal

  // stencil-hotfix/internal/index.d.ts
  const indexDtsSrcPath = join(declarationsInputDir, 'index.d.ts');
  const indexDtsDestPath = join(outputInternalDir, 'index.d.ts');
  let indexDts = cleanDts(await fs.readFile(indexDtsSrcPath, 'utf8'));
  indexDts = prependExtModules(indexDts);
  await fs.writeFile(indexDtsDestPath, indexDts);

  // stencil-hotfix/internal/stencil-private.d.ts
  const privateDtsSrcPath = join(declarationsInputDir, 'stencil-private.d.ts');
  const privateDtsDestPath = join(outputInternalDir, 'stencil-private.d.ts');
  const privateDts = cleanDts(await fs.readFile(privateDtsSrcPath, 'utf8'));
  await fs.writeFile(privateDtsDestPath, privateDts);

  // stencil-hotfix/internal/stencil-public.compiler.d.ts
  const compilerDtsSrcPath = join(declarationsInputDir, 'stencil-public-compiler.d.ts');
  const compilerDtsDestPath = join(outputInternalDir, 'stencil-public-compiler.d.ts');
  const compilerDts = cleanDts(await fs.readFile(compilerDtsSrcPath, 'utf8'));
  await fs.writeFile(compilerDtsDestPath, compilerDts);

  // stencil-hotfix/internal/stencil-public-docs.d.ts
  const docsDtsSrcPath = join(declarationsInputDir, 'stencil-public-docs.d.ts');
  const docsDtsDestPath = join(outputInternalDir, 'stencil-public-docs.d.ts');
  const docsDts = cleanDts(await fs.readFile(docsDtsSrcPath, 'utf8'));
  await fs.writeFile(docsDtsDestPath, docsDts);

  // stencil-hotfix/internal/stencil-public-runtime.d.ts
  const runtimeDtsSrcPath = join(declarationsInputDir, 'stencil-public-runtime.d.ts');
  const runtimeDtsDestPath = join(outputInternalDir, 'stencil-public-runtime.d.ts');
  const runtimeDts = cleanDts(await fs.readFile(runtimeDtsSrcPath, 'utf8'));
  await fs.writeFile(runtimeDtsDestPath, runtimeDts);

  // stencil-hotfix/internal/stencil-ext-modules.d.ts (.svg/.css)
  const srcExtModuleOutput = join(opts.srcDir, 'declarations', 'stencil-ext-modules.d.ts');
  const dstExtModuleOutput = join(outputInternalDir, 'stencil-ext-modules.d.ts');
  await fs.copyFile(srcExtModuleOutput, dstExtModuleOutput);
}

function prependExtModules(content: string) {
  return `/// <reference path="./stencil-ext-modules.d.ts" />\n` + content;
}

async function copyStencilCoreEntry(opts: BuildOptions) {
  // write stencil-hotfix entry
  const stencilCoreSrcDir = join(opts.srcDir, 'internal', 'stencil-core');
  const stencilCoreDstDir = join(opts.output.internalDir, 'stencil-core');
  await fs.ensureDir(stencilCoreDstDir);
  await fs.copy(stencilCoreSrcDir, stencilCoreDstDir);
}
