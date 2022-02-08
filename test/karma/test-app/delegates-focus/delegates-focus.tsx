import { Component, h, Host } from 'stencil-hotfix';

@Component({
  tag: 'delegates-focus',
  shadow: {
    delegatesFocus: true,
  },
  styleUrl: 'delegates-focus.css',
})
export class DelegatesFocus {
  render() {
    return (
      <Host>
        <input />
      </Host>
    );
  }
}
