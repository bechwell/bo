import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./com/login/login.component";
import { HomeComponent } from "./pages/home/home.component";
import { IfLoggedGuard } from "./com/if-logged.guard";
import schema from "./app-schema.service";
import { UpfileComponent } from "./com/upfile/upfile.component";

const listComs = { UpfileComponent, HomeComponent };

var routes: Routes = [
  { path: "login", component: LoginComponent }
  // { path: "", component: HomeComponent, canActivate: [IfLoggedGuard] }
];
routes = routes.concat(
  schema.menu.map(elm => ({
    path: elm.path,
    component: elm.component
      ? typeof elm.component == "string"
        ? listComs[elm.component]
        : elm.component
      : HomeComponent,
    data: elm
  }))
);

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
