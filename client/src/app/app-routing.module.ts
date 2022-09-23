import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadComponent } from './download/download.component';
import { FiveYearsComponent } from './five-years/five-years.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { OneYearTableComponent } from './one-year-table/one-year-table.component';
import { UploadFileCardComponent } from './upload-file-card/upload-file-card.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'upload' },
      { path: 'one-year', component: OneYearTableComponent },
      { path: 'five-years', component: FiveYearsComponent },
      { path: 'upload', component: UploadFileCardComponent },
      { path: 'home', component: HomeComponent },
      { path: 'download', component: DownloadComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
