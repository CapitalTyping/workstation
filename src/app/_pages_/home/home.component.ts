import { Component, NgZone, OnInit } from '@angular/core';

import { SpeechService } from '@services/speech/speech.service';
import {
  ISpeechResults,
  ITimeContainer,
  ITranscriptionSubject
} from '@tran/interfaces';
import { ContentHelper } from '@tran/helpers/content/content.helper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  transcription: ISpeechResults;
  editorContent;
  timestampArr: ITimeContainer[] = [];

  acts = {
    isRecognitionInProcess: false,
    isRecognitionProcessTitle: '',
    isAudioConverting: false,
  };

  constructor(
      private speechSvc: SpeechService,
      private zone: NgZone,
      private editorHlp: ContentHelper,
  ) {
  }

  ngOnInit() {
    // if no speech service check gapi !!!
    this.speechSvc.transcription$.subscribe((subData: ITranscriptionSubject) => this.onGetData(subData));
  }

  private onGetData(subData: ITranscriptionSubject) {
    if (!subData.inProcess && subData.data) {
      this.transcription = subData.data;
      this.timestampArr = [];
      this.editorContent = this.editorHlp.prepareContent(this.transcription, this.timestampArr);
    }
    this.zone.run(() => {
      this.acts.isRecognitionInProcess = subData.inProcess;
      this.acts.isRecognitionProcessTitle = subData.processTitle;
    });
  }
}
