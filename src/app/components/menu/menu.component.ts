import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '@services/task/task.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import * as download from 'downloadjs';
import { SnackbarService } from '@tran/services/snackbar/snackbar.service';

type CurrentContent = 'notes' | 'messages' | 'video' | 'shortcut' | 'settings' | 'playlist';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  currContent: CurrentContent;
  currMedia: any;
  acts = {
    isNavActive: false,
    isCanHover: true,
    isAccord1Active: false,
    isAccord2Active: false,
  };
  taskFileUrl: any;
  @HostListener('mouseenter') openMenu() { this.acts.isNavActive = true; }

  constructor(
    private taskSvc: TaskService,
    private snackbarSvc: SnackbarService
  ) {
    this.taskSvc.$isPlaylistOpened.pipe(untilDestroyed(this)).subscribe(isOpened => this.onTogglePlaylist(isOpened));
    this.taskSvc.$taskFileUrl.pipe(untilDestroyed(this)).subscribe(file => this.taskFileUrl = file);
  }

  ngOnInit() { }

  onCloseMenu() {
    this.acts.isNavActive = false;
    this.acts.isAccord1Active = false;
    this.acts.isAccord2Active = false;
    this.currContent = null;
    this.taskSvc.setAsClosedPlaylist();
  }

  onSelectContent(contentName: CurrentContent) {
    this.acts.isNavActive = true;
    this.currContent = contentName;
    contentName !== 'playlist' && this.taskSvc.setAsClosedPlaylist();
  }

  onToggleAccordion(accordionName) {
    this.acts.isNavActive = true;
    this.acts[accordionName] = !this.acts[accordionName];
  }

  onTogglePlaylist(isOpened: boolean) {
    this.onSelectContent(isOpened ? 'playlist' : null);
  }

  ngOnDestroy() { }

  exportWordFile() {
    if (this.taskFileUrl) {
      download(this.taskFileUrl);
    } else {
      this.snackbarSvc.openWarningSnackBar('Please save data to export it');
    }
  }
}
