import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'scoped-basic-root',
  scoped: true,
  styleUrls: {
    md: 'cmp-root-md.css',
  },
})
export class ScopedBasicRoot {
  render() {
    return (
      <scoped-basic>
        <span>light</span>
      </scoped-basic>
    );
  }
}
