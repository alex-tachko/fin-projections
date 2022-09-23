import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
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
    this.fileService.downloadFile({ isTemplate: false }).subscribe((res) => {
      var byteCharacters = atob(res.data);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      FileSaver.saveAs(blob, 'predictions.xlsx');
      console.log('file downloaded');
    });
  }
}
