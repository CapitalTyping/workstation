import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@modules/shared/shared.module';
import { EditSpeakerComponent } from '@components/speaker/edit-speaker/edit-speaker.component';
import { TimeCodeFormatModule } from '@components/time-code-format/time-code-format.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TimeCodeFormatModule,
  ],
  declarations: [
    EditSpeakerComponent,
  ],
  entryComponents: [
    EditSpeakerComponent,
  ],
  exports: [
    EditSpeakerComponent,
  ]
})
export class SpeakerModule {}
