import type * as d from '../../../declarations';
import { writeLazyModule } from './write-lazy-entry-module';
import {
  formatComponentRuntimeMeta,
  stringifyRuntimeData,
  hasDependency,
  rollupToStencilSourceMap,
  getSourceMappingUrlForEndOfFile,
} from '@utils';
import { optimizeModule } from '../../optimize/optimize-module';
import { join } from 'path';
import type { SourceMap as RollupSourceMap } from 'rollup';

export const generateLazyModules = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTargetType: string,
  destinations: string[],
  results: d.RollupResult[],
  sourceTarget: d.SourceTarget,
  isBrowserBuild: boolean,
  sufix: string
): Promise<d.BundleModule[]> => {
  if (!Array.isArray(destinations) || destinations.length === 0) {
    return [];
  }
  const shouldMinify = config.minifyJs && isBrowserBuild;
  const rollupResults = results.filter((r) => r.type === 'chunk') as d.RollupChunkResult[];
  const entryComponentsResults = rollupResults.filter((rollupResult) => rollupResult.isComponent);
  const chunkResults = rollupResults.filter((rollupResult) => !rollupResult.isComponent && !rollupResult.isEntry);

  const [bundleModules] = await Promise.all([
    Promise.all(
      entryComponentsResults.map((rollupResult) => {
        return generateLazyEntryModule(
          config,
          compilerCtx,
          buildCtx,
          rollupResult,
          outputTargetType,
          destinations,
          sourceTarget,
          shouldMinify,
          isBrowserBuild,
          sufix
        );
      })
    ),
  ]);
  if (!isBrowserBuild) addStaticImports(results, bundleModules);

  await Promise.all(
    chunkResults.map((rollupResult) => {
      return writeLazyChunk(
        config,
        compilerCtx,
        buildCtx,
        rollupResult,
        outputTargetType,
        destinations,
        sourceTarget,
        shouldMinify,
        isBrowserBuild
      );
    })
  );

  const lazyRuntimeData = formatLazyBundlesRuntimeMeta(bundleModules);
  const entryResults = rollupResults.filter((rollupResult) => !rollupResult.isComponent && rollupResult.isEntry);
  await Promise.all(
    entryResults.map((rollupResult) => {
      return writeLazyEntry(
        config,
        compilerCtx,
        buildCtx,
        rollupResult,
        outputTargetType,
        destinations,
        lazyRuntimeData,
        sourceTarget,
        shouldMinify,
        isBrowserBuild
      );
    })
  );

  await Promise.all(
    results
      .filter((r) => r.type === 'asset')
      .map((r: d.RollupAssetResult) => {
        return Promise.all(
          destinations.map((dest) => {
            return compilerCtx.fs.writeFile(join(dest, r.fileName), r.content);
          })
        );
      })
  );

  return bundleModules;
};

const addStaticImports = (results: d.RollupResult[], bundleModules: d.BundleModule[]) => {
  results
    .filter(
      (res: d.RollupChunkResult) =>
        res.isCore &&
        res.entryKey === 'index' &&
        (res.moduleFormat === 'es' ||
          res.moduleFormat === 'esm' ||
          res.moduleFormat === 'cjs' ||
          res.moduleFormat === 'commonjs')
    )
    .forEach((index: d.RollupChunkResult) => {
      let caseStatement = `
      case '{COMPONENT_ENTRY}':
        return import(
          /* webpackMode: "lazy" */
          './{COMPONENT_ENTRY}.entry.js').then(processMod, consoleError);
      `;
      if (index.moduleFormat === 'cjs' || index.moduleFormat === 'commonjs') {
        caseStatement = `
        case '{COMPONENT_ENTRY}':
          return Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(
            /* webpackMode: "lazy" */
            './{COMPONENT_ENTRY}.entry.js')); }).then(processMod, consoleError);
      `;
      }
      const switchStr = bundleModules.map((mod) => {
        return caseStatement.replace(/\{COMPONENT_ENTRY\}/g, mod.output.bundleId);
      });
      index.code = index.code.replace(
        '// staticImportSwitch',
        `
    if (!hmrVersionId || !BUILD.hotModuleReplacement) {
      const processMod = importedModule => {
        cmpModules.set(bundleId, importedModule);
        return importedModule[exportName];
      }
      switch(bundleId) {
        ${switchStr.join('')}
      }
    }`
      );
    });
};

