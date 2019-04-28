import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { ModalModule } from "ngx-bootstrap/modal";

import { InputComponent } from "./com/input/input.component";
import { PaginComponent } from "./com/pagin/pagin.component";
import { DialogComponent } from "./com/dialog/dialog.component";
import { LoadingComponent } from "./com/loading/loading.component";
import { UpfileComponent } from './com/upfile/upfile.component';
import { LoginComponent } from './com/login/login.component';
import { WformComponent } from './com/wform/wform.component';
import { HomeComponent } from './pages/home/home.component';
import { AutoappComponent } from './com/autoapp/autoapp.component';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    PaginComponent,
    DialogComponent,
    LoadingComponent,
    UpfileComponent,
    LoginComponent,
    WformComponent,
    HomeComponent,
    AutoappComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ModalModule.forRoot(),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
