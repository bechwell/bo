import { Component, OnInit } from "@angular/core";
import { GsService } from "src/app/gs.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  cols = [];
  test = "";
  constructor(public gs: GsService) {
    this.cols = Object.values(this.gs.currentPage.cols || {});
  }

  ngOnInit() {}
}
