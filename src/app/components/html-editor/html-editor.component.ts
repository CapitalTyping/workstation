import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';

import impQuill from 'quill';
const Quill: any = impQuill;  // Dirty hack to prevent property errors
// import Delta from 'quill-delta'; Don't use that way
const Delta: any = Quill.import('delta') as any;
import IDelta from 'quill-delta/dist/Delta';

const Parchment = Quill.import('parchment');
const BlotBlock = Quill.import('blots/block') as any;
const BlotInline = Quill.import('blots/inline') as any;

import { PlayerService } from '@services/player/player.service';
import { ISpeaker, ISpeakerEditorData, ITimeContainer, ITimeDataset, IWord } from '@tran/interfaces';
import { COLOR } from '@tran/utilities';
import { ContentHelper } from '@tran/helpers/content/content.helper';
import { SpeakerService } from '@services/speaker/speaker.service';
import { EditorService } from '@services/html-editor/editor.service';
import { SPEAKER, WORD } from '@utilities/const/editor/blots.const';
import { TagsService } from '@services/tags/tags.service';
import { KEY_CODE } from '@utilities/const/common/key-codes.const';
import { HotKeysHelper } from '@tran/helpers/hot-keys/hot-keys.helper';
import { EditSpeakerComponent } from '@components/speaker/edit-speaker/edit-speaker.component';
import { MatDialog } from '@angular/material';

interface IAttribute {
  name: string,
  value: string
}

interface IContainerArgs {
  start: string,
  end: string,
  attrs: IAttribute[],
}

enum DeltaOps {
  INSERT = 1
}

enum Leaf {
  TEXT_BLOT = 0,
  OFFSET
}

interface IContext {
  collapsed: boolean,
  empty: boolean,
  format: {[blotName: string]: DOMStringMap},
  offset: number,
  prefix: string,
  suffix: string,
}

const HIGHLIGHT = {
  DEFAULT_CSS: ` `,
  TEXT_COLOR: COLOR.TEXT_HIGHLIGHT,
};

const Support = {
  endOfBlinkLineMaxOffset: 1,
};

@Component({
  selector: 'app-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss']
})
export class HtmlEditorComponent implements OnInit, OnDestroy {
  @Input() editorContent = `<h3>Content...</h3>`;
  @Input() timestampArr: ITimeContainer[] = [];

