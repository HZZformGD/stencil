import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'bad-shared-jsx',
})
export class BadSharedJSX {
  render() {
    const sharedNode = <div>Do Not Share JSX Nodes!</div>;
    return (
      <div>
        {sharedNode}
        {sharedNode}
      </div>
    );
  }
}
