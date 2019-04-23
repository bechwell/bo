import {
  Component,
  OnInit,
  TemplateRef,
  Input,
  ViewChild
} from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"]
})
export class DialogComponent implements OnInit {
  modalRef: BsModalRef;
  @ViewChild("template")
  template: TemplateRef<any>;
  private _dialogName: any;

  @Input() lg: boolean;
  @Input() xl: boolean;
  @Input() sm: boolean;

  loading: boolean = false;
  get name() {
    return this._dialogName;
  }
  @Input()
  set name(val: string) {
    this._dialogName = val;
    if (this._mdl && this._dialogName) {
      this._mdl[this._dialogName] = this;
    }
  }
  private _mdl: any;
  get mdl() {
    return this._mdl;
  }
  @Input()
  set mdl(val: any) {
    this._mdl = val;
    this._mdl = this._mdl || {};
    if (this._mdl && this._dialogName) {
      this._mdl[this._dialogName] = this;
    }
  }

  constructor(private modalService: BsModalService) {}
  open() {
    this.modalRef = this.modalService.show(this.template, {
      class: "modal-" + (this.lg ? "lg" : this.sm ? "sm" : this.xl ? "xl" : "")
    });
  }
  hide() {
    this.modalRef.hide();
  }
  show() {
    this.open();
  }
  valider(actionCallBack) {
    this.loading = true;
    actionCallBack().then(rep => {
      this.loading = false;
      if (rep) {
        this.hide();
      }
    });
  }
  ngOnInit() {}
}
