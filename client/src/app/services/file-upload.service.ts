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
}

export enum FrequencyEnum {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}

export interface IDataCell {
  date: Date;
  previousAmount: number;
  currentAmount: number;
  percentage: number;
}

export interface IDataRow {
  title: string;
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
  public predictionType = AlgorithmEnum.BEST;

  constructor(private httpClient: HttpClient) {}

  uploadFile(file: File, algo: AlgorithmEnum): Observable<any> {
    const form = new FormData();
    form.append('excel', file);
    form.append('algo', algo);
    form.append('frequency', this.frequency);

    return this.httpClient.post(`${this.url}/calculate-prediction`, form).pipe(
      tap((predictionData) => {
        this.predictionData = <IDataRow[]>predictionData;
        this.predictionType = algo;
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
