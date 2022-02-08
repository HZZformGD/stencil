import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'slot-basic-order',
})
export class SlotBasicOrder {
  render() {
    return <slot></slot>;
  }
}
