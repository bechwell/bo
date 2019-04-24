import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { GsService } from "./../../gs.service";
import icon from "./upload.png";
@Component({
  selector: "upfile",
  templateUrl: "./upfile.component.html",
  styleUrls: ["./upfile.component.scss"]
})
export class UpfileComponent implements OnInit {
  private state: any = {};
  private _url = "";
  private icon = icon;
  private readyimg = false;
  private isEmpty = true;
  @Input() public fixHeight: number = 0;
  @Input() public fixWidth: number = 0;
  @Output() urlChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() public dist: string = "";
  @Input() public title: string = "";

  get url() {
    if (this.isEmpty) {
      return "";
    } else {
      return this._url;
    }
  }
  @Input()
  set url(v: string) {
    this._url = v;
    if (this._url && this._url !== "") {
      this.isEmpty = false;
      this.urlChange.emit(this._url);
    } else {
      this.isEmpty = true;
    }
  }
  @ViewChild("file")
  file;
  constructor(public gs: GsService) {

  }
  ngOnInit() { }
  selectFile() {
    this.file.nativeElement.onchange = e => {
      if (this.file.nativeElement.files.length) {
        this.gs
          .uploadFile(this.file.nativeElement, { dist: this.dist, title: this.title }, this.state)
          .then((rep: any) => {
            this.readyimg = false;
            this.url = rep.url;
            this.file.nativeElement.value = "";
          });
      }
    };
    this.file.nativeElement.click();
  }
}
