import { setMode } from 'stencil-hotfix';

export default function () {
  setMode((elm) => {
    return elm.getAttribute('mode');
  });
}
