import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly _isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this._isBrowser = isPlatformBrowser(this.platformId);
  }

  setItem(key: string, data: any) {
    this._isBrowser && window.localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
  }

  private getItemUnparsed(key: string): string {
    return this._isBrowser && window.localStorage.getItem(key) || null;
  }

  getItem<T>(key: string): T {
    return this.getItemUnparsed(key) && JSON.parse(this.getItemUnparsed(key)) || null;
  }

  removeItem(key: string) {
    this._isBrowser && window.localStorage.removeItem(key);
  }
}
