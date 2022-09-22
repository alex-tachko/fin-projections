import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  AlgorithmEnum,
  FileUploadService,
} from '../services/file-upload.service';

const AlgorithmsOptions = [
  { value: AlgorithmEnum.LAGRANGE, viewValue: AlgorithmEnum.LAGRANGE },
  { value: AlgorithmEnum.MA2, viewValue: AlgorithmEnum.MA2 },
  { value: AlgorithmEnum.MA3, viewValue: AlgorithmEnum.MA3 },
  { value: AlgorithmEnum.MA4, viewValue: AlgorithmEnum.MA4 },
  { value: AlgorithmEnum.WEIGHTED_MA4, viewValue: AlgorithmEnum.WEIGHTED_MA4 },
  { value: AlgorithmEnum.LINEAR, viewValue: AlgorithmEnum.LINEAR },
  { value: AlgorithmEnum.BEST, viewValue: AlgorithmEnum.BEST },
];

@Component({
  selector: 'app-upload-file-card',
  templateUrl: './upload-file-card.component.html',
  styleUrls: ['./upload-file-card.component.scss'],
})
export class UploadFileCardComponent implements OnInit {
  public file: File | null = null;
  public predictionType = AlgorithmEnum.LAGRANGE;
  public algos = AlgorithmsOptions;
  constructor(private fileService: FileUploadService, private router: Router) {}

  ngOnInit(): void {}

  onFileUpload(fileEvent: Event) {
    const [file] = (fileEvent.target as any).files;
    this.file = file;
  }

  onUpload() {
    if (this.file) {
      this.fileService
        .uploadFile(this.file, this.predictionType)
        .subscribe(() => this.router.navigate(['/', 'one-year']));
    }
  }
}
