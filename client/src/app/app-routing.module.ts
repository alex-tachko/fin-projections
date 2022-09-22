import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { TableComponent } from './table/table.component';
import { OneYearTableComponent } from './one-year-table/one-year-table.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'one-year' },
      { path: 'one-year', component: OneYearTableComponent },
      { path: 'home', component: HomeComponent },
      { path: 'table', component: TableComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
