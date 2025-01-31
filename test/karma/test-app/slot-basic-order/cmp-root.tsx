import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'slot-basic-order-root',
})
export class SlotBasicOrderRoot {
  render() {
    return (
      <slot-basic-order>
        <content-a>a</content-a>
        <content-b>b</content-b>
        <content-c>c</content-c>
      </slot-basic-order>
    );
  }
}
