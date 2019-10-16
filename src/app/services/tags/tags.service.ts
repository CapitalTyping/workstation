import { Injectable } from '@angular/core';
import { ApiService } from '@services/api/api.service';
import { BehaviorSubject } from 'rxjs';
import IDelta from 'quill-delta/dist/Delta';

import { ITag, ITagSection, ITagSectionSegment, ITagSegmentTime, ITimeDataset } from '@tran/interfaces';
import { StorageService } from '@services/storage/storage.service';
import { COLOR } from '@tran/utilities';
import { SPEAKER, WORD } from '@utilities/const/editor/blots.const';
import { ContentHelper } from '@tran/helpers/content/content.helper';

interface ITagConfig {
  getAll: boolean,
  available: ITag[]
}

interface IStyle {
  fillColor: string,
  textColor: string,
}

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  $tags = new BehaviorSubject<ITag[]>(null);

  private _sections: ITagSection[] = [];
  $tagsSections = new BehaviorSubject<ITagSection[]>(this._sections);

  private _selectedDeltaOps: IDelta['ops'];

  constructor(
    private apiSvc: ApiService,
    private storageSvc: StorageService,
    private contentHlp: ContentHelper,
  ) {
    this.contentHlp.currTimeCodeFormat$.subscribe(() => this.onChangedTimeCodeFormat());
  }

  // fetchTags(config: ITagConfig) {
  fetchTags(tags: any) {
    this.$tags.next(tags);
    // this.apiSvc.get('/tags').subscribe(tagss => this.$tags.next(tagss));
    // if (config.getAll) {
    //   localStorage.tags
    //       ? this.$tags.next(this.storageSvc.getItem<ITag[]>('tags'))
    //       : this.apiSvc.get('/tags').subscribe(tags => this.$tags.next(tags));
    // } else {
    //   this.$tags.next(config.available);
    // }
  }

  setTags(tags) {
    console.log(tags);
    this.$tags.next(tags);
  }

  // fetchSections(sections: ITagSection[]) {
  fetchSections(sections: any) {
    if (sections == null) {
      sections = [];
    } else {
      sections = JSON.parse(sections);
    }
    this._sections = sections;
    this.$tagsSections.next(this._sections);

  }

  saveTagsInStore(tags: ITag[]) {
    this.storageSvc.setItem('tags', tags);
  }

  setSelectedDeltaOps(ops: IDelta['ops']) {
    this._selectedDeltaOps = ops;
  }

  wrapInTag(tag: ITag) {
    if (this._selectedDeltaOps && this._selectedDeltaOps.length) {
      let content = '';
      const time: ITagSegmentTime = { start: null, end: null, insert: null };
      this._selectedDeltaOps.forEach(wordData => {

        content += wordData.insert[SPEAKER.BLOT_NAME] ? '' : wordData.insert;
        if (wordData.attributes && wordData.attributes[WORD.BLOT_NAME]) {
          const wordTime = wordData.attributes[WORD.BLOT_NAME];
          if (!time.start) time.start = wordTime.start;
          if (wordTime.end) time.end = wordTime.end;
        }
      });
      if (time.start) {
        this.prepareTimeInsert(time);
        const segment: ITagSectionSegment = { content, time };
        const section = this._sections.find(sec => sec.tag.id === tag.id);
        if (section) {
          section.segments.push(segment);
        } else {
          this._sections.push({ tag, segments: [segment] });
        }
        this.applyStyleToElems(time, tag);
        this.$tagsSections.next(this._sections);
      }
    }
  }

  applyStyleToElems(time: ITimeDataset, style: IStyle) {
    const words: HTMLElement[] = document.querySelectorAll(`.${WORD.CSS_CLASS_NAME}`) as any;
    words.forEach(el => {
      if (+el.dataset.start >= +time.start && +el.dataset.end <= +time.end) {
        el.style.background = style.fillColor;
        el.style.color = style.textColor;
      }
    });
  }

  removeSectionSegment(sectIndex: number, segmIndex: number) {
    const section: ITagSection = this._sections[sectIndex];
    const time = section.segments[segmIndex].time;

    this.applyStyleToElems(time, { fillColor: COLOR.BACKGROUND, textColor: COLOR.TEXT });

    if (section.segments.length > 1) {
      section.segments.splice(segmIndex, 1);
    } else {
      this._sections.splice(sectIndex, 1);
    }

    this.$tagsSections.next(this._sections);
  }

  prepareTimeInsert(time: ITagSegmentTime) {
    const startTime = this.contentHlp.getTimeFormat(time.start);
    time.insert = time.start === time.end ? startTime : startTime + ' - ' + this.contentHlp.getTimeFormat(time.end);
  }

  private onChangedTimeCodeFormat() {
    this._sections.length && this._sections.forEach(sect => {
      sect.segments.forEach(seg => {
        this.prepareTimeInsert(seg.time);
      });
    });
  }
}
