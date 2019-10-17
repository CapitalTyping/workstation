import { IRecognizeParams, IUser } from '@tran/interfaces';

export interface ITaskMedia {
  title: string,
  url: string,
  type: 'video' | 'audio',
  recognizeType: 'long' | 'default'
  params: IRecognizeParams,
  transcription: string,
  status_name: string,
  status: number
}

export interface ITask {
  title: string,
  description: string,
  media: ITaskMedia[]
}

export interface ISessionDetails {
  user: IUser
  task: ITask
}
