import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'cmp-text-green',
  styleUrl: 'cmp-text-green.css',
  scoped: true,
})
export class CmpTextGreen {
  render() {
    return <text-green>green text, blue border</text-green>;
  }
}
