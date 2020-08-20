import { AFrame } from './types';

export default class ConsumerAudio {
  pushFrame(frame: AFrame) {
    console.log('audio frame', frame);
  }
}
