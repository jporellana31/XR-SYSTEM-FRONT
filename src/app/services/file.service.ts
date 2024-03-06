import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  dicomFiles: any[] = [];
  constructor() { }

  setDicomFiles(files: any[]): void {
    this.dicomFiles = files;
  }

  getDicomFiles(): any[] {
    return this.dicomFiles;
  }


}
