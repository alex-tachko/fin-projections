import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
})
export class DownloadComponent implements OnInit {
  constructor(private fileService: FileUploadService) {}

  ngOnInit(): void {}

  onFileDownload() {
    this.fileService.downloadFile({ isTemplate: false }).subscribe(() => {
      console.log('file downloaded');
    });
  }
}
