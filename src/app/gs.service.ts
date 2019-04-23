import { Injectable } from "@angular/core";
import { HttpClient, HttpEventType } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class GsService {
  public user: any = null;
  private accessToken = "";
  public config: any = {};
  private baseApiURL = "http://api.wassim.ovh/api";
  constructor(public http: HttpClient) {
    let u = localStorage.getItem("user");
    if (u) this.user = JSON.parse(u);
    this.accessToken = localStorage.getItem("accessToken") || "";
    let config = localStorage.getItem("config");
    if (config) this.config = JSON.parse(config);
    this.api("config").then(rep => {
      this.config = rep;
      localStorage.setItem("config", JSON.stringify(this.config));
    });
    this.handlApiResponce = this.handlApiResponce.bind(this);
    this.headerResponce = this.headerResponce.bind(this);
  }
  request(path, method = "get", params: any = {}, data = {}) {
    if (this.accessToken && this.accessToken !== "") {
      params.access_token = this.accessToken;
    }
    method = method.toLowerCase().trim();
    path = path.match(/^\//i) ? path : "/" + path;
    path = this.baseApiURL + path;
    var pro = null;
    switch (method) {
      case "get":
      case "delete":
        pro = this.http[method](path, { params }).toPromise();
        break;
      case "post":
      case "put":
        pro = this.http[method](path, data, { params }).toPromise();
        break;
    }
    return pro.then(this.handlApiResponce.bind(this));
  }
  handlApiResponce(rep) {
    if (rep.header && rep.body) {
      this.headerResponce(rep.header);
      return rep.body;
    }
    if (rep.slave && rep.master) {
      this.headerResponce(rep.slave);
      return rep.master;
    }
    return rep;
  }
  headerResponce(header) {
    header.map(({ name, data }) => {
      switch (name) {
        case "setAccessToken":
          this.accessToken = data.shift();
          localStorage.setItem("accessToken", this.accessToken);
          break;
        case "log":
          console.log.apply(null, data);
          break;
        default:
          if (window[name] && typeof window[name] === "function") {
            window[name].apply(null, data);
          }
          break;
      }
    });
  }
  get(path, params = {}): any {
    return this.request(path, "get", params);
  }
  post(path, data = {}, params = {}): any {
    return this.request(path, "post", params, data);
  }
  put(path, data = {}, params = {}): any {
    return this.request(path, "put", params, data);
  }
  delete(path, params = {}): any {
    return this.request(path, "delete", params);
  }
  api(path, data = {}): any {
    return this.post(path, data);
  }
  uploadFile(inputFile, data: any = {}, state: any = {}) {
    if (!inputFile || !inputFile.files.length) return;
    var formData = new FormData();
    formData.append("file", inputFile.files[0], inputFile.files[0].name);
    formData.append("data", JSON.stringify(data));
    state.progress = 0;
    state.done = false;
    return new Promise((resolve, eject) => {
      this.http
        .post(this.baseApiURL + "/file", formData, {
          reportProgress: true,
          observe: "events"
        })
        .subscribe((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              const progress = Math.round((100 * event.loaded) / event.total);
              state.progress = Math.max(0, progress - 1);
              break;
            case HttpEventType.Response:
              state.done = true;
              state.progress = 100;
              let d = this.handlApiResponce(event.body);
              state.data = d;
              resolve(d);
              break;
            default:
              break;
          }
        });
    });
  }
  test() {
    this.get("product").then(console.log);
  }
  crud(api, options: any = {}) {
    return new Crud(this, api, options);
  }
  login(login, pass) {
    return this.api("login", { login, pass }).then(rep => {
      return this.user;
    });
  }
  logout() {}
}

@Injectable({
  providedIn: "root"
})
export class Crud {
  public list = [];
  public filter = {};
  public dialog = {};
  public item: any = {};
  public loading = false;
  public page = 1;
  public nbrPages = 0;
  public count = 0;
  private _events = [];
  constructor(
    public gs: GsService,
    public api: string,
    public options: any = {}
  ) {
    this.options = this.options || {};
    this.options.idcol = this.options.idcol || "id";
    this.options.length = this.options.length || 10;
    if (!this.options.length) this.options.length = 10;
    this.load(1);
  }

  on(event, callback) {
    this._events.push({
      name: event,
      callback
    });
    return this;
  }
  emit(event, data = null) {
    this._events.map(({ name, callback }) => {
      if (name === event) {
        callback(data);
      }
    });
    return this;
  }

  load(page) {
    this.loading = true;
    this.gs.get(this.api, { ...this.options, page }).then(rep => {
      this.page = page;
      this.loading = false;
      this.list = rep.data.map(item => this.initItem(item));
      this.count = rep.count;
      this.nbrPages = Math.ceil(this.count / this.options.length);
      this.emit("ready");
    });
  }
  newItem(item: any = {}) {
    item = item || {};
    this.initItem(item);
    return item;
  }
  initItem(item: any) {
    item.$open = nameDialog => {
      this.item = item;
      this.dialog[nameDialog].open();
    };
    for (let x in this.dialog) {
      item["$" + x] = () => item.$open(x);
    }
    item.$save = callback => {
      let path = this.api;
      if (item[this.options.idcol]) {
        path = this.api + "/" + item[this.options.idcol];
      }
      return this.gs.post(path, item).then(rep => {
        if (rep && (rep.success || rep.ok || rep.etat)) {
          this.load(1);
          if (rep.item) {
            for (let x in rep.item) {
              item[x] = rep.item[x];
            }
            this.initItem(item);
          }
          if (callback) callback(item);
          return item;
        }
        if (callback) callback(false);
        return false;
      });
    };
    item.$delete = callback => {
      if (!confirm("Voulez vous vraiment supprimer cet enregistrement?"))
        return;
      this.loading = true;
      return this.gs
        .delete(this.api + "/" + item[this.options.idcol])
        .then(rep => {
          this.load(1);
          if (callback) callback(rep);
          return rep;
        });
    };
    return item;
  }
}
