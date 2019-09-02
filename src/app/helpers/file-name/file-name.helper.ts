import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileNameHelper {

  constructor() { }

  prepareTitleFromUrl(url: string): string {
    if (url) {
      const partsArr = (url || '').split('/');
      return partsArr[partsArr.length - 1];
    }
    return '';
  }
}
