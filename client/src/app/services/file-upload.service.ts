import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, tap } from 'rxjs';

export enum AlgorithmEnum {
  LAGRANGE = 'lagrange',
  MA2 = 'ma2',
  MA3 = 'ma3',
  MA4 = 'ma4',
  WEIGHTED_MA4 = 'w_ma4',
  LINEAR = 'linear',
}

export enum FrequencyEnum {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private readonly url = 'http://localhost:3000/api/projections';
  private predictionData$ = new ReplaySubject();
  public frequency = FrequencyEnum.MONTHLY;
  public predictionType = AlgorithmEnum.LAGRANGE;

  constructor(private httpClient: HttpClient) {}

  uploadFile(file: File, algo: AlgorithmEnum): Observable<any> {
    const form = new FormData();
    form.append('excel', file);
    form.append('algo', algo);
    form.append('frequency', this.frequency);

    return this.httpClient.post(`${this.url}/calculate-prediction`, form).pipe(
      tap((predictionData) => {
        this.predictionData = predictionData;
        this.predictionType = algo;
      })
    );
  }

  public getPredictedData$(): any {
    return this.predictionData$.asObservable();
  }

  public set predictionData(data: any) {
    this.predictionData$.next(data);
  }

  public isMonthlyFrequency(): boolean {
    return this.frequency === FrequencyEnum.MONTHLY;
  }
}
