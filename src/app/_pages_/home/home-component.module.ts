import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@modules/shared/shared.module';
import { HomeComponent } from '@pages/home/home.component';
import { TagsModule } from '@components/tags/tags.module';
import { SpeakerModule } from '@components/speaker/speaker.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TagsModule,
    SpeakerModule,
  ],
  declarations: [
    HomeComponent,
  ],
  entryComponents: [],
  exports: [
    HomeComponent,
  ]
})
export class HomeComponentModule {}
