import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { ITag, ITagSection } from '@tran/interfaces';
import { TagsService } from '@services/tags/tags.service';
import { KEY_CODE } from '@utilities/const/common/key-codes.const';
import { FindHelper } from '@tran/helpers/find/find.helper';

@Component({
  selector: 'app-edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrls: ['./edit-tag.component.scss']
})
export class EditTagComponent implements OnInit {
  tags: ITag[] = [];
  sections: ITagSection[] = [];
  currTag: ITag = this.resetTag();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private tagsSvc: TagsService,
    private findHlp: FindHelper,
  ) { }

  ngOnInit() {
    this.tags = this.data.tags;
    this.sections = this.data.sections;
  }

  addCurrentTag() {
    if (this.currTag.title) {
      this.currTag.id = this.tags.length ? this.tags[this.tags.length - 1].id + 1 : 1;
      this.tags.push(this.currTag);
      this.tagsSvc.saveTagsInStore(this.tags);
      this.currTag = this.resetTag();
    }
  }

  applyChanges() {
    if (!this.currTag.title || !this.currTag.title.trim().length) return;

    // upd tags
    const existedTag = this.tags[this.findHlp.indexOfBy(this.tags, 'id', this.currTag)];
    existedTag.title = this.currTag.title;

    // upd wrapped elems styles if it has changed
    if (existedTag.textColor !== this.currTag.textColor || existedTag.fillColor !== this.currTag.fillColor) {
      const sectionIndex = this.getSectionIndex(existedTag.id);
      if (this.sections[sectionIndex] && this.sections[sectionIndex].hasOwnProperty('segments')) {
        this.sections[sectionIndex].segments.forEach(segm => this.tagsSvc.applyStyleToElems(segm.time, this.currTag));
      }
      existedTag.textColor = this.currTag.textColor;
      existedTag.fillColor = this.currTag.fillColor;
    }
    this.tagsSvc.saveTagsInStore(this.tags);
    this.currTag = this.resetTag();
    // upd sections
    // this.tagsSvc.fetchSections(this.sections);
  }

  markAsInUse(tag: ITag) {
    tag.isSelected = !tag.isSelected;
    this.tagsSvc.saveTagsInStore(this.tags);
  }

  editTag(tag: ITag, ev) {
    ev.stopPropagation();
    this.currTag = { ...tag };
  }

  private getSectionIndex(tagId: number) {
    let tagSectionIndex = -1;
    this.sections.some((section, i) => {
      if (section.tag.id === tagId) {
        tagSectionIndex = i;
        return true;
      }
    }
    );
    return tagSectionIndex;
  }

  removeTag() {
    // clear section
    const sectionIndex = this.getSectionIndex(this.currTag.id);
    if (sectionIndex >= 0) {
      const length = this.sections[sectionIndex].segments.length;
      for (let i = 0; i < length; i++) {
        this.tagsSvc.removeSectionSegment(sectionIndex, 0);
      }
    }
    // remove tag
    const tagIndex = this.findHlp.indexOfBy(this.tags, 'id', this.currTag);
    this.tags.splice(tagIndex, 1);
    this.tagsSvc.saveTagsInStore(this.tags);
    this.currTag.id = null;
    // upd filter pipe
    const title = this.currTag.title;
    this.currTag.title = title + ' ';
    setTimeout(() => this.currTag.title = title, 4);
  }

  onKeyUp(ev: KeyboardEvent) {
    if (ev.keyCode === KEY_CODE.SPACE && !this.currTag.title.trim().length) return this.currTag.title = '';
    if (ev.keyCode === KEY_CODE.ENTER && this.currTag.title.trim().length) return this.addCurrentTag();
  }

  private resetTag(): ITag {
    return {
      id: null,
      title: '',
      fillColor: '',
      textColor: '',
      isSelected: true,
    };
  }
}
