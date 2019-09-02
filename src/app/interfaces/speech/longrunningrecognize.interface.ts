export interface ILongrunningrecognizeAfterInit {
  name: string,
}

export interface IWord {
  startTime: string, // "0.500s"
  endTime: string,
  word: string,
}

export interface IAlternative {
  confidence: number,
  transcript: string,
  words: IWord[],
}

export interface ISpeechResults extends Array<{alternatives: IAlternative[]}> {}

export interface ITranscriptionSubject {
  inProcess: boolean,
  processTitle?: string,
  data?: ISpeechResults
}

export interface ILongrunningrecognizeGetDetails {
  done: boolean,
  name: string
  metadata: {
    '@type': string,
    lastUpdateTime: string,
    progressPercent: number,
    startTime: string
  }
  response: {
    '@type': string,
    results: ISpeechResults,
  }
}


export interface ISpeechError {
  error: any,
  message: string,
}
