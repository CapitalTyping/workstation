import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ForbiddenPageComponent } from '@pages/forbidden-page/forbidden-page.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: '@pages/content-wrapper/content-wrapper.module#ContentWrapperModule',
  },
  {
    path: 'forbidden',
    component: ForbiddenPageComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'forbidden',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
