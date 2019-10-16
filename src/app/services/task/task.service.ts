import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ISessionDetails, ITask, ITaskMedia } from '@tran/interfaces';
import { ApiService } from '@services/api/api.service';
import { SpeechService } from '@services/speech/speech.service';
import { EditorService } from '@services/html-editor/editor.service';
import { PlayerService } from '@services/player/player.service';
import { SnackbarService } from '@services/snackbar/snackbar.service';
import { TagsService } from '../tags/tags.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  $task = new BehaviorSubject<any>(this.resetMedia());
  $staff = new BehaviorSubject<any>(null);
  $admin = new BehaviorSubject<any>(null);
  $trackChange = new BehaviorSubject<any>(0);
  $token = new BehaviorSubject<any>(0);
  private _currMedia: ITaskMedia = this.resetMedia();
  $currentMedia = new BehaviorSubject<ITaskMedia>(null);
  $taskFileUrl = new BehaviorSubject<ITaskMedia>(null);

  private _isPlaylistOpened = false;
  $isPlaylistOpened = new Subject<boolean>();

  constructor(
    private apiSvc: ApiService,
    private speechSvc: SpeechService,
    private editorSvc: EditorService,
    private playerSvc: PlayerService,
    private snackbarSvc: SnackbarService,
    private tagSvc: TagsService,
  ) { }

  getTaskDetails(token): Observable<ISessionDetails> {

    return this.apiSvc.post(`/task-details`, { token: token })
      .pipe(tap(details => {
        this.$task.next(details.task);
        this.$staff.next(details.staff);
        this.$admin.next(details.admin);
        this.tagSvc.setTags(details.tags);
        this.$token.next(token);
        console.log(details.task.media[0].tagSection);
        this.tagSvc.fetchSections(details.task.media[0].tagSection);
        this.$taskFileUrl.next(details.task.media[0].taskFileUrl);
        this.selectMediaToWork(details.task.media[0]);
      }));
  }

  // getTaskDetails() {
  //   return this.apiSvc.get('/').pipe(tap(res => {
  //     return res;
  //   }));
  // }

  sendResult(): Observable<any> {
    console.log(this.editorSvc.getDelta());
    // return this.apiSvc.post('/result', this.editorSvc.getDelta());
    return new Observable(sub => {
      setTimeout(() => sub.next(), 900);
    });
  }

  selectMediaToWork(media: any) {
    if (this.speechSvc.isAvailable) {
      if (this._currMedia.title !== media.title) {
        this.$currentMedia.next(media);
        this.playerSvc.updContext(media.url);
        // this.speechSvc.setGapiResponseToEditor(media[0].params.response);
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

  saveTask(data) {
    return this.apiSvc.post(`/save-workstation-result`, data);
  }
}
