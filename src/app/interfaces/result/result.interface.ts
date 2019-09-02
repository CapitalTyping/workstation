export interface IResult {
  [index: number]: {
    insert: string,
    attributes: {
      background: string,
      color: string,
      start: string,
      end: string
    }
  }
}
