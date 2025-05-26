import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonConst } from '../const/common-const';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public constructor(
    private router: Router,
  ) { }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let trasKey: string | null = sessionStorage.getItem(CommonConst.TRANSITION_KEY);
    if ('valid' != trasKey) {
      //不正遷移
      console.log("auth.guard.tsの不正遷移チェックエラー");
      //システムエラー画面に遷移
      this.router.navigate(['pmtay0500'], { queryParams: { new_winFlg: 1 } });
    }
    return true;
  }
}
