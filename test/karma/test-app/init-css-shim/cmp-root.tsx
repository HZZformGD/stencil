import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'init-css-root',
  styleUrl: 'cmp-root.css',
})
export class InitCssRoot {
  render() {
    return [<div id="relative"></div>, <div id="relativeToRoot"></div>, <div id="absolute"></div>];
  }
}
