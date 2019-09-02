import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@modules/shared/shared.module';
import { MenuComponent } from '@components/menu/menu.component';
import { MenuMessagesComponent } from '@components/menu/menu-messages/menu-messages.component';
import { MenuNotesComponent } from '@components/menu/menu-notes/menu-notes.component';
import { MenuVideoComponent } from '@components/menu/menu-video/menu-video.component';
import { MenuShortcutsComponent } from '@components/menu/menu-shortcuts/menu-shortcuts.component';
import { MenuSettingsComponent } from '@components/menu/menu-settings/menu-settings.component';
import { MenuPlaylistComponent } from '@components/menu/menu-playlist/menu-playlist.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    MenuComponent,
    MenuNotesComponent,
    MenuMessagesComponent,
    MenuVideoComponent,
    MenuShortcutsComponent,
    MenuSettingsComponent,
    MenuPlaylistComponent,
  ],
  exports: [
    MenuComponent
  ]
})
export class MenuModule {}
