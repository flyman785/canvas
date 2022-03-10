import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import CanvasFreeDrawing from 'canvas-free-drawing';
import { debounceTime, tap } from 'rxjs/operators';
import hexRgb from 'hex-rgb';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {

  private cx!: any;
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ){}
  
  ngAfterViewInit() {

    this.cx = new CanvasFreeDrawing({
      elementId: 'canvas',
      width: 601,
      height: 615,
      lineWidth: 3,
      backgroundColor: [255, 0, 0, 0]
    });

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      colorStroke: [],
      name: [null, [Validators.required]]
    });

    this.form.get('colorStroke')?.valueChanges
      .pipe(
        debounceTime(300),
        tap(value => {
          var x = hexRgb(value);
          this.cx.setStrokeColor([x.red, x.green, x.blue]);
        })
      )
      .subscribe();
  }

  save(): void {
    console.log(this.cx.save());
  }

  clear(): void {
    this.cx.clear();
  }

  undo(): void {
    this.cx.undo();
  }
  
  redo(): void {
    this.cx.redo();
  }
}
