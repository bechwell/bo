import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GsService {
  private baseApiURL = "http://api.wassim.ovh";
  constructor(public http: HttpClient) { }
  test() {
    this.http.get(this.baseApiURL + "/product").subscribe(rep => console.log(rep));
  }
  get(path, params = {}) {
    this.http.get(this.baseApiURL + path, { params }).subscribe(rep => console.log(rep));
  }
}
