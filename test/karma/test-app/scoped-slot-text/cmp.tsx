import { Component, Host, h } from 'stencil-hotfix';

@Component({
  tag: 'cmp-label',
  scoped: true,
})
export class CmpLabel {
  render() {
    return (
      <Host>
        <label>
          <slot />
        </label>
      </Host>
    );
  }
}