const generateLazyEntryModule = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  rollupResult: d.RollupChunkResult,
  outputTargetType: string,
  destinations: string[],
  sourceTarget: d.SourceTarget,
  shouldMinify: boolean,
  isBrowserBuild: boolean,
  sufix: string
): Promise<d.BundleModule> => {
  const entryModule = buildCtx.entryModules.find((entryModule) => entryModule.entryKey === rollupResult.entryKey);
  const shouldHash = config.hashFileNames && isBrowserBuild;

  const { code, sourceMap } = await convertChunk(
    config,
    compilerCtx,
    buildCtx,
    sourceTarget,
    shouldMinify,
    false,
    isBrowserBuild,
    rollupResult.code,
    rollupResult.map
  );

  const output = await writeLazyModule(
    config,
    compilerCtx,
    outputTargetType,
    destinations,
    entryModule,
    shouldHash,
    code,
    sourceMap,
    sufix
  );

  return {
    rollupResult,
    entryKey: rollupResult.entryKey,
    cmps: entryModule.cmps,
    output,
  };
};

const writeLazyChunk = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  rollupResult: d.RollupChunkResult,
  outputTargetType: string,
  destinations: string[],
  sourceTarget: d.SourceTarget,
  shouldMinify: boolean,
  isBrowserBuild: boolean
) => {
  const { code, sourceMap } = await convertChunk(
    config,
    compilerCtx,
    buildCtx,
    sourceTarget,
    shouldMinify,
    rollupResult.isCore,
    isBrowserBuild,
    rollupResult.code,
    rollupResult.map
  );

  await Promise.all(
    destinations.map((dst) => {
      const filePath = join(dst, rollupResult.fileName);
      let fileCode = code;
      if (rollupResult.map) {
        fileCode = code + getSourceMappingUrlForEndOfFile(rollupResult.fileName);
        compilerCtx.fs.writeFile(filePath + '.map', JSON.stringify(sourceMap), { outputTargetType });
      }
      compilerCtx.fs.writeFile(filePath, fileCode, { outputTargetType });
    })
  );
};

const writeLazyEntry = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  rollupResult: d.RollupChunkResult,
  outputTargetType: string,
  destinations: string[],
  lazyRuntimeData: string,
  sourceTarget: d.SourceTarget,
  shouldMinify: boolean,
  isBrowserBuild: boolean
): Promise<void> => {
  if (isBrowserBuild && ['loader'].includes(rollupResult.entryKey)) {
    return;
  }
  let inputCode = rollupResult.code.replace(`[/*!__STENCIL_LAZY_DATA__*/]`, `${lazyRuntimeData}`);
  const { code, sourceMap } = await convertChunk(
    config,
    compilerCtx,
    buildCtx,
    sourceTarget,
    shouldMinify,
    false,
    isBrowserBuild,
    inputCode,
    rollupResult.map
  );

  await Promise.all(
    destinations.map((dst) => {
      const filePath = join(dst, rollupResult.fileName);
      let fileCode = code;
      if (sourceMap) {
        fileCode = code + getSourceMappingUrlForEndOfFile(rollupResult.fileName);
        compilerCtx.fs.writeFile(filePath + '.map', JSON.stringify(sourceMap), { outputTargetType });
      }
      return compilerCtx.fs.writeFile(filePath, fileCode, { outputTargetType });
    })
  );
};

const formatLazyBundlesRuntimeMeta = (bundleModules: d.BundleModule[]): string => {
  const sortedBundles = bundleModules.slice().sort(sortBundleModules);
  const lazyBundles = sortedBundles.map(formatLazyRuntimeBundle);
  return stringifyRuntimeData(lazyBundles);
};

const formatLazyRuntimeBundle = (bundleModule: d.BundleModule): d.LazyBundleRuntimeData => {
  let bundleId = bundleModule.output.bundleId;
  const bundleCmps = bundleModule.cmps.slice().sort(sortBundleComponents);
  return [bundleId, bundleCmps.map((cmp) => formatComponentRuntimeMeta(cmp, true))];
};

