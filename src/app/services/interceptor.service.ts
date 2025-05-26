import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  public constructor(
    private loginService: LoginService
  ) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //ログイン情報から従業員番号を取得する
    let enpNo: string = this.loginService.getEmpNo();

    if (undefined != enpNo) {
      const authReq = req.clone({ headers: req.headers.append('login-info', this.loginService.getEmpNo()) });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
