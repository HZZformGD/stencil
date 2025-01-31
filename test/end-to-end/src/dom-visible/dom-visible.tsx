import { Component, State, h } from 'stencil-hotfix';

@Component({
  tag: 'dom-visible',
})
export class DomVisibleCmp {
  @State() hideArticle = true;

  render() {
    return (
      <section>
        <button onClick={() => (this.hideArticle = !this.hideArticle)}>
          {this.hideArticle ? 'Show' : 'Hide'} Article
        </button>
        <article hidden={this.hideArticle}>
          <h1>ARTICLE!!</h1>
        </article>
      </section>
    );
  }
}
