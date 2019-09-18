import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { TaskService } from '@services/task/task.service';
import { PlayerService } from '@services/player/player.service';
import { ITaskMedia } from '@tran/interfaces';
import { FileNameHelper } from '@tran/helpers/file-name/file-name.helper';
import { HotKeysHelper } from '@tran/helpers/hot-keys/hot-keys.helper';

@Component({
  selector: 'app-audio-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('playerElem') playerElem;
  player: HTMLMediaElement;
  fileName: string;

  tempData = {
    currentTime: 0,
    speed: 1,
    volume: 1,
  };

  @HostListener('window:keyup', ['$event']) onKeyUp(ev: KeyboardEvent) {
    if (this.hotKeysHlp.isPlayStopCondition(ev)) this.onTogglePlay();
  }

  constructor(
    private taskSvc: TaskService,
    private playerSvc: PlayerService,
    private fileNameHlp: FileNameHelper,
    private hotKeysHlp: HotKeysHelper,
  ) {
    this.taskSvc.$task.pipe(untilDestroyed(this)).subscribe(task => task.media.length && this.initAudio(task.media[0]));
    this.taskSvc.$currentMedia.pipe(untilDestroyed(this)).subscribe((media: ITaskMedia) => media && this.updFileName(media.url));
    this.playerSvc.$currentTime.pipe(untilDestroyed(this)).subscribe(sec => this.tempData.currentTime = sec);
  }


  ngOnInit() {
    this.player = this.playerElem.nativeElement;
    this.player.addEventListener('volumechange', (ev: any) => {
      this.tempData.volume = ev.target.muted ? 0 : ev.target.volume;
    }, false);
    this.playerSvc.registerPlayer(this.playerElem.nativeElement);
  }

  initAudio(media: any) { // ITaskMedia
    console.log(media);
    this.fileName = media.title;
    this.playerSvc.updContext(media.url);
    this.player.load();
    // this.updFileName(media.url);
    // this.updFileName(media.title);
  }

  updFileName(url) {
    // this.fileName = this.fileNameHlp.prepareTitleFromUrl(url);
  }

  // updFileName(title) {
  //   this.fileName = title;
  // }

  onTogglePlay() {
    this.playerSvc.togglePlay();
  }

  onStop() {
    this.playerSvc.stop();
  }

  onSkip(isForward: boolean) {
    this.playerSvc.skip(isForward);
  }

  onChangeSpeed(isIncrease: boolean) {
    this.playerSvc.changeSpeed(isIncrease);
  }

  onSetTime(ev) {
    this.playerSvc.setTime(ev.value);
  }

  onSetVolume(ev) {
    this.playerSvc.setVolume(ev.value);
  }

  onToggleMute() {
    this.playerSvc.toggleMute();
  }

  onTogglePlaylist() {
    this.taskSvc.emitTogglePlaylist();
  }

  ngOnDestroy() { }
}
