import type * as d from 'stencil-hotfix/declarations';
import { mockConfig } from 'stencil-hotfix/testing';
import { validateConfig } from '../validate-config';
import { buildWarn } from '@utils';

describe('validateCustom', () => {
  let userConfig: d.Config;

  beforeEach(() => {
    userConfig = mockConfig();
  });

  it('should log warning', () => {
    userConfig.outputTargets = [
      {
        type: 'custom',
        name: 'test',
        validate: (_, diagnostics) => {
          const warn = buildWarn(diagnostics);
          warn.messageText = 'test warning';
        },
        generator: async () => {
          return;
        },
      },
    ];
    const { diagnostics } = validateConfig(userConfig);
    expect(diagnostics.length).toBe(1);
  });
});
