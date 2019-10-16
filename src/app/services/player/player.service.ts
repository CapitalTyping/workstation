import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const CONST = {
  VOLUME: 1,
  SKIP_SEC: 5,
  PLAYBACK_SPEED_STEP: 0.1,
  PLAYBACK_SPEED_MIN: 0.2, // MDN min 0.2
  PLAYBACK_SPEED_MAX: 16, // MDN max 16
};


@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private _player: HTMLMediaElement;

  $player = new BehaviorSubject<HTMLMediaElement>(null);
  $currentTime = new BehaviorSubject<number>(0);

  private tempData = {
    prevVolume: CONST.VOLUME,
  };

  constructor() { }

  // pass global player from MediaPlayerComponent
  registerPlayer(rendered: HTMLMediaElement) {
    this._player = rendered;
    this._player.volume = CONST.VOLUME;
    this._player.addEventListener('timeupdate', () => this.$currentTime.next(this._player.currentTime));
    this.$player.next(this._player);
  }

  updContext(url: string) {
    if (this._player.currentSrc !== url) {
      this._player.src = url;
      this.$currentTime.next(0);
    }
  }

  play() {
    this._player.play();
  }

  togglePlay() {
    this._player.paused ? this._player.play() : this._player.pause();
  }

  stop() {
    this._player.pause();
    this._player.currentTime = 0;
  }

  skip(isForward: boolean) {
    const currTime = this._player.currentTime;
    this._player.currentTime = isForward ? currTime + CONST.SKIP_SEC : currTime - CONST.SKIP_SEC;
  }

  changeSpeed(isIncrease: boolean) {
    const currSpeed = this._player.playbackRate;
    if (isIncrease) {
      this._player.playbackRate = (currSpeed < CONST.PLAYBACK_SPEED_MAX)
        ? +(currSpeed + CONST.PLAYBACK_SPEED_STEP).toFixed(1)
        : CONST.PLAYBACK_SPEED_MAX;
    } else {
      this._player.playbackRate = (currSpeed > CONST.PLAYBACK_SPEED_MIN)
        ? +(currSpeed - CONST.PLAYBACK_SPEED_STEP).toFixed(1)
        : CONST.PLAYBACK_SPEED_MIN;
    }
  }

  setTime(val: number) {
    this._player.currentTime = val;
  }

  setVolume(val: number) {
    this._player.volume = val;
  }

  toggleMute() {
    if (this._player.volume) {
      this.tempData.prevVolume = this._player.volume;
      this._player.volume = 0;
    } else {
      this._player.volume = this.tempData.prevVolume;
    }
  }
}
