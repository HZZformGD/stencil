import { Component, Host, Prop, getAssetPath, h } from 'stencil-hotfix';

@Component({
  tag: 'cmp-asset',
})
export class CmpAsset {
  @Prop() icon: string;

  render() {
    return (
      <Host>
        <img src={getAssetPath(`assets/icons/${this.icon}.png`)} />
        <img src={getAssetPath(`https://google.com/`)} />
      </Host>
    );
  }
}
