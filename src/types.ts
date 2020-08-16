export interface CustomBuffer {
  add(chunk: ArrayBuffer): void;

  onDataFulled(handleDataFulled: HandleDataFulled): void;
}

export interface HandleDataFulled {
  (chunk: ArrayBuffer, byteStart: number): any;
}
