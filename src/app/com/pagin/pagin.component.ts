import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "pagin",
  templateUrl: "./pagin.component.html",
  styleUrls: ["./pagin.component.scss"]
})
export class PaginComponent implements OnInit {
  private _crud: any = null;
  private list = [];
  @Input()
  set crud(val: any) {
    this._crud = val;
    if (this._crud) {
      this._crud.on("ready", () => {
        this.actPagination();
      });
    }
  }
  constructor() {}
  actPagination() {
    this.list = [];
    if (!this._crud) return;
    this.list = getPaginationList(this._crud.page, this._crud.nbrPages);
  }
  ngOnInit() {}
  goto(page) {
    if (this._crud) {
      this._crud.load(page);
    }
  }
}

function getPaginationList(page, nbrPages, limitpages = 4) {
  if (nbrPages <= 1) return [];
  var list = [];
  list.push({
    type: "previous",
    key: 0,
    disabled: page === 1,
    page: page > 1 && page - 1
  });
  list.push({
    type: "page",
    page: 1,
    key: 1,
    active: page === 1,
    disabled: page === 1
  });
  if (page > limitpages + 2) list.push({ type: "suparator", key: -1 });
  for (
    var i = Math.max(2, page - limitpages);
    i <= Math.min(nbrPages - 1, page + limitpages);
    i++
  ) {
    list.push({
      type: "page",
      page: i,
      key: i,
      active: page === i,
      disabled: page === i
    });
  }
  if (page < nbrPages - limitpages - 1)
    list.push({ type: "suparator", key: -2 });
  list.push({
    type: "page",
    page: nbrPages,
    key: nbrPages,
    active: page === nbrPages,
    disabled: page === nbrPages
  });
  list.push({
    type: "next",
    key: nbrPages + 1,
    disabled: page === nbrPages,
    page: page < nbrPages && page + 1
  });
  return list;
}
