import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '@services/task/task.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

type CurrentContent = 'notes' | 'messages' | 'video' | 'shortcut' | 'settings' | 'playlist';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  currContent: CurrentContent;

  acts = {
    isNavActive: false,
    isCanHover: true,
    isAccord1Active: false,
    isAccord2Active: false,
  };

  @HostListener('mouseenter') openMenu() { this.acts.isNavActive = true; }

  constructor(
      private taskSvc: TaskService,
  ) {
    this.taskSvc.$isPlaylistOpened.pipe(untilDestroyed(this)).subscribe(isOpened => this.onTogglePlaylist(isOpened));
  }

  ngOnInit() {}

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

  ngOnDestroy() {}
}
