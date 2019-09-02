export interface ITimeDataset {
  start: string,
  end: string,
}

export interface ITimeContainer {
  start: string,
  words: ITimeDataset[],
}
