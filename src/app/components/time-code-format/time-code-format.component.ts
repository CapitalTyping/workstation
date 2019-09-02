import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TIME_CODE_VIEW } from '@utilities/const/editor/time-code-format.const';
import { ContentHelper } from '@tran/helpers/content/content.helper';

@Component({
  selector: 'app-time-code-format',
  templateUrl: './time-code-format.component.html',
  styleUrls: ['./time-code-format.component.scss']
})
export class TimeCodeFormatComponent implements OnInit {
  currTimeCode: number;
  timeCodeView = TIME_CODE_VIEW;

  @Output() emitSelectTimeFormat = new EventEmitter<number>();

  constructor(
      private contentHlp: ContentHelper,
  ) { }

  ngOnInit() {
    this.currTimeCode = this.contentHlp.currTimeCodeFormat;
  }

  onSelectTimeCodeFormat(ev) {
    if (ev.value) {
      this.contentHlp.setTimeCodeFormat(ev.value);
    }
  }
}
