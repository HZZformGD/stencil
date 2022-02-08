import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'slot-children-root',
  shadow: true,
})
export class SlotChildrenRoot {
  render() {
    return (
      <section>
        ShadowRoot1
        <article>
          <slot />
        </article>
        ShadowRoot2
      </section>
    );
  }
}
