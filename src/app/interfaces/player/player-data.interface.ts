import { BehaviorSubject } from 'rxjs';

export interface IPlayerData {
  mediaElem: HTMLMediaElement,
  currentTime: BehaviorSubject<number>,
}
