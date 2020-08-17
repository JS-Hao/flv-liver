export default class SpeedDetector {
  private startTimeStamp: number;
  private lastTimeStamp: number;
  private intervalBytes: number;
  private totalBytes: number;
  private lastIntervalBytes: number;

  private getCurrentTimeStamp() {
    return window.performance.now ? window.performance.now() : Date.now();
  }

  constructor() {
    this.lastTimeStamp = 0;
    this.totalBytes = 0;
    this.intervalBytes = 0;
  }

  addBytes(byteLength: number) {
    // initial
    if (!this.lastTimeStamp) {
      this.lastTimeStamp = this.startTimeStamp = this.getCurrentTimeStamp();
      this.intervalBytes += byteLength;
    } else if (Math.abs(this.lastTimeStamp - this.getCurrentTimeStamp()) < 1000) {
      this.intervalBytes += byteLength;
    } else {
      this.lastIntervalBytes = this.intervalBytes;
      this.intervalBytes = byteLength;
      this.lastTimeStamp = this.getCurrentTimeStamp();
    }

    this.totalBytes += byteLength;
  }

  getCurrentKbps(): number {
    this.addBytes(0);
    const intervalSeconds = (this.getCurrentTimeStamp() - this.lastTimeStamp) / 1000;
    return this.intervalBytes / 1024 / intervalSeconds;
  }

  getLastKbps(): number {
    this.addBytes(0);

    if (this.lastIntervalBytes) {
      if (this.getCurrentTimeStamp() - this.lastTimeStamp >= 500) {
        return this.getCurrentKbps();
      } else {
        return this.lastIntervalBytes / 1024;
      }
    } else {
      return 0; // we don't know
    }
  }

  getTotalKbps(): number {
    return this.totalBytes / 1024 / (this.getCurrentTimeStamp() - this.startTimeStamp / 1000);
  }
}
