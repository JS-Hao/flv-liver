import IO from './io';

interface Player {
  load(): void;
}

interface PlayerConfig {
  container: HTMLDivElement; // need a dom container to initial the video
  url: string; // media data source url
}

export default class FlvLivePlayer implements Player {
  private io: IO = new IO();
  private url: string = null;
  private contianer: HTMLDivElement = null;

  constructor(private config: PlayerConfig) {
    const { url, container } = config;
    this.url = url;
    this.contianer = container;
  }

  load() {
    this.io.onDataAvailable((data, byteStart) => {
      console.log('chunk', data, 'byteStart', byteStart);
    });
    this.io.open({ url: this.url });
  }

  stop() {
    this.io.close();
  }
}
