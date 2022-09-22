import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'app-upload-file-card',
  templateUrl: './upload-file-card.component.html',
  styleUrls: ['./upload-file-card.component.scss'],
})
export class UploadFileCardComponent implements OnInit {
  public file: File | null = null;
  public predictionType = 'lagrange';
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
