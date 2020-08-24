import { Processor, HandleDataAvailable, MsgType, VideoMsg, AudioMsg, Msg } from './types';

export default class DefaultProcessor implements Processor {
  private codec: any;
  private handleDataAvailable: HandleDataAvailable;

  constructor() {}

  process(chunk: ArrayBuffer): void {}

  onDataAvailable(handler: HandleDataAvailable): void {
    this.handleDataAvailable = handler;
  }
}
