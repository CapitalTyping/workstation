import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { EditTagComponent } from '@components/tags/edit-tag/edit-tag.component';
import { EditorService } from '@services/html-editor/editor.service';
import { ITag, ITagSection, ITagSectionSegment } from '@tran/interfaces';
import { PlayerService } from '@services/player/player.service';
import { TagsService } from '@services/tags/tags.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, OnDestroy {
  tags: ITag[] = [];

  sections: ITagSection[] = [];

  acts = {
    isLoading: true,
    isSectionsExpand: true,
  };

  constructor(
    private dialog: MatDialog,
    private tagsSvc: TagsService,
    private editorSvc: EditorService,
    private playerSvc: PlayerService,
  ) { }

  ngOnInit() {
    this.tagsSvc.$tags.pipe(untilDestroyed(this)).subscribe(tags => {
      if (tags) {
        this.tags = tags;
        console.log(this.tags);
        this.acts.isLoading = false;
      }
    });
    this.tagsSvc.$tagsSections.pipe(untilDestroyed(this)).subscribe((sections) => {
      if (sections && sections != null) {
        this.sections = sections;
      } else {
        this.sections = [];
      }
    });
  }

  openEditor() {
    const ref = this.dialog.open(EditTagComponent, {
      data: {
        tags: this.tags,
        sections: this.sections,
        done: () => { }
      }
    });
  }

  wrapInTag(tag: ITag) {
    this.tagsSvc.wrapInTag(tag);
  }

  removeSectionSegment(sectIndex: number, segmIndex: number, ev) {
    ev.stopPropagation();
    this.tagsSvc.removeSectionSegment(sectIndex, segmIndex);
  }

  setCurrentTimeToPlayer(segment: ITagSectionSegment) {
    this.playerSvc.setTime(+segment.time.start);
  }

  ngOnDestroy() { }
}
