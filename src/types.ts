export interface CustomBuffer {
  add(chunk: ArrayBuffer): void;

  onDataFulled(handleDataFulled: HandleDataFulled): void;
}

export interface HandleDataFulled {
  (chunk: ArrayBuffer, byteStart: number): any;
}

export interface HandleBufferInfoUpdated {
  (info: { byteRate: { value: number; unit: string }; stashSize: number; bufferSize: number }): void;
}
