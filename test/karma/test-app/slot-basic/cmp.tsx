import { Component, h } from 'stencil-hotfix';

@Component({
  tag: 'slot-basic',
})
export class SlotBasic {
  render() {
    return (
      <header>
        <section>
          <article>
            <slot />
          </article>
        </section>
      </header>
    );
  }
}
