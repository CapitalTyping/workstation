import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '@tran/pipes/filter/filter.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FilterPipe,
  ],
  exports: [
    FilterPipe,
  ]
})
export class PipesModule {}
