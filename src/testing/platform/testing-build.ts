import type * as d from 'stencil-hotfix/internal';

export const Build: d.UserBuildConditionals = {
  isDev: true,
  isBrowser: false,
  isServer: true,
  isTesting: true,
};
