export interface Processor {
  process(chunk: ArrayBuffer): void;
  onDataAvailable(handler: HandleDataAvailable): void;
}

export interface HandleDataAvailable {
  (videoTrack: any, audioTrack: any): void;
}

export enum MsgType {
  READY = 'ready',
  HEADER = 'header',
  DECODE = 'decode',
  VIDEO = 'video',
  AUDIO = 'audio',
}

export interface Msg {
  type: MsgType;
  data: any;
}

export interface VideoMsg extends Msg {
  data: {
    buffer: SharedArrayBuffer;
    height: number;
    width: number;
    stride0: number;
    stride1: number;
    timestamp: number;
  };
}

export interface AudioMsg extends Msg {
  data: {
    buffer: SharedArrayBuffer;
    timestamp: number;
  };
}
