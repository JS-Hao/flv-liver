export interface HandleTimeUpdate {
  (currentTime: number): void;
}

export default class Timer {
  private beginTime: number;
  private duration: number = 0;
  private isRun: boolean = false;
  private callbackList: HandleTimeUpdate[] = [];
  private interval: number;
  private timer: NodeJS.Timeout;

  constructor(frameRate: number) {
    this.interval = 1000 / frameRate;
  }

  start = (): void => {
    if (!this.isRun) {
      this.beginTime = Date.now();
      this.isRun = true;
      this.startLoop();
    }
  };

  stop = (): void => {
    if (this.isRun) {
      this.stopLoop();
      const duration = Date.now() - this.beginTime;
      this.duration += duration;
      this.beginTime = undefined;
      this.isRun = false;
    }
  };

  clear(): void {
    this.duration = 0;
    this.isRun = false;
  }

  getDuration(): number {
    if (this.isRun) {
      return Date.now() - this.beginTime + this.duration;
    } else {
      return this.duration;
    }
  }

  setDuration(duration: number) {
    this.duration = duration;
  }

  onTimeUpdate(func: HandleTimeUpdate) {
    this.callbackList.push(func);
  }

  isStarted(): boolean {
    return this.isRun;
  }

  private startLoop() {
    this.timer = setInterval(() => {
      const currentTime = this.getDuration();
      this.callbackList.length && this.callbackList.forEach((func) => func(currentTime));
    }, this.interval);
  }

  private stopLoop() {
    clearInterval(this.timer);
  }
}
