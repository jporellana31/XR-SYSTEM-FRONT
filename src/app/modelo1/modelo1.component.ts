import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-modelo1',
  templateUrl: './modelo1.component.html',
  styleUrls: ['./modelo1.component.css']
})
export class Modelo1Component implements OnInit {

  file!: File;
  photoSelected!: string | ArrayBuffer | null;
  hiddenTxt: boolean = true;
  hiddenSpinner: boolean = false;
  displayButton: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  // Upload photo
  onPhotoSelected(event: any): any {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
      // image preview
      const reader = new FileReader();
      reader.onload = e => this.photoSelected = reader.result;
      reader.readAsDataURL(this.file);
      // hiddens
      this.hiddenTxt= false;
      this.displayButton = false;
    }
  }

  // Bar progress
  loading(){
    this.hiddenSpinner = true;
    setTimeout(() => {
      this.router.navigateByUrl('/radiology');
    }, 1000);
  }

}


