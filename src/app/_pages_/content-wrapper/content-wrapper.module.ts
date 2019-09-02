import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@modules/shared/shared.module';

import { ContentWrapperRoutingModule } from '@pages/content-wrapper/content-wrapper-routing.module';
import { ContentWrapperComponent } from '@pages/content-wrapper/content-wrapper.component';
import { TabsComponent } from '@pages/content-wrapper/tabs/tabs.component';
import { FormatComponent } from '@pages/format/format.component';
import { HomeComponentModule } from '@pages/home/home-component.module';

import { MediaPlayerComponent } from '@components/media-player/media-player.component';
import { MenuModule } from '@components/menu/menu.module';

@NgModule({
  imports: [
    CommonModule,
    ContentWrapperRoutingModule,
    SharedModule,
    MenuModule,
    HomeComponentModule
  ],
  declarations: [
    ContentWrapperComponent,
    FormatComponent,
    TabsComponent,
    MediaPlayerComponent,
  ],
  exports: []
})
export class ContentWrapperModule {}
