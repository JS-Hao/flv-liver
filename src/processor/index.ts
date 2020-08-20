import DefaultProcessor from './default-processor';
import { Processor, AudioMsg, VideoMsg } from './types';

export { Processor, AudioMsg, VideoMsg };

export default function getProcessor(): Processor {
  return new DefaultProcessor();
}
