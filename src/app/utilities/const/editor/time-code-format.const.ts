import { IMatSelectOption } from '@tran/interfaces';

export enum TIME_CODE_FORMAT {
  '0.000' = 1,
  '00.00.00' = 2,
}

export const TIME_CODE_VIEW: IMatSelectOption[] = [
  {
    value: TIME_CODE_FORMAT['0.000'],
    view: '0.000'
  },
  {
    value: TIME_CODE_FORMAT['00.00.00'],
    view: '00.00.00'
  },
];
