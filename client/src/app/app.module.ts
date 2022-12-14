import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OneYearTableComponent } from './one-year-table/one-year-table.component';

import { HttpClientModule } from '@angular/common/http';

import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MainComponent } from './main/main.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { UploadFileCardComponent } from './upload-file-card/upload-file-card.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartCardComponent } from './chart/chart-card.component';
import { TableCardComponent } from './table-card/table-card.component';
import { FormsModule } from '@angular/forms';
import { DownloadComponent } from './download/download.component';
import { FiveYearsComponent } from './five-years/five-years.component';
import { FiveYearsTableComponent } from './five-years-table/five-years-table.component';

@NgModule({
  declarations: [
    AppComponent,
    OneYearTableComponent,
    MainComponent,
    UploadFileCardComponent,
    ChartCardComponent,
    TableCardComponent,
    DownloadComponent,
    FiveYearsComponent,
    FiveYearsTableComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    NgApexchartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
