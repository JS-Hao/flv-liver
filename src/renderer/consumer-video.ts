import { VFrame } from './types';

export default class ConsumerVideo {
  constructor($canvas: HTMLCanvasElement) {}

  pushFrame({ buffer, width, height, timestamp }: VFrame) {}
}
