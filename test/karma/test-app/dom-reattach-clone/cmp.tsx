import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'dom-reattach-clone',
})
export class DomReattachClone {
  render() {
    return (
      <div class="wrapper">
        <span class="component-mark-up">Component mark-up</span>
        <slot></slot>
      </div>
    );
  }
}