export const sortBundleModules = (a: d.BundleModule, b: d.BundleModule): -1 | 1 | 0 => {
  const aDependents = a.cmps.reduce((dependents, cmp) => {
    dependents.push(...cmp.dependents);
    return dependents;
  }, [] as string[]);
  const bDependents = b.cmps.reduce((dependents, cmp) => {
    dependents.push(...cmp.dependents);
    return dependents;
  }, [] as string[]);

  if (a.cmps.some((cmp) => bDependents.includes(cmp.tagName))) return 1;
  if (b.cmps.some((cmp) => aDependents.includes(cmp.tagName))) return -1;

  const aDependencies = a.cmps.reduce((dependencies, cmp) => {
    dependencies.push(...cmp.dependencies);
    return dependencies;
  }, [] as string[]);
  const bDependencies = b.cmps.reduce((dependencies, cmp) => {
    dependencies.push(...cmp.dependencies);
    return dependencies;
  }, [] as string[]);

  if (a.cmps.some((cmp) => bDependencies.includes(cmp.tagName))) return -1;
  if (b.cmps.some((cmp) => aDependencies.includes(cmp.tagName))) return 1;

  if (aDependents.length < bDependents.length) return -1;
  if (aDependents.length > bDependents.length) return 1;

  if (aDependencies.length > bDependencies.length) return -1;
  if (aDependencies.length < bDependencies.length) return 1;

  const aTags = a.cmps.map((cmp) => cmp.tagName);
  const bTags = b.cmps.map((cmp) => cmp.tagName);

  if (aTags.length > bTags.length) return -1;
  if (aTags.length < bTags.length) return 1;

  const aTagsStr = aTags.sort().join('.');
  const bTagsStr = bTags.sort().join('.');

  if (aTagsStr < bTagsStr) return -1;
  if (aTagsStr > bTagsStr) return 1;

  return 0;
};

export const sortBundleComponents = (a: d.ComponentCompilerMeta, b: d.ComponentCompilerMeta): -1 | 1 | 0 => {
  // <cmp-a>
  //   <cmp-b>
  //     <cmp-c></cmp-c>
  //   </cmp-b>
  // </cmp-a>

  // cmp-c is a dependency of cmp-a and cmp-b
  // cmp-c is a directDependency of cmp-b
  // cmp-a is a dependant of cmp-b and cmp-c
  // cmp-a is a directDependant of cmp-b

  if (a.directDependents.includes(b.tagName)) return 1;
  if (b.directDependents.includes(a.tagName)) return -1;

  if (a.directDependencies.includes(b.tagName)) return 1;
  if (b.directDependencies.includes(a.tagName)) return -1;

  if (a.dependents.includes(b.tagName)) return 1;
  if (b.dependents.includes(a.tagName)) return -1;

  if (a.dependencies.includes(b.tagName)) return 1;
  if (b.dependencies.includes(a.tagName)) return -1;

  if (a.dependents.length < b.dependents.length) return -1;
  if (a.dependents.length > b.dependents.length) return 1;

  if (a.dependencies.length > b.dependencies.length) return -1;
  if (a.dependencies.length < b.dependencies.length) return 1;

  if (a.tagName < b.tagName) return -1;
  if (a.tagName > b.tagName) return 1;

  return 0;
};

const convertChunk = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  sourceTarget: d.SourceTarget,
  shouldMinify: boolean,
  isCore: boolean,
  isBrowserBuild: boolean,
  code: string,
  rollupSrcMap: RollupSourceMap
) => {
  let sourceMap = rollupToStencilSourceMap(rollupSrcMap);
  const inlineHelpers = isBrowserBuild || !hasDependency(buildCtx, 'tslib');
  const optimizeResults = await optimizeModule(config, compilerCtx, {
    input: code,
    sourceMap: sourceMap,
    isCore,
    sourceTarget,
    inlineHelpers,
    minify: shouldMinify,
  });
  buildCtx.diagnostics.push(...optimizeResults.diagnostics);

  if (typeof optimizeResults.output === 'string') {
    code = optimizeResults.output;
    sourceMap = optimizeResults.sourceMap;
  }
  return { code, sourceMap };
};