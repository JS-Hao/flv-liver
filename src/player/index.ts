import { IO } from '../io';
import Controller from '../controller';

interface PlayerConfig {
  container: HTMLDivElement; // need a dom container to initial the video
  url: string; // media data source url
  hasVideo: boolean;
  hasAudio: boolean;
  customLoader?: IO;
}

export default class FlvLivePlayer {
  private constroller: Controller;
  private contianer: HTMLDivElement;

  constructor({ url, container, hasVideo, hasAudio, customLoader }: PlayerConfig) {
    this.contianer = container;
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = 1152;
    canvas.height = 720;
    this.contianer.appendChild(canvas);

    this.constroller = new Controller({
      url,
      hasVideo,
      hasAudio,
      customLoader,
      $canvas: canvas,
    });
  }

  open() {
    this.constroller.open();
  }

  close() {
    this.constroller.close();
  }
}
