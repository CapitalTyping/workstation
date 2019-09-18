import { Injectable } from '@angular/core';
import { BehaviorSubject, config, Subject } from 'rxjs';

// import gapi from '@tran/utilities/libs/google/client-api.js';

import { AppConfig } from '@tran/app.config';

import {
  IAlternative,
  IGoogleSpeechApi,
  ILongrunningrecognizeAfterInit,
  IRecognizeParams,
  ISpeechError,
  ISpeechResults,
  ITaskMedia, ITranscriptionSubject
} from '@tran/interfaces';
// import mockAudio from '@assets/static/audio.flac.ts';
import example from '@assets/static/translate';
import { SnackbarService } from '@services/snackbar/snackbar.service';
import { AudioConverterService } from '@services/audio-converter/audio-converter.service';

const Processes = {
  CONVERT_AUDIO: 'Preparing media for recognition. Please wait ...',
  RECOGNITION: 'Speech recognition in process. Please wait ...',
};

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  // gapi: IGoogleSpeechApi = gapi || (window as any).gapi || {};
  gapi: IGoogleSpeechApi = (window as any).gapi || {};
  transcription$ = new BehaviorSubject<ITranscriptionSubject>({ inProcess: false });

  private _intervalId;
  isAvailable = true;

  constructor(
    private snackbarSvc: SnackbarService,
    private audioConverterSvc: AudioConverterService,
  ) {
    // this.gapi.client.setApiKey(AppConfig.googleApi.speechKey);
    // this.passExample();
  }

  setGapiResponseToEditor(response) {
    alert('ss');
    this.transcription$.next({ inProcess: false, data: response.results || [] });
  }

  initRecognition(media: any, recognizeType: ITaskMedia['recognizeType']) {
    console.log(media);
    if (!this.isAvailable) return;
    this.transcription$.next({ inProcess: false, data: media.params });
    // stop previous requests
    // this._intervalId && clearInterval(this._intervalId);
    // this.updIsAvailableStatus(false);

    // const params = media.params;
    // const audio = media.params.audio;

    // if (audio && audio.content || audio && audio.uri && /(gs:\/\/)/.test(audio.uri)) {
    //   this.gapi.client.load('speech', 'v1', () => this.sendBytesToSpeech(params, recognizeType));
    // } else {
    //   // prepare content for google api from external file
    //   this.transcription$.next({ inProcess: true, processTitle: Processes.CONVERT_AUDIO });
    //   this.audioConverterSvc.convertExternalFile(media.url, media.type)
    //     .then(base64 => {
    //       params.audio = { content: base64 };
    //       // this.gapi.client.load('speech', 'v1', () => this.sendBytesToSpeech(params, recognizeType));
    //     })
    //     .catch(err => {
    //       this.transcription$.next({ inProcess: false });
    //       this.snackbarSvc.openErrorSnackBar(err.message);
    //     });
    // }
  }

  /**
   * Sends post data to the speech API endpoint
   * https://cloud.google.com/speech-to-text/docs/tutorials
   *
   * Also config described in IRecognizeParams interface file
   *
   */
  private sendBytesToSpeech(params: IRecognizeParams, recognizeType: ITaskMedia['recognizeType'] = 'long') {
    this.transcription$.next({ inProcess: true, processTitle: Processes.RECOGNITION });
    // const params: IRecognizeParams = {
    //   config: {
    //     model: 'default',
    //     // encoding: 1,
    //     // sampleRateHertz: 8000,
    //     languageCode: 'en-US',
    //     enableWordTimeOffsets: true,
    //     // speechContexts: [
    //     //   {
    //     //     phrases: []
    //     //   }
    //     // ],
    //   },
    //   audio: {
    //     // uri: 'https://drive.google.com/file/d/1bRRLF9u7DMiILgEzWW6inJGQHDw3BcKG/view?usp=sharing',
    //     // uri: 'gs://cloud-samples-tests/speech/commercial_mono.wav',
    //     // 'uri': 'gs://gcs-test-data/vr.flac',
    //     content: mockAudio
    //   }
    // };
    if (recognizeType === 'long') {
      this.gapi.client.speech.speech.longrunningrecognize(params).execute((res: ILongrunningrecognizeAfterInit & ISpeechError) => {
        if (res.name) {
          console.log('recognition registered as ', res.name);
          this._intervalId = setInterval(() => this.getLongRunResult(res), 4000);
          // this._intervalId = this.getLongRunResult(res);
        } else if (res.error) {
          this.transcription$.next({ inProcess: false });
          this.snackbarSvc.openErrorSnackBar(res.message);
          console.error(res);
        }
        this.updIsAvailableStatus(true);
      });
    } else {
      this.gapi.client.speech.speech.recognize(params).execute((res: { results: ISpeechResults } & ISpeechError) => {
        if (res.results) {
          this.transcription$.next({ inProcess: false, data: res.results || [] });
        } else if (res.error) {
          this.transcription$.next({ inProcess: false });
          this.snackbarSvc.openErrorSnackBar(res.message);
          console.error(res);
        }
        this.updIsAvailableStatus(true);
      });
    }
  }

  private getLongRunResult(resp: ILongrunningrecognizeAfterInit) {
    this.gapi.client.speech.operations.get(resp).execute((r) => {
      if (r.done) {
        console.log('done', r);
        this.transcription$.next({ inProcess: false, data: r.response.results || [] });
        this._intervalId && clearInterval(this._intervalId);
      }
    });
  }

  private updIsAvailableStatus(isAvailable: boolean) {
    this.isAvailable = isAvailable;
  }

  private passExample() {
    this.transcription$.next({ inProcess: false, data: example.response.results });
  }
}
