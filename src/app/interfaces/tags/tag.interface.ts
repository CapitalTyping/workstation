import { COLOR } from '@tran/utilities';
import { ITimeDataset } from '@tran/interfaces';

export interface ITag {
  id: number,
  title: string,
  fillColor: string,
  textColor: string,
  isSelected: boolean,
}

export const TAG = {
  TITLE: 'tag name',
  FILL_COLOR: COLOR.BACKGROUND,
  TEXT_COLOR: COLOR.TEXT,
};

export interface ITagSegmentTime extends ITimeDataset{
  insert: string,
}

export interface ITagSectionSegment {
  content: string,
  time: ITagSegmentTime
}

export interface ITagSection {
  tag: ITag,
  segments: ITagSectionSegment[],
}
