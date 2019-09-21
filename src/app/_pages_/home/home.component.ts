import { Component, NgZone, OnInit } from '@angular/core';

import { SpeechService } from '@services/speech/speech.service';
import {
  ISpeechResults,
  ITimeContainer,
  ITranscriptionSubject
} from '@tran/interfaces';
import { ContentHelper } from '@tran/helpers/content/content.helper';
import { SnackbarService } from '@tran/services/snackbar/snackbar.service';

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
    isRecognitionInProcess: true,
    isRecognitionProcessTitle: '',
    isAudioConverting: false,
  };

  constructor(
    private speechSvc: SpeechService,
    private zone: NgZone,
    private editorHlp: ContentHelper,
    private snackbarSvc: SnackbarService,
  ) {
  }

  ngOnInit() {
    this.acts.isRecognitionInProcess = true;
    this.acts.isRecognitionProcessTitle = 'Processing';
    // if no speech service check gapi !!!
    this.speechSvc.transcription$.subscribe((subData: ITranscriptionSubject) => this.onGetData(subData));
  }

  private onGetData(subData: ITranscriptionSubject) {
    if (subData.data) {
      // this.transcription = subData.data;
      // this.timestampArr = [];
      // console.log(this.transcription);
      // this.editorContent = this.editorHlp.prepareContent(this.transcription, this.timestampArr);
      this.editorContent = subData.data['content'];
      subData.data['timestamp'].map(item => {
        this.timestampArr.push(item);
      });
    } else if (subData.hasOwnProperty('data') && !subData.data) {
      this.acts.isRecognitionInProcess = false;
      this.editorContent = '';
      this.snackbarSvc.openErrorSnackBar('No content found for this file', 6000);
    }
    // this.zone.run(() => {
    //   this.acts.isRecognitionInProcess = subData.inProcess;
    //   this.acts.isRecognitionProcessTitle = 'Processing';
    // });
  }

  setLoaderOff(event) {
    this.acts.isRecognitionInProcess = event;
  }
}
