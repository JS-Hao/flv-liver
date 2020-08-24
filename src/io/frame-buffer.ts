import SpeedDetector from '../utils/speed-detector';
import { HandleDataFulled, HandleBufferInfoUpdated } from '../types';
import { NORMALIZED_KBPS_LIST } from './constant';
import Logger from '../utils/logger';

export default class FrameBuffer {
  /*
   *
   * |- usedStash -| -- remainStash -- |              |
   * | ---------- stashSize -----------|              |
   * | ---------------- bufferSize -------------------|
   *
   * usedStash: the space which has buffered in the buffer, mark the end of the space position
   * remainStash: the remain space can be save, be equal stashSize minus useStath
   * stashSize: the size of memory space which can be buffered
   * bufferSize: the total size of memory space, it should larger than stashSize
   */

  private stashBuffer: ArrayBuffer;
  private bufferSize: number;
  private stashSize: number;
  private usedStash: number;
  private byteStart: number;

  // network speed detect
  private speedDetector: SpeedDetector;
  private lastKBps: number;

  // handler
  private handleDataFull: HandleDataFulled;
  private handleBufferInfoUpdated: HandleBufferInfoUpdated;

  constructor(config: { bufferSize: number; stashSize: number }) {
    const { bufferSize, stashSize } = config;

    this.usedStash = 0;
    this.byteStart = 0;
    this.stashSize = stashSize;
    this.bufferSize = bufferSize;
    this.stashBuffer = new ArrayBuffer(this.bufferSize);
    this.speedDetector = new SpeedDetector();
  }

  add(chunk: ArrayBuffer) {
    this.speedDetector.addBytes(chunk.byteLength);

    const KBps = this.normalizeKBps(this.speedDetector.getLastKBps());
    if (KBps && this.lastKBps !== KBps) {
      this.adjustStashSize(KBps);
    }

    if (this.usedStash + chunk.byteLength > this.stashSize) {
      const stashArray = new Uint8Array(this.stashBuffer, 0, this.bufferSize);
      const stashUsedArray = new Uint8Array(this.stashBuffer, 0, this.usedStash);
      const consumed = this.consumeData(stashUsedArray);
      if (consumed < stashUsedArray.byteLength) {
        const remainArray = new Uint8Array(stashUsedArray, consumed);
        stashArray.set(remainArray, 0);
        this.usedStash = remainArray.byteLength;
        this.byteStart += consumed;
      } else {
        this.usedStash = 0;
        this.byteStart += consumed;
      }
    }

    if (this.usedStash + chunk.byteLength > this.stashSize) {
      this.expandSize(this.usedStash + chunk.byteLength);
    }

    const stashArray = new Uint8Array(this.stashBuffer, 0, this.bufferSize);
    const chunkArray = new Uint8Array(chunk);
    stashArray.set(chunkArray, this.usedStash);
    this.usedStash += chunkArray.byteLength;

    if (this.handleBufferInfoUpdated) {
      this.handleBufferInfoUpdated({
        byteRate: { value: KBps, unit: 'kbps' },
        stashSize: this.stashSize,
        bufferSize: this.bufferSize,
      });
    }
  }

  onDataFulled(handleDataFull: HandleDataFulled) {
    this.handleDataFull = handleDataFull;
  }

  onInfoUpdated(handleBufferInfoUpdated: HandleBufferInfoUpdated) {
    this.handleBufferInfoUpdated = handleBufferInfoUpdated;
  }

  private consumeData(data: ArrayBuffer): number {
    if (!this.handleDataFull) {
      Logger.error('no handleDataFull in FrameBuffer!');
    }

    return this.handleDataFull(data, this.byteStart);
  }

  private expandSize(targetSize: number) {
    if (targetSize <= this.bufferSize) {
      return (this.stashSize = targetSize);
    } else {
      const newStashSize = targetSize;
      const newBufferSize = targetSize + 1024 * 1024 * 1; // targetSize + 1MB
      const oldBufferSize = this.bufferSize;
      const oldStashArray = new Uint8Array(this.stashBuffer, 0, oldBufferSize);
      const newStashBuffer = new ArrayBuffer(newBufferSize);
      const newStashArray = new Uint8Array(newStashBuffer, 0, newBufferSize);
      newStashArray.set(oldStashArray, 0);

      this.stashSize = newStashSize;
      this.bufferSize = newBufferSize;
      this.stashBuffer = newStashBuffer;
    }
  }

  private normalizeKBps(KBps: number): number {
    for (let index = 0; index < NORMALIZED_KBPS_LIST.length; index++) {
      const nextKBps = NORMALIZED_KBPS_LIST[index + 1];
      const curKBps = NORMALIZED_KBPS_LIST[index];

      if (!nextKBps) {
        // larger than the biggest kbps!
        return curKBps;
      } else if (KBps < nextKBps && KBps >= curKBps) {
        return nextKBps;
      }
    }
  }

  private adjustStashSize(KBps: number) {
    this.expandSize(KBps * 1024);
  }
}
