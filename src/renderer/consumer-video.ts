import { VFrame } from './types';
import Drawer from './drawer';

export default class ConsumerVideo {
  private drawer;

  constructor($canvas: HTMLCanvasElement) {
    this.drawer = new Drawer($canvas);
  }

  pushFrame({ buffer, width, height, timestamp }: VFrame) {
    const data = Buffer.from(new Uint8Array(buffer));
    this.drawer.drawNextOutputPicture(width, height, data);
  }
}
