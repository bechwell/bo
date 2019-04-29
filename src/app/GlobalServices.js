

class GlobalServices {
    _events = [];
    baseApiURL = "http://api.wassim.ovh/api";
    accessToken = "";
    constructor() {
        this.accessToken = localStorage.getItem("accessToken") || "";
    }
    request(method, path, params = {}, data = {}) {
        let fetchObj = {
            redirect: "follow",
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        path = path.match(/^\//i) ? path : "/" + path;
        path = this.baseApiURL + path;
        if (this.accessToken && this.accessToken !== "") {
            params.access_token = this.accessToken;
        } else {
            this.accessToken = localStorage.getItem("accessToken") || "";
            if (this.accessToken && this.accessToken !== "") params.access_token = this.accessToken;
        }
        path += this.serialize(params);
        switch (method.toUpperCase()) {
            case "POST":
            case "PUT":
                fetchObj.body = JSON.stringify(data);
                break;
            default:
                break;
        }
        return fetch(path, fetchObj).then(response =>
            response.json()
        ).then(data => {
            if (typeof data === "object") {
                if ('error' in data) {
                    this.apiErrorHendler(data.error);
                }
            }
            return this.apiResponce(data);
        }).catch(err => {
            this.apiErrorHendler('Failed to fetch data from backend server');
            return console.error(err);
        });
    }
    apiErrorHendler(error) {
        console.error(error);
        this.emit("error", error);
    }
    apiResponce(data) {
        if (data.body && data.header) {
            this.apiResponceHeader(data.header);
            return data.body;
        }
        return data;
    }
    apiResponceHeader(header) {
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
    serialize(obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        if (str.length) return "?" + str.join("&");
        return "";
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
    get(path, params = {}) {
        return this.request("get", path, params);
    }
    post(path, data = {}, params = {}) {
        return this.request("post", path, params, data);
    }
    put(path, data = {}, params = {}) {
        return this.request("put", path, params, data);
    }
    delete(path, params = {}) {
        return this.request("delete", path, params);
    }
    api(path, data = {}) {
        return this.post(path, data);
    }
    uploadFile(inputFile, data = {}, stateRef = {}) {
        if (!inputFile || !inputFile.files.length) return;
        var params = {};
        if (this.accessToken && this.accessToken !== "") {
            params.access_token = this.accessToken;
        }
        var formData = new FormData();
        formData.append("file", inputFile.files[0], inputFile.files[0].name);
        formData.append("data", JSON.stringify(data));
        var state = {};
        state.progress = 0;
        state.done = false;
        var updateState = () => {
            if (typeof stateRef === "function") {
                stateRef(state);
            } else {
                for (let x in state) stateRef[x] = state[x];
            }
        }
        updateState();
        return new Promise((resolve, eject) => {
            var path = "/file";
            path += this.serialize(params);
            var xhr = null;
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xhr.open("POST", this.baseApiURL + path, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    state.done = true;
                    state.progress = 100;
                    updateState();
                    var obj = null;
                    try {
                        obj = JSON.parse(xhr.responseText);
                        resolve(this.apiResponce(obj));
                    } catch (e) {
                        eject(e);
                        console.error(e);
                        console.log("xhr.responseText", xhr.responseText);
                    }
                }
                return xhr.readyState;
            }
            xhr.upload.addEventListener("progress", (evt) => {
                if (evt.lengthComputable) {
                    v = Math.ceil((evt.loaded / evt.total) * 100);
                    state.progress = Math.max(v - 1, 0);
                    updateState();
                }
            }, false);
            xhr.addEventListener("progress", (evt) => {
                if (evt.lengthComputable) {
                    v = Math.ceil((evt.loaded / evt.total) * 100);
                    state.progress = Math.max(v - 1, 0);
                    updateState();
                }
            }, false);
            xhr.send(formdata);
        });
    }
    crud(path, options = {}) {
        return new CrudRest(path, options);
    }
}


class CrudRest {
    path = "";
    _events = [];
    http = null;
    loading = false;
    filter = {};
    list = [];
    page = 1;
    options = {};
    count = 0;
    nbrPages = 0;
    checkedList = [];
    constructor(path, options = {}) {
        this.path = path;
        this.options = options || {};
        this.options.length = this.options.length || 10;
        this.http = new GlobalServices();
    }
    load(page, options = {}) {
        this.loading = true;
        let _filter = {};
        if (this.filter) {
            for (let x in this.filter) _filter[x] = this.filter[x];
        }
        if (this.options) {
            for (let x in this.options) _filter[x] = this.options[x];
        }
        if (options) {
            for (let x in options) _filter[x] = options[x];
        }
        return this
            .http
            .get(this.path, _filter)
            .then(rep => {
                this.page = page;
                this.loading = false;
                this.list = rep.data.map(item => this.initItem(item));
                this.count = rep.count;
                this.nbrPages = Math.ceil(this.count / this.options.length);
                this.emit("ready");
            });
    }

    initItem(item = {}) {
        item.$loading = false;
        item.$checked = item.id ? this.checkedList.some(elm => elm.id === item.id) : false;
        item.$check = v => {
            if (v === true) {
                item.$checked = true;
                if (!this.checkedList.some(elm => elm.id === item.id)) {
                    this.checkedList.push(item);
                }
            } else if (v === false) {
                item.$checked = false;
                this.checkedList = this.checkedList.filter(elm => elm.id !== item.id);
            } else {
                item.$check(!item.$checked);
            }
        }
        item.$save = (callback) => {
            item.$loading = true;
            let path = this.path;
            if (item.id) {
                path += "/" + item.id;
            }
            return this.http.post(path, item).then(rep => {
                item.$loading = false;
                if (rep && (rep.success || rep.ok || rep.etat)) {
                    this.load(item.id ? null : 1);
                    if (rep.item) {
                        for (let x in rep.item) {
                            item[x] = rep.item[x];
                        }
                        this.initItem(item);
                    }
                    if (callback) callback(item);
                    return item;
                }
            });
        }
        item.$delete = (callback) => {
            if (!confirm("Voulez vous vraiment supprimer cet enregistrement?"))
                return;
            this.loading = true;
            let path = this.path;
            if (item.id) {
                path += "/" + item.id;
            }
            return this.http
                .delete(path)
                .then(rep => {
                    this.load(1);
                    if (callback) callback(rep);
                    return rep;
                });
        }
        item.$open = (dialogname) => {
            return this.emit("open:" + dialogname, item);
        }
        return item;
    }
    newItem(item = {}) {
        item = this.initItem(item);
        delete item.id;

        return item;
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
}