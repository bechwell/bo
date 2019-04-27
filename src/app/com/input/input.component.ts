import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"]
})
export class InputComponent implements OnInit {
  private _myModel: any = {};

  get myModel() {
    return this._myModel;
  }
  @Input()
  set myModel(val: any) {
    if (typeof val === "string") {
      val = { value: val };
    }
    this._myModel = val;
  }

  private _myModelValue: any;
  get myModelValue() {
    return this._myModelValue;
  }
  @Input()
  set myModelValue(val: any) {
    this._myModelValue = val;
    this._myModel = this._myModel || {};
    this._myModel.value = val;
  }

  @Output() myModelChange = new EventEmitter<string>();
  @Output() myModelValueChange = new EventEmitter<string>();
  @Input() label: string;
  @Input() placeHolder: string;
  @Input() name: string;
  @Input() type: string;
  @Input() icon: string;
  constructor() { }
  ngOnInit() { }
  updateValue(val: any) {
    this.myModelValue = val;
    this.myModelChange.emit(this.myModel);
    this.myModelValueChange.emit(this.myModelValue);
  }
}
