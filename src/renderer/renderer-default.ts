import ConsumerAudio from './consumer-audio';
import ConsumerVideo from './consumer-video';
import { Config, Renderer, VFrame, AFrame } from './types';

export default class RendererDefault implements Renderer {
  private audio: ConsumerAudio;
  private video: ConsumerVideo;
  private hasAudio: boolean;
  private hasVideo: boolean;

  constructor({ hasAudio, hasVideo, $canvas }: Config) {
    if (hasAudio) {
      this.audio = new ConsumerAudio();
    }

    if (hasVideo) {
      this.video = new ConsumerVideo($canvas);
    }

    this.hasAudio = hasAudio;
    this.hasVideo = hasVideo;
  }

  pushFrame(vFrame: VFrame, aFrame: AFrame): void {
    if (vFrame) {
      this.video.pushFrame(vFrame);
    }

    if (aFrame) {
      this.audio.pushFrame(aFrame);
    }
  }
}
