import { HandleDataFulled, HandleBufferInfoUpdated } from 'types';

export interface IO {
  open({ url }: { url: string }): void;

  close(): void;

  onChunkArrival(callback: HandleDataFulled): void;

  onBufferInfoUpdated(callback: HandleBufferInfoUpdated): void;

  onComplete(callback: Function): void;
}
