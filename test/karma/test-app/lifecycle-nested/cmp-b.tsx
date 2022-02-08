import { Component, h } from 'stencil-hotfix';
import output from './output';

@Component({
  tag: 'lifecycle-nested-b',
  shadow: true,
})
export class Cmpb {
  async componentWillLoad() {
    output('componentWillLoad-b');
  }

  async componentDidLoad() {
    output('componentDidLoad-b');
  }

  render() {
    return <slot />;
  }
}
