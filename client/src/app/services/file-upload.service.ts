import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private readonly url = 'http://localhost:3000/api';
  private predictionData$ = new ReplaySubject();

  constructor(private httpClient: HttpClient) {}

  uploadFile(file: File, predictionType: string): Observable<any> {
    const form = new FormData();
    form.append('excel', file);
    form.append('predictionType', predictionType);

    return this.httpClient
      .post(`${this.url}/calculate-prediction`, form)
      .pipe(tap((predictionData) => (this.predictionData = predictionData)));
  }

  public getPredictedData$(): any {
    return this.predictionData$.asObservable();
  }

  public set predictionData(data: any) {
    this.predictionData$.next(data);
  }
}
