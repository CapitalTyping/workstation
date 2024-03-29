import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ISessionDetails, ITask, ITaskMedia } from '@tran/interfaces';
import { ApiService } from '@services/api/api.service';
import { SpeechService } from '@services/speech/speech.service';
import { EditorService } from '@services/html-editor/editor.service';
import { PlayerService } from '@services/player/player.service';
import { SnackbarService } from '@services/snackbar/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  $task = new BehaviorSubject<ITask>(this.resetTask());

  private _currMedia: ITaskMedia = this.resetMedia();
  $currentMedia = new BehaviorSubject<ITaskMedia>(null);

  private _isPlaylistOpened = false;
  $isPlaylistOpened = new Subject<boolean>();

  constructor(
      private apiSvc: ApiService,
      private speechSvc: SpeechService,
      private editorSvc: EditorService,
      private playerSvc: PlayerService,
      private snackbarSvc: SnackbarService,
  ) {}

  getTaskDetails(): Observable<ISessionDetails> {
    return this.apiSvc.get('/details')
        .pipe(tap(details => {
          this.$task.next(details.task);
          this.selectMediaToWork(details.task.media[0]);
        }));
  }

  sendResult(): Observable<any> {
    console.log(this.editorSvc.getDelta());
    // return this.apiSvc.post('/result', this.editorSvc.getDelta());
    return new Observable(sub => {
      setTimeout(() => sub.next(), 900);
    });
  }

  selectMediaToWork(media: ITaskMedia) {
    if (this.speechSvc.isAvailable) {
      if (this._currMedia.title !== media.title) {
        this.$currentMedia.next(media);
        this.playerSvc.updContext(media.url);
        this.speechSvc.initRecognition(media, media.recognizeType);
        this._currMedia = media;
      }
    } else {
      this.snackbarSvc.openWarningSnackBar('Please wait few seconds, and try again.', 3000);
    }
  }

  emitTogglePlaylist() {
    this._isPlaylistOpened = !this._isPlaylistOpened;
    this.$isPlaylistOpened.next(this._isPlaylistOpened);
  }

  setAsClosedPlaylist() {
    this._isPlaylistOpened = false;
  }

  resetTask(): ITask {
    return {
      title: null,
      description: null,
      media: [],
    };
  }

  resetMedia(): ITaskMedia {
    return {
      title: null,
      url: null,
      type: null,
      recognizeType: null,
      params: null,
      transcription: null,
    };
  }
}
