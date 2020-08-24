import { IO } from './types';
import FrameBuffer from './frame-buffer';
import logger from '../utils/logger';
import { HandleDataFulled, HandleBufferInfoUpdated } from '../types';

export default class StreamLoader implements IO {
  private dataAvailableCb: Function;
  private completeCb: Function;
  private receivedLength: number;
  private frameBuffer: FrameBuffer;
  private isClose: boolean;

  constructor() {
    this.receivedLength = 0;
    this.isClose = false;
    this.frameBuffer = new FrameBuffer({
      bufferSize: 512 * 1024, // 512KB
      stashSize: 1024 * 36, // 2MB
    });
  }

  open({ url }: { url: string }) {
    this.isClose = false;

    if (!window.fetch) {
      logger.error(`es6 native method 'fetch' is not support`);
    } else {
      this.readStream(url);
    }
  }

  close() {
    this.isClose = true;
  }

  onChunkArrival(callback: HandleDataFulled): void {
    this.frameBuffer.onDataFulled(callback);
  }

  onBufferInfoUpdated(handleBufferInfoUpdated: HandleBufferInfoUpdated) {
    this.frameBuffer.onInfoUpdated(handleBufferInfoUpdated);
  }

  onComplete(callback: Function): void {
    this.completeCb = callback;
  }

  private readStream(url: string) {
    const params = {
      method: 'GET',
      mode: 'cors',
      cache: 'default',
      referrerPolicy: 'no-referrer-when-downgrade',
    };

    window
      .fetch(url, params as any)
      .then((res) => {
        if (res.ok && res.status >= 200 && res.status <= 299) {
          this.loop(res.body.getReader());
        }
      })
      .catch((err) => {
        logger.error('fetch url error', err);
      });
  }

  private loop(reader: ReadableStreamReader) {
    reader
      .read()
      .then((data) => {
        if (!data.value?.buffer) {
          return logger.error('no buffer data in the ReadableStreamReader!');
        }

        const buffer = data.value.buffer as Buffer;
        const bufferSize = buffer.byteLength;
        this.receivedLength += bufferSize;

        if (data.done) {
          this.completeCb && this.completeCb(data);
        } else if (!this.isClose) {
          this.frameBuffer.add(data.value);
          this.loop(reader);
        }
      })
      .catch((err) => {
        logger.error('read stream error', err);
      });
  }
}
