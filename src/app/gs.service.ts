import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GsService {
  constructor(public http: HttpClient) { }
  test() {
    this.http.get("http://api.wassim.ovh/product").subscribe(rep => console.log(rep));
  }
}
