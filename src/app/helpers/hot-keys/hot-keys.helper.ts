import { Injectable } from '@angular/core';
import { KEY_CODE } from '@utilities/const/common/key-codes.const';

@Injectable({
  providedIn: 'root'
})
export class HotKeysHelper {

  constructor() { }

  isPlayStopCondition(ev: KeyboardEvent) {
    return ev.keyCode === KEY_CODE.SPACE && ev.shiftKey;
  }
}
