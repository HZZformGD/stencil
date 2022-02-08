import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'reparent-style-no-vars',
  styleUrl: 'reparent-style-no-vars.css',
  shadow: true,
})
export class ReparentStyleNoVars {
  render() {
    return <div class="css-entry">No CSS Variables</div>;
  }
}
