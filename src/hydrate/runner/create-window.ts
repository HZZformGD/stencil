import { MockWindow, cloneWindow } from 'stencil-hotfix/mock-doc';

const templateWindows = new Map<string, Window>();

export function createWindowFromHtml(templateHtml: string, uniqueId: string) {
  let templateWindow = templateWindows.get(uniqueId);
  if (templateWindow == null) {
    templateWindow = new MockWindow(templateHtml) as any;
    templateWindows.set(uniqueId, templateWindow);
  }

  const win = cloneWindow(templateWindow);
  return win as any;
}
