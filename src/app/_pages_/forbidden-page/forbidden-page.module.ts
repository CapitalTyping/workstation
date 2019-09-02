import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForbiddenPageComponent } from '@pages/forbidden-page/forbidden-page.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ForbiddenPageComponent],
  exports: [ForbiddenPageComponent]
})
export class ForbiddenPageModule {}
