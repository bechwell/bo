import { Component, OnInit } from "@angular/core";
import { GsService } from "./../../gs.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  private data: any = { login: "", password: "" };
  constructor(private gs: GsService) {}

  ngOnInit() {}
}
