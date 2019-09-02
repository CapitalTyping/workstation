import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ISpeaker, ISpeakerEditorData } from '@tran/interfaces';
import { ContentHelper } from '@tran/helpers/content/content.helper';
import { SPEAKER } from '@utilities/const/editor/blots.const';
import { KEY_CODE } from '@utilities/const/common/key-codes.const';
import { FindHelper } from '@tran/helpers/find/find.helper';

@Component({
  selector: 'app-edit-speaker',
  templateUrl: './edit-speaker.component.html',
  styleUrls: ['./edit-speaker.component.scss']
})
export class EditSpeakerComponent implements OnInit, OnDestroy {
  speakerElem: HTMLElement;
  existedSpeakers: ISpeaker[] = [];
  speakerElms: HTMLElement[] = [];
  currSpeaker: ISpeaker = this.resetSpeaker();

  constructor(
      // private dialogRef: MatDialogRef<EditSpeakerComponent>,
      @Inject(MAT_DIALOG_DATA) public data: ISpeakerEditorData,
      private contentHlp: ContentHelper,
      private findHlp: FindHelper,
  ) {}

  ngOnInit() {
    this.speakerElem = this.data.speakerElem;
    this.existedSpeakers = this.data.speakers;
    this.speakerElms = document.querySelectorAll(`${SPEAKER.TAG_NAME}[data-id='${this.speakerElem.dataset.id}']`) as any;
  }

  onSelectSpeaker(selectedSpeaker: ISpeaker) {
    this.updSpeakerAttrs(this.speakerElem, selectedSpeaker);
  }

  renameEachSpeaker(selectedSpeaker: ISpeaker, ev) {
    ev.stopPropagation();
    this.speakerElms.forEach((el: HTMLElement) => this.updSpeakerAttrs(el, selectedSpeaker));
  }

  private updSpeakerAttrs(elem: HTMLElement, selectedSpeaker: ISpeaker) {
    // set title
    elem.innerText = this.contentHlp.prepareSpeakerTitle(selectedSpeaker.title, elem.dataset.start);
    // upd id (because it's same name now)
    elem.dataset.id = selectedSpeaker.id;
  }

  addCurrentSpeaker() {
    if (this.currSpeaker.title) {
      this.currSpeaker.id = this.existedSpeakers[this.existedSpeakers.length - 1].id + 1;
      this.existedSpeakers.push(this.currSpeaker);
      // this.tagsSvc.saveTagsInStore(this.tags);
      this.currSpeaker = this.resetSpeaker();
    }
  }

  applyChanges() {
    if (!this.currSpeaker.title || !this.currSpeaker.title.trim().length) return;

    const index = this.findHlp.indexOfBy(this.existedSpeakers, 'id', this.currSpeaker);
    this.existedSpeakers[index] = {...this.currSpeaker};
    // this.tagsSvc.saveTagsInStore(this.tags);
    this.currSpeaker = this.resetSpeaker();
  }

  removeSpeaker() {
    const index = this.findHlp.indexOfBy(this.existedSpeakers, 'id', this.currSpeaker);
    this.existedSpeakers.splice(index, 1);
    // this.tagsSvc.saveTagsInStore(this.tags);
    this.currSpeaker.id = null;
    // upd filter pipe
    const title =  this.currSpeaker.title;
    this.currSpeaker.title = title + ' ';
    setTimeout(() => this.currSpeaker.title = title, 4);
  }

  editSpeaker(tag: ISpeaker, ev) {
    ev.stopPropagation();
    this.currSpeaker = {...tag};
  }



  onKeyUp(ev: KeyboardEvent) {
    if (ev.keyCode === KEY_CODE.SPACE && !this.currSpeaker.title.trim().length) return this.currSpeaker.title = '';
    if (ev.keyCode === KEY_CODE.ENTER && this.currSpeaker.title.trim().length) return this.addCurrentSpeaker();
  }

  resetSpeaker(): ISpeaker {
    return {
      title: '',
      id: null
    };
  }
  ngOnDestroy() {}
}
