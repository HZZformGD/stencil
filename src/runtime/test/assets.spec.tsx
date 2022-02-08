import { CmpAsset } from './fixtures/cmp-asset';
import { newSpecPage } from 'stencil-hotfix/testing';
import { getAssetPath } from 'stencil-hotfix';

describe('assets', () => {
  it('should load asset data', async () => {
    const page = await newSpecPage({
      components: [CmpAsset],
      html: `<cmp-asset icon="delorean"></cmp-asset>`,
    });

    expect(page.root).toEqualHtml(`
      <cmp-asset icon="delorean">
        <img src="/assets/icons/delorean.png">
        <img src="https://google.com/">
      </cmp-asset>
    `);
  });

  it('getAssetPath is defined', async () => {
    expect(getAssetPath).toBeDefined();
  });
});
