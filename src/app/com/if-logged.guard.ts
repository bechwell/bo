import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GsService } from './../gs.service';

@Injectable({
  providedIn: 'root'
})
export class IfLoggedGuard implements CanActivate {
  constructor(private gs: GsService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.gs.user) {
      this.gs.Router.navigateByUrl("/login");
    }
    return !!this.gs.user;
  }
}
