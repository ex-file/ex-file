type FileType = Array<ArrayBuffer | ArrayBufferView | Blob | string>;

export interface ExFilePlugin {
  name: string;
  install(e: typeof ExFile): void;
}

export default class ExFile extends File {
  constructor(
    parts: File | FileType,
    filename?: string,
    properties?: FilePropertyBag
  ) {
    if (parts instanceof File) {
      super([parts], parts.name, {
        lastModified: parts.lastModified,
        type: parts.type
      });
    } else {
      if (!filename) {
        throw new TypeError('required filename');
      } else {
        super(parts, filename, properties);
      }
    }
  }
  [key: string]: any;
  public static plugins: { [x: string]: boolean } = {};
  public static use(plugin: ExFilePlugin) {
    if (ExFile.plugins[plugin.name]) {
      return;
    }
    plugin.install(ExFile);
    ExFile.plugins[plugin.name] = true;
  }
}
