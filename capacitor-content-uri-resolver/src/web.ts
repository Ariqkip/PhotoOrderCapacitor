import { WebPlugin } from '@capacitor/core';

import type { ContentUriResolverPlugin } from './definitions';

export class ContentUriResolverWeb extends WebPlugin implements ContentUriResolverPlugin {
  async getAbsolutePathFromContentUri(options: { contentUri: string }): Promise<{ absolutePath: string; }> {
    alert(options.contentUri);
    return {absolutePath: "We have got the absolute path"}
  }
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
