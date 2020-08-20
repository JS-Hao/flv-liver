export enum MediaType {
  FLV = 'flv',
}

export interface HandleDataFulled {
  (chunk: ArrayBuffer, byteStart: number): any;
}

export interface HandleBufferInfoUpdated {
  (info: { byteRate: { value: number; unit: string }; stashSize: number; bufferSize: number }): void;
}

export interface HandlePlayerInfoUpdated extends HandleBufferInfoUpdated {}
