export const loadDeps = async (resolveLookup: Map<string, string>, fs: Map<string, string>) => {
  resolveLookup.set('stencil-hotfix/internal/client', '/stencil-hotfix/internal/client/index.js');
  resolveLookup.set('stencil-hotfix/internal/app-data', '/stencil-hotfix/internal/app-data/index.js');

  await loadDep('/stencil-hotfix/compiler/stencil.js');

  const rollupDep = stencil.dependencies.find((dep: any) => dep.name === 'rollup');
  await loadDep(`https://cdn.jsdelivr.net/npm/rollup@${rollupDep.version}/dist/rollup.browser.js`);

  const fetchResults = await Promise.all([
    await fetch('/stencil-hotfix/internal/client/index.js'),
    await fetch('/stencil-hotfix/internal/client/shadow-css.js'),
    await fetch('/stencil-hotfix/internal/app-data/index.js'),
    await fetch('/stencil-hotfix/internal/client/css-shim.js'),
    await fetch('/stencil-hotfix/internal/client/dom.js'),
  ]);

  await Promise.all([
    fetchResults.map(async (r) => {
      const file = new URL(r.url).pathname;
      const code = await r.text();
      fs.set(file, code);
    }),
  ]);
};

const loadDep = (url: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.onload = () => {
      console.log('loaded dep:', url);
      setTimeout(resolve);
    };
    script.onerror = (e) => {
      console.log('error loading dep:', url);
      reject(e);
    };
    script.src = url;
    document.head.appendChild(script);
  });
};

declare const stencil: any;
