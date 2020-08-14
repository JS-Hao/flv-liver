export interface Fetcher {
  open(config: FetcherConfig): void;

  onDataAvailable(callback: Function): void;

  onComplete(callback: Function): void;
}

export interface FetcherConfig {
  url: string;
}
