export { IAuth } from '@interfaces/auth/auth.interface';

export { IUser } from '@interfaces/user/user.interrface';

export { ITask, ISessionDetails, ITaskMedia } from '@interfaces/tasks/task.interface';

export { IRecognitionConfig, IRecognizeParams, IGoogleSpeechApi } from '@interfaces/speech/speech.interface';
export {
  ILongrunningrecognizeAfterInit,
  IWord,
  IAlternative,
  ILongrunningrecognizeGetDetails,
  ISpeechResults,
  ITranscriptionSubject,
  ISpeechError
}from '@interfaces/speech/longrunningrecognize.interface';

// player
export { IPlayerData } from '@interfaces/player/player-data.interface';

// editor
export { ITimeDataset, ITimeContainer } from '@interfaces/editor/editor.interface';
export { ITag, TAG, ITagSection, ITagSegmentTime, ITagSectionSegment } from '@interfaces/tags/tag.interface';
export { ISpeakerDataset, ISpeaker, ISpeakerEditorData } from '@interfaces/speakers/speaker.interface';

// components
export { ISnackbar } from '@interfaces/components/snackbar';

// result
export { IResult } from '@interfaces/result/result.interface';

// material
export { IMatSelectOption } from '@interfaces/material/select.interface';
