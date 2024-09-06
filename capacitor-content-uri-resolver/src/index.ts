import { registerPlugin } from '@capacitor/core';

import type { ContentUriResolverPlugin } from './definitions';

const ContentUriResolver = registerPlugin<ContentUriResolverPlugin>('ContentUriResolver', {
  web: () => import('./web').then(m => new m.ContentUriResolverWeb()),
});

export * from './definitions';
export { ContentUriResolver };