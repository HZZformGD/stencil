import { setupGlobal } from 'stencil-hotfix/mock-doc';

export const win = setupGlobal(global) as Window;

export const doc = win.document;
