import type * as d from '../../declarations';
import { MockWindow, patchWindow } from 'stencil-hotfix/mock-doc';

export function patchDomImplementation(doc: any, opts: d.HydrateFactoryOptions) {
  let win: any;

  if (doc.defaultView != null) {
    opts.destroyWindow = true;
    patchWindow(doc.defaultView);
    win = doc.defaultView;
  } else {
    opts.destroyWindow = true;
    opts.destroyDocument = false;
    win = new MockWindow(false) as any;
  }

  if (win.document !== doc) {
    win.document = doc;
  }

  if (doc.defaultView !== win) {
    doc.defaultView = win;
  }

  const HTMLElement = doc.documentElement.constructor.prototype;
  if (typeof HTMLElement.getRootNode !== 'function') {
    const elm = doc.createElement('unknown-element');
    const HTMLUnknownElement = elm.constructor.prototype;
    HTMLUnknownElement.getRootNode = getRootNode;
  }

  if (typeof doc.createEvent === 'function') {
    const CustomEvent = doc.createEvent('CustomEvent').constructor;
    if (win.CustomEvent !== CustomEvent) {
      win.CustomEvent = CustomEvent;
    }
  }

  try {
    doc.baseURI;
  } catch (e) {
    Object.defineProperty(doc, 'baseURI', {
      get() {
        const baseElm = doc.querySelector('base[href]');
        if (baseElm) {
          return new URL(baseElm.getAttribute('href'), win.location.href).href;
        }
        return win.location.href;
      },
    });
  }

  return win as Window & typeof globalThis;
}

function getRootNode(opts?: { composed?: boolean; [key: string]: any }) {
  const isComposed = opts != null && opts.composed === true;

  let node: Node = this as any;

  while (node.parentNode != null) {
    node = node.parentNode;

    if (isComposed === true && node.parentNode == null && (node as any).host != null) {
      node = (node as any).host;
    }
  }

  return node;
}
