import { Renderer, Config } from './types';
import DefaultRenderer from './renderer-default';
// import MseRenderer from './renderer-mse';

export { Renderer };

export default function getRenderer(config: Config): Renderer {
  return new DefaultRenderer(config);
}
