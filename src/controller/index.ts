import getIO, { IO } from '../io';
import getProcessor, { Processor } from '../processor';
import getRenderer, { Renderer } from '../renderer';

export default class Controller {
  private io: IO;
  private processor: Processor;
  private renderer: Renderer;

  private url: string;

  constructor({
    url,
    customLoader,
    hasAudio,
    hasVideo,
    $canvas,
  }: {
    url: string;
    customLoader?: IO;
    hasAudio: boolean;
    hasVideo: boolean;
    $canvas: HTMLCanvasElement;
  }) {
    this.io = getIO({ customLoader });
    this.processor = getProcessor();
    this.renderer = getRenderer({ hasAudio, hasVideo, $canvas });

    this.url = url;
  }

  open() {
    // io --> buffer --> processor
    this.io.onChunkArrival(this.processor.process.bind(this.processor));

    // processor --> buffer --> renderer
    this.processor.onDataAvailable(this.renderer.pushFrame.bind(this.renderer));

    // begin
    this.io.open({ url: this.url });
  }

  close() {
    this.io.close();
  }
}
