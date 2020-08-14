import { Fetcher, FetcherConfig } from './types';
import Logger from '../utils/logger';

export default class HttpFlvStreamFetcher implements Fetcher {
  private dataAvailableCb: Function = null;
  private onCompleteCb: Function = null;

  open(config: FetcherConfig) {
    const { url } = config;
    if (!window.fetch) {
      Logger.error(`es6 native method 'fetch' is not support`);
    } else {
      this.readStream(url);
    }
  }

  onDataAvailable(callback: Function): void {
    this.dataAvailableCb = callback;
  }

  onComplete(callback: Function): void {
    this.onCompleteCb = callback;
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
        console.log('res');
      })
      .catch((err) => {
        Logger.error('fetch url error', err);
      });
  }
}
