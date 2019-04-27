import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { GsService } from './../../gs.service';

@Component({
  selector: 'wform',
  templateUrl: './wform.component.html',
  styleUrls: ['./wform.component.scss']
})
export class WformComponent implements OnInit {
  public loading = false;
  @Input() public data: any = {};
  @Input() public api: string = "";
  @Output() onResult: EventEmitter<any> = new EventEmitter();
  @Output() onEvent: EventEmitter<any> = new EventEmitter();
  constructor(public gs: GsService) { }
  ngOnInit() {
  }

  submit() {
    this.loading = true;
    this.onEvent.emit({ event: "submit", data: this.data })
    return this.gs.post(this.api, this.data).then(result => {
      this.loading = false;
      this.onEvent.emit({ event: "responce", result: result, data: this.data })
      this.onResult.emit({ result: result, data: this.data })
      return result;
    });
  }
}
