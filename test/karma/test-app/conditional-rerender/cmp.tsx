import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'conditional-rerender',
})
export class ConditionalRerender {
  render() {
    return (
      <main>
        <slot />
        <nav>Nav</nav>
      </main>
    );
  }
}
