import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

export enum AlgorithmEnum {
  LAGRANGE = 'lagrange',
  MA2 = 'ma2',
  MA3 = 'ma3',
  MA4 = 'ma4',
  WEIGHTED_MA4 = 'w_ma4',
  LINEAR = 'linear',
  BEST = 'best',
  PERCENT = 'percent',
}

export enum FrequencyEnum {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}

export interface IDataCell {
  date: Date;
  previousAmount: number;
  currentAmount: number;
  percentage: string;
}

export interface IDataRow {
  title: string;
  columns?: string[];
  cells: IDataCell[];
  totalPreviousYear: number;
  totalCurrentYear: number;
}

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private readonly url = 'http://localhost:3000/api/projections';
  // public  private predictionData$ = new ReplaySubject();
  predictionData: IDataRow[] = [];
  public frequency = FrequencyEnum.MONTHLY;
  public predictionType = AlgorithmEnum.WEIGHTED_MA4;
  public isLoaded = false;
  public percent = '';

  constructor(private httpClient: HttpClient) {}

  downloadFile({
    isTemplate = false,
  }: {
    isTemplate: boolean;
  }): Observable<any> {
    const params = {
      isTemplate,
      predictionType: this.predictionType,
      percent: this.percent,
    };
    return this.httpClient.get<IDataRow[]>(`${this.url}/download`, {
      params,
      responseType: 'text',
      headers: { 'Content-Type': 'application/octet-stream' },
    } as any);
  }

  parseFile(file: File): Observable<any> {
    const form = new FormData();
    form.append('excel', file);
    form.append('frequency', this.frequency);

    return this.httpClient.post(`${this.url}/parse-file`, form);
  }

  clearData(): Observable<any> {
    const body = {};
    return this.httpClient.post(`${this.url}/clear-data`, body);
  }

  calculatePrediction(
    algo: AlgorithmEnum,
    { percent, fullData }: { percent: string; fullData: boolean }
  ): Observable<IDataRow[]> {
    const params = { algo, percent, fullData };

    return this.httpClient
      .get<IDataRow[]>(`${this.url}/calculate-prediction`, { params })
      .pipe(
        tap((predictionData) => {
          this.predictionData = <IDataRow[]>predictionData;
          this.predictionType = algo;
          this.percent = percent;
        })
      );
  }

  // public getPredictedData$(): Observable<IDataRow[]> {
  //   return this.predictionData$.asObservable();
  // }

  // public getPredictedData(): IDataRow[] {
  //   return this.predictionData;
  // }

  // public set predictionData(data: IDataRow[]) {
  //   this.predictionData$.next(data);
  // }

  public isMonthlyFrequency(): boolean {
    return this.frequency === FrequencyEnum.MONTHLY;
  }
}
