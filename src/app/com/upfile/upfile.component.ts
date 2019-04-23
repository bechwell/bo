import { Component, OnInit, ViewChild } from "@angular/core";
import { GsService } from "./../../gs.service";

@Component({
  selector: "upfile",
  templateUrl: "./upfile.component.html",
  styleUrls: ["./upfile.component.scss"]
})
export class UpfileComponent implements OnInit {
  private state: any = {};
  private url = "http://lorempixel.com/200/200/";
  @ViewChild("file")
  file;
  constructor(public gs: GsService) {}

  ngOnInit() {}
  selectFile() {
    this.file.nativeElement.onchange = e => {
      this.gs
        .uploadFile(this.file.nativeElement, {}, this.state)
        .then((rep: any) => {
          this.url = "http://api.wassim.ovh" + rep.url;
        });
    };
    this.file.nativeElement.click();
  }
}
