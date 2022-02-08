import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'factory-jsx',
})
export class FactoryJSX {
  getJsxNode() {
    return <div>Factory JSX</div>;
  }

  render() {
    return (
      <div>
        {this.getJsxNode()}
        {this.getJsxNode()}
      </div>
    );
  }
}
