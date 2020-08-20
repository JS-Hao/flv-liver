import { VideoMsg, AudioMsg } from '../processor';

export type VFrame = Partial<VideoMsg['data']>;

export type AFrame = Partial<AudioMsg['data']>;

export interface Renderer {
  pushFrame(vFrame: VFrame, aFrame: AFrame): void;
}

export interface Config {
  hasVideo: boolean;
  hasAudio: boolean;
  $canvas: HTMLCanvasElement;
}
