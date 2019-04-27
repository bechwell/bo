import { Component, OnInit } from "@angular/core";
import { GsService } from "./../../gs.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {

  private data: any = { login: "", password: "" };
  private repo: any = {};
  constructor(private gs: GsService) {
    if (this.gs.user) {
      this.gs.Router.navigateByUrl("/");
    }
  }
  ngOnInit() {
  }
  formResult(result) {
    this.repo = result;
    if (result && result.user) {
      this.gs.setUser(result.user);
      this.gs.Router.navigateByUrl("/");
    }
  }
}
