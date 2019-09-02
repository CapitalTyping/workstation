import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FindHelper {

  constructor() { }

  indexOfBy<T, P extends keyof T>(arr: T[], findBy: P, elem: T): number {
    let index = -1;
    arr.some((item, i) => {
      if (item[findBy] === elem[findBy]) {
        index = i;
        return true;
      }
    });
    return index;
  }
}
