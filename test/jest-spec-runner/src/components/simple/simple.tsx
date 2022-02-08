import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'my-simple',
  shadow: false,
})
export class MySimple {
  render() {
    return <span>simple!</span>;
  }
}
