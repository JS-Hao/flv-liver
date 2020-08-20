import { IO } from './types';
import StreamLoader from './stream-loader';

export { IO };

export default function ({ customLoader }: { customLoader?: IO }) {
  if (customLoader) {
    return customLoader;
  } else {
    return new StreamLoader();
  }
}
