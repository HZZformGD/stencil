import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'cmp-a',
})
export class CmpA {
  render() {
    return <cmp-b>CmpALightDom</cmp-b>;
  }
}
