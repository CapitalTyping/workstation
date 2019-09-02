import { Injectable } from '@angular/core';

import { SPEAKER } from '@utilities/const/editor/blots.const';
import { ContentHelper } from '@tran/helpers/content/content.helper';
import { FindHelper } from '@tran/helpers/find/find.helper';
import { ISpeaker } from '@tran/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SpeakerService {
  existedSpeakers: ISpeaker[] = [];

  constructor(
      private contentHlp: ContentHelper,
      private findHlp: FindHelper,
  ) {
    this.contentHlp.currTimeCodeFormat$.subscribe(() => this.onChangedTimeCodeFormat());
  }

  updExistedSpeakers(speakers) {
    this.existedSpeakers = speakers;
  }

  onChangedTimeCodeFormat() {
    const speakers = document.querySelectorAll(`${SPEAKER.TAG_NAME}`) as any;
    speakers.length && speakers.forEach(sp => {
      const i = this.findHlp.indexOfBy(this.existedSpeakers, 'id', {id: sp.dataset.id});
      sp.innerText = this.contentHlp.prepareSpeakerTitle(this.existedSpeakers[i].title, sp.dataset.start);
    });
  }
}
