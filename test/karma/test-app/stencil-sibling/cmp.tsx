import { Component, Host, h } from 'stencil-hotfix';

@Component({
  tag: 'stencil-sibling',
})
export class StencilSibling {
  render() {
    return (
      <Host>
        <sibling-root>sibling-light-dom</sibling-root>
      </Host>
    );
  }
}
