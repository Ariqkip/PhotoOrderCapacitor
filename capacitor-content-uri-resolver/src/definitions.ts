
declare module "@capacitor/core" {
  interface PluginRegistry{
    ContentUriResolverPlugin: ContentUriResolverPlugin;
  }
}

export interface ContentUriResolverPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
  getAbsolutePathFromContentUri(options: { context: any, contentUri: string }): Promise<{ absolutePath: string }>;
}
