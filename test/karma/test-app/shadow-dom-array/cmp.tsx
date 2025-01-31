import { Component, Prop, h } from 'stencil-hotfix';

@Component({
  tag: 'shadow-dom-array',
  shadow: true,
})
export class ShadowDomArray {
  @Prop() values: number[] = [];

  render() {
    return this.values.map((v) => <div>{v}</div>);
  }
}
