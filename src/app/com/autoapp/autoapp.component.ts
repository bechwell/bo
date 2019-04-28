import { Component, OnInit, Input } from "@angular/core";
import { GsService } from "src/app/gs.service";

@Component({
  selector: "autoapp",
  templateUrl: "./autoapp.component.html",
  styleUrls: ["./autoapp.component.scss"]
})
export class AutoappComponent implements OnInit {
  @Input() private config: any = {};
  constructor(private gs: GsService) {
    console.log(this.gs);
  }
  ngOnInit() {}
}
