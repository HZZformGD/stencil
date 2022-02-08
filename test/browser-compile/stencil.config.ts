import { Config } from '../../internal';

export const config: Config = {
  namespace: 'BrowserCompile',

  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      copy: [
        {
          src: '../../../compiler/',
          dest: './stencil-hotfix/compiler/',
          warn: true,
        },
        {
          src: '../../../internal/',
          dest: './stencil-hotfix/internal/',
          warn: true,
        },
        {
          src: 'preview.html',
          warn: true,
        },
      ],
    },
  ],
  enableCache: false,
};
