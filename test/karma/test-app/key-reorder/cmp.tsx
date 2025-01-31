import { Component, Prop, h } from 'stencil-hotfix';

@Component({
  tag: 'key-reorder',
})
export class KeyReorder {
  @Prop() num?: number;

  render() {
    return <div>{this.num}</div>;
  }
}
