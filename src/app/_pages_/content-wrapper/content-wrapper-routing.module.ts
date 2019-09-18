import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContentWrapperComponent } from '@pages/content-wrapper/content-wrapper.component';
import { HomeComponent } from '@pages/home/home.component';
import { AuthGuardService } from '@tran/guards/auth/auth-guard.service';
import { FormatComponent } from '@pages/format/format.component';

const routes: Routes = [
  {
    path: '',
    component: ContentWrapperComponent,
    // canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'format',
        component: FormatComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentWrapperRoutingModule { }
