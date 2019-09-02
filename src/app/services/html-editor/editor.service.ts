import { Injectable } from '@angular/core';

import IDelta from 'quill-delta/dist/Delta';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  quill;

  constructor() { }

  getDelta(): IDelta {
    return this.quill.getContents(0, this.quill.getLength());
  }
}
