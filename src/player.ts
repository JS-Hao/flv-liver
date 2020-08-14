interface Player {}

interface PlayerConfig {
  container: HTMLDivElement; // need a dom container to initial the video
  url: string; // media data source url
}

export default class FlvLivePlayer implements Player {
  constructor(private config: PlayerConfig) {}
}
