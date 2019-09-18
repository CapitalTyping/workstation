import { Injectable } from '@angular/core';
import {
  IAlternative,
  ILongrunningrecognizeGetDetails,
  ISpeechResults,
  ITimeContainer,
  ITimeDataset,
  IWord
} from '@tran/interfaces';
import { TIME_CODE_FORMAT } from '@utilities/const/editor/time-code-format.const';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentHelper {
  timestampArr: ITimeContainer[];
  currTimeCodeFormat: number = TIME_CODE_FORMAT['0.000'];
  currTimeCodeFormat$ = new BehaviorSubject<number>(this.currTimeCodeFormat);

  constructor() { }

  /**
   * NOTE!!!!! Templates should be registered and duplicates as Blots in Quill editor
   * Also if add innerText it length should be equal to length of template innerText!!!
   *
   * @param transcription
   * @param timestampArr
   */
  prepareContent(transcription: ISpeechResults, timestampArr: ITimeContainer[]) {
    this.timestampArr = timestampArr;
    const content = transcription.reduce((acc, res, i) => acc + this.prepareContainer(res.alternatives[0], i), '');
    console.log(content);
    return content || `Speech api didn't recognize any word...`;
  }

  private prepareContainer(section: IAlternative, index) {
    if (!section.words || section.words && !section.words.length) return '';
    const firstWord = section.words[0];
    const lastWord = section.words[section.words.length - 1];

    // prepare container temp data
    const container: ITimeContainer = {
      start: this.normalizeStamp(firstWord.startTime),
      words: []
    };
    this.timestampArr.push(container);

    const speakerTitle = this.prepareSpeakerTitle('Speaker ' + (index % 2 ? 2 : 1), this.normalizeStamp(firstWord.startTime));
    return `
         <x-h1 
             contenteditable="false"
             data-id="${index % 2 ? 2 : 1}"
             data-title="${speakerTitle}" 
             data-start="${this.normalizeStamp(firstWord.startTime)}" 
             data-end="${this.normalizeStamp(firstWord.endTime)}"
             >${ speakerTitle}</x-h1>
<p>

           ${section.words.reduce((acc, w, i) => acc + this.prepareWords(container, w, i, section), '')}
           </p>
    `;
  }

  private prepareWords(container: ITimeContainer, currWordData: IWord, i, section: IAlternative) {
    const dataSet: ITimeDataset = {
      start: this.normalizeStamp(currWordData.startTime),
      end: this.normalizeStamp(currWordData.endTime),
    };
    container.words.push(dataSet);

    const nextWordData = section.words[i + 1];

    if (nextWordData) {
      const spaceDataSet: ITimeDataset = {
        start: this.normalizeStamp(currWordData.endTime),
        end: this.normalizeStamp(nextWordData.startTime),
      };
      container.words.push(dataSet);

      return `<span data-start="${dataSet.start}" data-end="${dataSet.end}">${currWordData.word}</span><span data-start="${spaceDataSet.start}" data-end="${spaceDataSet.end}"> </span>`;
    } else {
      return `<span data-start="${dataSet.start}" data-end="${dataSet.end}">${currWordData.word}</span>`;
    }

  }

  private normalizeStamp(value: string): string {
    return value.split('s')[0];
  }

  prepareSpeakerTitle(speakerName, time): string {
    return speakerName + ' - ' + this.getTimeFormat(time);
  }

  getTimeFormat(time) {
    switch (this.currTimeCodeFormat) {
      case TIME_CODE_FORMAT['0.000']:
        break;
      case TIME_CODE_FORMAT['00.00.00']:
        const minutes = (+time).toFixed(2);
        time = '00.' + (+minutes >= 10 ? minutes : '0' + minutes);
        break;
    }
    return time;
  }

  setTimeCodeFormat(codeEnum: number) {
    this.currTimeCodeFormat = codeEnum;
    this.currTimeCodeFormat$.next(codeEnum);
  }
}
