import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from '@pages/not-found-page/not-found-page.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NotFoundPageComponent],
  exports: [NotFoundPageComponent]
})
export class NotFoundPageModule {}
