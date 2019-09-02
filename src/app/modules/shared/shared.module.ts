import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '@modules/material/material.module';
import { QuillEditorModule } from 'ngx-quill-editor/quillEditor.module';
import { EditorModule } from 'primeng/editor';
import { PipesModule } from '@tran/pipes/pipes.module';

/** COMPONENTS **/
import { HtmlEditorComponent } from '@components/html-editor/html-editor.component';
import { WaitingComponent } from '@components/waiting/waiting.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    QuillEditorModule,
    MaterialModule,
    EditorModule,
    PipesModule,
  ],
  declarations: [
    WaitingComponent,
    HtmlEditorComponent,
  ],
  entryComponents: [],
  exports: [
    FormsModule,
    MaterialModule,
    QuillEditorModule,
    EditorModule,
    PipesModule,
    // components
    WaitingComponent,
    HtmlEditorComponent,
  ],
})
export class SharedModule {}
