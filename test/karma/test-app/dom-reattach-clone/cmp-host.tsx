import { Component, Host, h } from 'stencil-hotfix';

@Component({
  tag: 'dom-reattach-clone-host',
})
export class DomReattachCloneHost {
  render() {
    return (
      <Host>
        <span class="component-mark-up">Component mark-up</span>
        <slot></slot>
      </Host>
    );
  }
}
