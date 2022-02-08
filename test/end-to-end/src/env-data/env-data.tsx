import { Component, h, Env, Host } from 'stencil-hotfix';

@Component({
  tag: 'env-data',
})
export class EnvData {
  render() {
    return (
      <Host>
        <p>foo: {Env.foo}</p>
        <p>HOST: {Env.HOST}</p>
      </Host>
    );
  }
}
