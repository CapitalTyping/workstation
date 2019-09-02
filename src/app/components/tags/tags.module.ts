import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsComponent } from '@components/tags/tags.component';
import { SharedModule } from '@modules/shared/shared.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { EditTagComponent } from '@components/tags/edit-tag/edit-tag.component';
import { TimeCodeFormatModule } from '@components/time-code-format/time-code-format.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ColorPickerModule,
    TimeCodeFormatModule,
  ],
  declarations: [
    TagsComponent,
    EditTagComponent,
  ],
  entryComponents: [
    EditTagComponent,
  ],
  exports: [
    TagsComponent,
  ]
})
export class TagsModule {}
