import { Component, Host, h } from 'stencil-hotfix';

@Component({
  tag: 'cmp-label-with-slot-sibling',
  scoped: true,
})
export class CmpLabelWithSlotSibling {
  render() {
    return (
      <Host>
        <label>
          <slot />
          <div>Non-slotted text</div>
        </label>
      </Host>
    );
  }
}
