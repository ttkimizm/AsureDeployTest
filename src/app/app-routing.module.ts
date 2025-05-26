import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Screen1Component } from './screen1/screen1.component';
import { Screen2Component } from './screen2/screen2.component';
import { LoginGuard } from './guard/login.guard';

const routes: Routes = [
  { path: '', component: Screen1Component, canActivate: [] },
  { path: 'screen2', component: Screen2Component, canActivate: [] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
