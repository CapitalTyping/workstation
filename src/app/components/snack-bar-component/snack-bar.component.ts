import { Component, OnInit, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

import { ISnackbar } from '@tran/interfaces';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {
  @ViewChild('snack') snack: ElementRef;
  content: ISnackbar = {
    title: '',
    message: '',
    type: 'info',
    _snackRef: null
  };

  constructor(
      @Inject(MAT_SNACK_BAR_DATA) public data: ISnackbar,
  ) {
    data && (this.content = data);
  }

  ngOnInit() {
  }

  dismiss() {
    this.data._snackRef.dismiss();
    // workaround to remove element from DOM on chunk error
    this.snack.nativeElement.remove();
  }
}
