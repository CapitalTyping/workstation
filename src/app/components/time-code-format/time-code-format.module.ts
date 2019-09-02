import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@modules/shared/shared.module';
import { TimeCodeFormatComponent } from '@components/time-code-format/time-code-format.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    TimeCodeFormatComponent,
  ],
  exports: [
    TimeCodeFormatComponent,
  ]
})
export class TimeCodeFormatModule {}
