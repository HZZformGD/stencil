import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'slot-array-complex',
})
export class SlotArrayComplex {
  render() {
    return [
      <slot name="start"></slot>,
      <section>
        <slot></slot>
      </section>,
      <slot name="end"></slot>,
    ];
  }
}
