import type * as d from '../../../declarations';
import { getBuildFeatures, updateBuildConditionals } from '../../app-core/app-data';

export const getCustomElementsBuildConditionals = (config: d.Config, cmps: d.ComponentCompilerMeta[]) => {
  // because custom elements bundling does not customize the build conditionals by default
  // then the default in "import { BUILD, NAMESPACE } from 'stencil-hotfix/internal/app-data'"
  // needs to have the static build conditionals set for the custom elements build
  const build = getBuildFeatures(cmps) as d.BuildConditionals;

  build.lazyLoad = false;
  build.hydrateClientSide = false;
  build.hydrateServerSide = false;
  build.asyncQueue = config.taskQueue === 'congestionAsync';
  build.taskQueue = config.taskQueue !== 'immediate';
  updateBuildConditionals(config, build);
  build.devTools = false;

  return build;
};
