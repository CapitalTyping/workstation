export interface ISpeakerDataset {
  id: string,
  start: string,
}

export interface ISpeaker {
  id: string,
  title: string,
}

export interface ISpeakerEditorData {
  speakerElem: HTMLElement,
  speakers: ISpeaker[]
}
