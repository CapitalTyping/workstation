import { ILongrunningrecognizeGetDetails, ILongrunningrecognizeAfterInit, ISpeechResults } from '@tran/interfaces';

enum AudioEncoding {
  ENCODING_UNSPECIFIED,
  LINEAR16,
  FLAC,
  MULAW,
  AMR,
  AMR_WB,
  OGG_OPUS,
  SPEEX_WITH_HEADER_BYTE
}

enum InteractionType {
  INTERACTION_TYPE_UNSPECIFIED,
  DISCUSSION,
  PRESENTATION,
  PHONE_CALL,
  VOICEMAIL,
  PROFESSIONALLY_PRODUCED,
  VOICE_SEARCH,
  VOICE_COMMAND,
  DICTATION
}

enum MicrophoneDistance {
  MICROPHONE_DISTANCE_UNSPECIFIED,
  NEARFIELD,
  MIDFIELD,
  FARFIELD,
}

enum RecordingDeviceType {
  RECORDING_DEVICE_TYPE_UNSPECIFIED,
  SMARTPHONE,
  PC,
  PHONE_LINE,
  VEHICLE,
  OTHER_OUTDOOR_DEVICE,
  OTHER_INDOOR_DEVICE,
}

interface IRecognitionMetadata {
  interactionType: InteractionType,
  microphoneDistance: MicrophoneDistance,
  recordingDeviceType: RecordingDeviceType,
  recordingDeviceName: string, // 'Pixel 2 XL'
  industryNaicsCodeOfAudio: number, // (uint32 format)
}

export interface IRecognitionConfig {
  encoding?: AudioEncoding,
  sampleRateHertz?: number,
  languageCode?: string,
  maxAlternatives?: number,
  profanityFilter?: boolean,
  speechContexts?: {phrases: string[]}[],
  enableWordTimeOffsets?: boolean,

  // https://cloud.google.com/speech-to-text/docs/automatic-punctuation
  enableAutomaticPunctuation?: boolean,

  // https://cloud.google.com/speech-to-text/docs/multi-channel
  enableSeparateRecognitionPerChannel?: boolean,
  audioChannelCount?: number,

  // https://cloud.google.com/speech-to-text/docs/multiple-voices#speech-diarization-nodejs
  // ONLY FOR PHONE CALL model!
  enableSpeakerDiarization?: boolean,
  diarizationSpeakerCount?: number,

  // https://cloud.google.com/speech-to-text/docs/transcription-model
  model?: 'default' | 'command_and_search' | 'phone_call' | 'video',

  // https://cloud.google.com/speech-to-text/docs/enhanced-models
  useEnhanced?: boolean

  // https://cloud.google.com/speech-to-text/docs/recognition-metadata
  metadata?: IRecognitionMetadata,
}

export interface IRecognizeParams {
  config: IRecognitionConfig,

  // https://cloud.google.com/speech-to-text/docs/reference/rest/v1/RecognitionAudio
  audio: {
    uri?: string,
    content?: string // base64
  }
}

interface IAfterRecognize<T> {
  execute(fn: (res: T) => void): any
}

export interface IGoogleSpeechApi {
  client: {
    speech: {
      speech: {
        recognize(params: IRecognizeParams): IAfterRecognize<{results: ISpeechResults}>,
        longrunningrecognize(params: IRecognizeParams): IAfterRecognize<ILongrunningrecognizeAfterInit>,
      }
      operations: {
        get(params: ILongrunningrecognizeAfterInit): IAfterRecognize<ILongrunningrecognizeGetDetails>,
        list(): void,
      }
    }
    setApiKey(key: string): void,
    load(lib: string, v: string, callback: () => void): void,
  }
}
