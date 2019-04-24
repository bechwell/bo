import { Component } from '@angular/core';
import { GsService } from './gs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bo';
  url = "";
  constructor(private gs: GsService) {

  }
}
