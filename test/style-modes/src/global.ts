import { setMode } from 'stencil-hotfix';

const global = () => {
  setMode(
    (elm: any) => elm.mode || elm.getAttribute('mode') || document.documentElement.getAttribute('mode') || 'buford'
  );
};
export default global;
