import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'cmp-b',
  shadow: true,
})
export class CmpB {
  render() {
    return <slot></slot>;
  }
}
