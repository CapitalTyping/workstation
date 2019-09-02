import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITaskMedia } from '@tran/interfaces';
import { WavConverterService } from '@services/wav-converter/wav-converter.service';

@Injectable({
  providedIn: 'root'
})
export class AudioConverterService {
  context = new AudioContext();
  source = null;
  audioBuffer = null;
  audioContext = new((window as any).AudioContext || (window as any).webkitAudioContext)();

  constructor(
      private http: HttpClient,
      private wavSvc: WavConverterService,
  ) {}

  convertExternalFile(url: string, mediaType: ITaskMedia['type']): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(url, {responseType: 'arraybuffer'}).toPromise()
          .then(arrayBuffer => {
            mediaType === 'audio'
                ? resolve(this.audioBufferToBase64(arrayBuffer))
                : this.audioBufferFromVideo(arrayBuffer, resolve);
          })
          .catch(err => reject(err));
    });
  }

  private prepareAsArrayBuffer(blob: Blob) {
    console.log(blob);
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (progress: any) => {
        console.log(progress);
        this.initSound(progress.target.result, resolve);
      };
      reader.readAsArrayBuffer(blob);
    });
  }

  private audioBufferToBase64 (buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer);
    const len = buffer.byteLength;
    let binary = '';
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  audioBufferFromVideo(videoFileAsBuffer, resolve) {
    const sampleRate = 16000;
    const numberOfChannels = 1;
      this.audioContext.decodeAudioData(videoFileAsBuffer).then((decodedAudioData) => {

        const offlineAudioContext = new OfflineAudioContext(numberOfChannels, decodedAudioData.duration * sampleRate, sampleRate);
        offlineAudioContext.oncomplete = (event) => {
          const UintWave = this.wavSvc.createWaveFileData(event.renderedBuffer);
          const base64   = btoa(this.uint8ToString(UintWave));
          resolve(base64);

        };
        const soundSource = offlineAudioContext.createBufferSource();
        const myBuffer = decodedAudioData;
        soundSource.buffer = myBuffer;
        soundSource.connect(offlineAudioContext.destination);
        soundSource.start();

        offlineAudioContext.startRendering().then((renderedBuffer) => {
          // console.log(renderedBuffer); // outputs audiobuffer
          // this.initSound(renderedBuffer, resolve)
        }).catch( (err) => {
          console.log('Rendering failed: ' + err);
        });
      });
  }


  uint8ToString(buf) {
    let i, length, out = '';
    for (i = 0, length = buf.length; i < length; i += 1) {
      out += String.fromCharCode(buf[i]);
    }
    return out;
  }

  private base64ToBuffer (buffer) {
    const binary = window.atob(buffer);
    const arrayBuffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < buffer.byteLength; i++) {
      bytes[i] = binary.charCodeAt(i) & 0xFF;
    }
    return arrayBuffer;
  }

  private initSound(arrayBuffer, resolve) {
    console.log('done', arrayBuffer);
    const base64String = this.audioBufferToBase64(arrayBuffer);
    console.log('base64String', base64String);
    resolve(base64String);
    // const audioFromString = this.base64ToBuffer(base64String);
    // console.log('base64ToBuffer');
    //
    // this.context.decodeAudioData(audioFromString, (buffer) => {
    //   // audioBuffer is global to reuse the decoded audio later.
    //   console.log('decodeAudioData');
    //
    //   this.audioBuffer = buffer;
    // }, (e) => {
    //   console.log('Error decoding file', e);
    // });
  }


  stopSound() {
    if (this.source) {
      this.source.stop(0);
    }
  }

  playSound() {
    // this.source is global so we can call .stop() later.
    this.source = this.context.createBufferSource();
    this.source.buffer = this.audioBuffer;
    this.source.loop = false;
    this.source.connect(this.context.destination);
    this.source.start(0); // Play immediately.
  }
}
