import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ITask, ITaskMedia } from '@tran/interfaces';
import { TaskService } from '@services/task/task.service';
import { PlayerService } from '@services/player/player.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-menu-video',
  templateUrl: './menu-video.component.html',
  styleUrls: ['./menu-video.component.scss']
})
export class MenuVideoComponent implements OnInit, OnDestroy {
  @ViewChild('playerContainer') playerContainer;

  task: ITask;
  currMedia: ITaskMedia;

  constructor(
      private taskSvc: TaskService,
      private playerSvc: PlayerService,
  ) {
    this.taskSvc.$task.pipe(untilDestroyed(this)).subscribe(task => this.task = task);
    this.taskSvc.$currentMedia.pipe(untilDestroyed(this)).subscribe(media => this.currMedia = media);
  }

  ngOnInit() {
    this.playerSvc.$player.pipe(untilDestroyed(this)).subscribe(player => this.playerContainer.nativeElement.appendChild(player));
  }

  onSelectMedia(media: ITaskMedia) {
    this.taskSvc.selectMediaToWork(media);
  }

  ngOnDestroy() {}
}
