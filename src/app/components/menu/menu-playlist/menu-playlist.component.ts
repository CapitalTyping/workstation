import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ITask, ITaskMedia } from '@tran/interfaces';
import { TaskService } from '@services/task/task.service';
import { PlayerService } from '@services/player/player.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { SnackbarService } from '@tran/services/snackbar/snackbar.service';

@Component({
  selector: 'app-menu-playlist',
  templateUrl: './menu-playlist.component.html',
  styleUrls: ['./menu-playlist.component.scss']
})
export class MenuPlaylistComponent implements OnInit, OnDestroy {
  @ViewChild('playerContainer') playerContainer;

  task: ITask;
  currMedia: ITaskMedia;
  player: HTMLMediaElement;
  trackChange = null;
  constructor(
    private taskSvc: TaskService,
    private playerSvc: PlayerService,
  ) {
    this.taskSvc.$task.pipe(untilDestroyed(this)).subscribe(task => this.task = task);
    this.taskSvc.$currentMedia.pipe(untilDestroyed(this)).subscribe(media => this.currMedia = media);
  }

  ngOnInit() {
    this.playerSvc.$player.pipe(untilDestroyed(this)).subscribe(player => {
      // this.playerContainer.nativeElement.appendChild(player);
      this.player = player;
    });
    this.taskSvc.$trackChange.subscribe(track => this.trackChange = track);
    console.log(this.task);
  }

  onTogglePlay(media: ITaskMedia) {
    // if (this.trackChange > 1) {

    // } else {

    // }
    if (this.currMedia.title === media.title) {
      this.playerSvc.togglePlay();
    } else {
      this.playerSvc.togglePlay();
      this.taskSvc.selectMediaToWork(media);
      this.playerSvc.play();
    }
  }

  ngOnDestroy() { }
}
