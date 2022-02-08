import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'slot-array-top',
  shadow: true,
})
export class SlotArrayTop {
  render() {
    return [<span>Content should be on top</span>, <slot />];
  }
}
