import FrameBuffer from './frame-buffer';
import Logger from '../utils/logger';
import { Fetcher, FetcherConfig } from './types';
import { CustomBuffer, HandleDataFulled } from '../types';

export default class HttpFlvStreamFetcher implements Fetcher {
  private dataAvailableCb: Function = null;
  private completeCb: Function = null;
  private receivedLength: number = 0;
  private frameBuffer: CustomBuffer;

  constructor() {
    this.frameBuffer = new FrameBuffer({
      bufferSize: 3 * 1024 * 1024, // 3MB
      stashSize: 1024 * 36, // 2MB
    });
  }

  open(config: FetcherConfig) {
    const { url } = config;
    if (!window.fetch) {
      Logger.error(`es6 native method 'fetch' is not support`);
    } else {
      this.readStream(url);
    }
  }

  onDataAvailable(callback: HandleDataFulled): void {
    this.frameBuffer.onDataFulled(callback);
  }

  onComplete(callback: Function): void {
    this.completeCb = callback;
  }

  private readStream(url: string) {
    const params = {
      method: 'GET',
      mode: 'cors',
      cache: 'default',
      // The default policy of Fetch API in the whatwg standard
      // Safari incorrectly indicates 'no-referrer' as default policy, fuck it
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
        Logger.error('fetch url error', err);
      });
  }

  private loop(reader: ReadableStreamReader) {
    reader
      .read()
      .then((data) => {
        if (!data.value?.buffer) {
          return Logger.error('no buffer data in the ReadableStreamReader!');
        }

        const buffer = data.value.buffer as Buffer;
        const bufferSize = buffer.byteLength;
        this.receivedLength += bufferSize;

        if (data.done) {
          this.completeCb && this.completeCb(data);
        } else {
          this.frameBuffer.add(data.value);
          // this.dataAvailableCb && this.dataAvailableCb(data);
          this.loop(reader);
        }
      })
      .catch((err) => {
        Logger.error('read stream error', err);
      });
  }
}