  private quill: impQuill;
  public editorOptions: any = {
    // debug: 'info',
    placeholder: '...',
    readOnly: false,
    theme: 'snow',
    strict: false,
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{'color': []}, {'background': []}],
        [{'font': []}],
        [{'align': ['', 'center', 'right']}],
      ],
      // clipboard: {},
      keyboard: {
        bindings: {
          handleEnter: {
            key: KEY_CODE.ENTER,
            handler: this.handleEnter.bind(this, event)
          },
          // linebreak: {},
        }
      }
    },
    // formats: []
  };

  private styleElement: HTMLElement;
  private containers = [];
  private speakers: ISpeaker[] = [{title: 'SomeName', id: '3'}];
  private isPrevKeyCodeEnter;

  constructor(
      private el: ElementRef,
      private dialog: MatDialog,
      private playerSvc: PlayerService,
      private speakerSvc: SpeakerService,
      private editorSvc: EditorService,
      private editorContentHlp: ContentHelper,
      private tagsSvc: TagsService,
      private hotKeysHlp: HotKeysHelper,
  ) {}

  ngOnInit() {
    const Break = Quill.import('blots/break');
    Quill.register(Break);
    this.registerSpeaker();
    this.registerWord();
    this.createStyle();
    this.playerSvc.$currentTime.pipe(untilDestroyed(this)).subscribe(sec => this.checkIfNeedsStyle(sec));
  }

  private createStyle(): void {
    this.styleElement = document.createElement('style');
    this.styleElement.appendChild(document.createTextNode(HIGHLIGHT.DEFAULT_CSS));
    this.el.nativeElement.appendChild(this.styleElement);
  }

  private updHighlight(containerStart: string, dataset: ITimeDataset) {
    this.styleElement.innerText = `
    .word[data-start="${dataset.start}"] { 
        color:  ${COLOR.TEXT_HIGHLIGHT} !important;
        background-color: ${COLOR.BACKGROUND} !important;
    }
    `;
    // font-weight: 700 !important;

  }

  private checkIfNeedsStyle(sec) {
    if (sec) {
      const container: ITimeContainer = this.timestampArr[this.findIndex(this.timestampArr, sec)];
      container && this.updHighlight(container.start, container.words[this.findIndex(container.words, sec)]);
    } else {
      this.styleElement.innerText = HIGHLIGHT.DEFAULT_CSS;
    }
  }

  private findIndex(arr: {start: string}[], sec) {
    let index = 0;
    const lastIndex = arr.length - 1;
    (arr || []).some((stamp, i) => {
          if (stamp.start > sec) {
            index = i ? i - 1 : 0;
            return true;
          } else if (arr[lastIndex].start < sec) {
            index = lastIndex;
            return true;
          }
        }
    );
    return index;
  }

  private registerSpeaker() {
    const speakers = this.speakers;
    const onClickSpeaker = (ev) => this.dialog.open(EditSpeakerComponent, {
        data: {speakerElem: ev.target, speakers: speakers}
    });
    const prepareSpeakerTitle = (speakerName, time) => this.editorContentHlp.prepareSpeakerTitle(speakerName, time);
    const updSpeakers = () => this.speakerSvc.updExistedSpeakers(speakers);

    const BlotBlockc = Quill.import('blots/block/embed');

    class Speaker extends BlotBlockc {
      static create(dataset) {
        const node: HTMLElement = super.create(dataset);

        node.setAttribute('class', 'speaker');
        node.setAttribute('contenteditable', 'false');
        node.setAttribute('data-id', dataset.id);
        node.setAttribute('data-start', dataset.start);
        node.addEventListener('click', onClickSpeaker);


        // add if new
        if (!speakers.some(sp => sp.id === dataset.id)) {
          const id = dataset.id || +speakers[speakers.length - 1].id + 1;
          const speaker: ISpeaker = {title: 'Speaker ' + id, id: id};
          speakers.push(speaker);

          node.innerText = prepareSpeakerTitle(speaker.title, dataset.start);
        } else {
          speakers.some(sp => sp.id === dataset.id && (node.innerText = prepareSpeakerTitle(sp.title, dataset.start)) && true);
        }
        updSpeakers();
        // console.log('Speaker => ', node, dataset, speakers);
        return node;
      }

      static value(node) {
        return node.dataset;
      }

      // static formats (node, val) {
      //   console.log(node.dataset);
      //   return node;
      // }
    }

    Speaker.blotName = SPEAKER.BLOT_NAME;
    Speaker.tagName = SPEAKER.TAG_NAME;
    Quill.register(Speaker);
  }

  private registerWord() {
    class Word extends BlotInline {
      static create(dataset) {
        const node = super.create();

        node.setAttribute('data-start', dataset.start);
        node.setAttribute('data-end', dataset.end);
        node.setAttribute('class', WORD.CSS_CLASS_NAME);

        if (dataset.insert) {
          node.innerText = dataset.insert;
        }
        // console.log('Word => ', node, dataset);

        return node;
      }

      static formats(node) {
        return node.dataset;
      }
    }

    Word.blotName = WORD.BLOT_NAME;
    Word.tagName = WORD.TAG_NAME;
    Quill.register(Word);
  }

  /**
   * on press ENTER
   *
   * 1. When you click enter, but the last key you clicked before that was not enter, it creates a new paragraph.
   * 2. When you click enter, and the last key you clicked before that was enter, it will create a new speaker
   */
  private handleEnter(ev, range, context: IContext) {
    const isPrevSpeaker = this.quill.getLeaf(range.index - 1)[Leaf.TEXT_BLOT].domNode.localName === SPEAKER.TAG_NAME;
    const isEndOfBlankLine = context.offset <= Support.endOfBlinkLineMaxOffset && context.prefix === ' ' && !context.suffix;
    const isTextDomNode = !context.offset && !context.prefix && !context.suffix;
    console.log(context, this.quill.getLeaf(range.index), {isPrevSpeaker, isEndOfBlankLine, isTextDomNode});

    if (isTextDomNode) {
      this.quill.deleteText(range.index - 1, 1);
      this.quill.setSelection(range.index + 1, 0);
      return;
    }

    // if upper is speaker do nothing
    if (isPrevSpeaker || isEndOfBlankLine) return;

    // if prev key wasn't ENTER make a new paragraph
    if (!this.isPrevKeyCodeEnter) return this.handleLineBreak(range, context);

    console.log('=========speaker=====', isPrevSpeaker);
    const wordFormat = context.format[WORD.BLOT_NAME];
    this.quill.insertEmbed(range.index, SPEAKER.BLOT_NAME, {id: '1', ...wordFormat}, Quill.sources.SILENT);
    this.quill.setSelection(range.index + 1);

    // emit click on speaker
    setTimeout(() => {
      const speakerElem = document.querySelector(`${SPEAKER.TAG_NAME}[data-start="${wordFormat.start}"]`) as any;
      speakerElem.click();
    }, 200);

  }

  private handleLineBreak(range, context) {
    const nextCharFormat = this.quill.getFormat(range.index + 1, 1);
    const wordFormat = context.format[WORD.BLOT_NAME];
    const isMiddleOfWord = context.prefix && context.suffix;
    const isNextSpace = !context.suffix && context.prefix && context.prefix[0] !== ' ' && !!nextCharFormat[WORD.BLOT_NAME];
    const isLastChar = context.prefix && !context.suffix && !nextCharFormat[WORD.BLOT_NAME];
    const isStartBlankLine = !context.offset && context.suffix === ' ' && !context.prefix;

    // console.log('LB ', context, {isMiddleOfWord, isNextSpace, isLastChar});

    if (isMiddleOfWord) {
      this.quill.insertText(range.index, '\n', wordFormat);
      // this.quill.deleteText(range.index, 1);
      this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
    } else if (isNextSpace) {
      this.quill.insertText(range.index + 1, '\n', wordFormat);
      this.quill.deleteText(range.index, 1);
      this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
    } else if (isLastChar) {
      this.quill.insertEmbed(range.index + 1, WORD.BLOT_NAME, {...wordFormat, insert: ' '}, Quill.sources.USER);
      this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
    } else if (isStartBlankLine) {
      // this.quill.insertText(range.index + 1, '\n');
      // this.quill.insertEmbed(range.index + 1, WORD.BLOT_NAME, {...wordFormat, insert: ' '}, Quill.sources.USER);
      // this.quill.setSelection(range.index + 2, Quill.sources.SILENT);
    } else {
      // if not text node; not last char; not first char at blank line
      this.quill.insertText(range.index, '\n');
      this.quill.deleteText(range.index - 1, 1);
      this.quill.setSelection(range.index, Quill.sources.SILENT);
      // console.log('default');
    }
  }

  /**
   * on DOUBLE CLICK
   */
  private doubleClickHandler(ev) {
    // If has selection - so it's a content
    if (this.quill.getSelection().length) {
      const range = this.quill.getSelection() as any;
      const content = this.quill.getContents(range);
      // console.log('DBL click', content, this.quill.getFormat(range));
      const wordDataAttr: ITimeDataset = content.ops[0].attributes && content.ops[0].attributes[WORD.BLOT_NAME];
      if (wordDataAttr) {
        const container = this.quill.getLines(range)[0].domNode;
        this.updHighlight(container.dataset.start, wordDataAttr);
        this.playerSvc.setTime(+wordDataAttr.start);
        this.playerSvc.play();
      }
    }
  }

  private selectionForTags() {
    // If has selection
    if (this.quill.getSelection().length) {
      const range = this.quill.getSelection() as any;
      const content: IDelta = this.quill.getContents(range);
      console.log(content);
      this.tagsSvc.setSelectedDeltaOps(content.ops);
    } else {
      this.tagsSvc.setSelectedDeltaOps([]);
    }
  }

  onEditorCreated(quill: impQuill) {
    this.quill = quill;
    this.editorSvc.quill = quill;
    this.containers = quill.getLines();
    quill.root.setAttribute('spellcheck', 'false');
    quill.root.addEventListener('dblclick', (e) => this.doubleClickHandler(e));
    quill.root.addEventListener('keyup', (ev: KeyboardEvent) => {
      // needs to provide on double enter behavior
      this.isPrevKeyCodeEnter = this.isPrevKeyCodeEnter ? null : ev.keyCode === KEY_CODE.ENTER;
      // needs to handle player events
      if (this.hotKeysHlp.isPlayStopCondition(ev)) return quill.deleteText(quill.getSelection().index - 1, 1);
    }, false);
    quill.root.addEventListener('click', () => this.isPrevKeyCodeEnter = null);
    // TODO uncoment string
    // quill.root.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  onEditorBlured(quill) {
    console.log('blur');
  }

  // Will emit at every click event. Same as on 'selection-change'
  onEditorFocused(quill: impQuill) {
    // console.log('FOCUS!', quill.getSelection() as any);
    this.selectionForTags();

    // quill.insertEmbed('<h1 class="spme">Fff</h1>');
  }

  onContentChanged(attr) {
    // const range = this.quill.getSelection() as any;
    // const content = this.quill.getContents(range);
    // console.log(range, content);

  }

  exportData() {
    // const text = this.quill.getContents(0, this.quill.getLength());
    // console.log(text);
  }

  ngOnDestroy() {}
}

// Container
// quill.getLines(quill.getSelection() as any)

// Speaker
// const speaker: DOMStringMap = quill.getFormat(quill.getSelection())[SPEAKER.BLOT_NAME];
