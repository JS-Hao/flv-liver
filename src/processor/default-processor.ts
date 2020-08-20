import { Processor, HandleDataAvailable, MsgType, VideoMsg, AudioMsg, Msg } from './types';
import '../vondor/prod.all.wasm.combine';

export default class DefaultProcessor implements Processor {
  private codec: any;
  private handleDataAvailable: HandleDataAvailable;

  constructor() {
    this.codec = new H264Codec();
    this.codec.onmessage = this.handleMessage.bind(this);
  }

  process(chunk: ArrayBuffer): void {
    this.codec.decode(chunk);
  }

  onDataAvailable(handler: HandleDataAvailable): void {
    this.handleDataAvailable = handler;
  }

  private handleMessage(msg: Msg) {
    console.log('msg', msg);

    switch (msg.type) {
      case MsgType.AUDIO:
        this.handleDataAvailable(null, msg.data);
        break;

      case MsgType.VIDEO:
        this.handleDataAvailable(msg.data, null);
        break;

      default:
        break;
    }
  }
}
