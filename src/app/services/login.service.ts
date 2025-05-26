import { Injectable } from '@angular/core';
import { LoginUserInfo, UserInfo } from '../models/user-info.model';
import { CommonConst } from '../const/common-const';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public constructor() { }

  public setUserInfo(loginUserInfo: LoginUserInfo): void {
    sessionStorage.setItem(CommonConst.USER_INFO_KEY, JSON.stringify(loginUserInfo));
  }

  /*
  * ログイン情報取得
  */
  public getUserInfo(): LoginUserInfo {
    //ストレージに格納されたログイン情報を取得する
    return JSON.parse(sessionStorage.getItem(CommonConst.USER_INFO_KEY) || "null");
  }

  /*
  * 従業員番号取得
  */
  public getEmpNo(): string {
    // //ストレージに格納されたログイン情報を取得する
    return this.getUserInfoData<string>("SESSION_LOGINUSER_ID");
  }

  /*
  * 従業員名取得
  */
  public getEmpNm(): string {
    // //ストレージに格納されたログイン情報を取得する
    return this.getUserInfoData<string>("SESSION_LOGINUSER_NAME");
  }

  /*
  * ログイン時間取得
  */
  public getLoginTime(): Date {
    // //ストレージに格納されたログイン情報を取得する
    return this.getUserInfoData<Date>("SESSION_LOGIN_TIME");
  }

  /*
  * 本務配属部室コード取得
  * 本務が無い場合はNULL
  */
  public getHnmBstCdRestrict(): string {
    return this.getUserInfoData<string>("SESSION_HNM_SCT_CD");
  }

  private getUserInfoData<T>(key: keyof UserInfo): T {
    let loginUserInfo: LoginUserInfo = this.getUserInfo();
    return loginUserInfo.SESSION_LOGINUSER_INFO[key] as T;
  }

  /*
  * ログインユーザー情報が取得出来ているか判定する
  */
  public isValidUserInfo(): boolean {
    //ストレージに格納されたログイン情報を取得する
    var loginUserInfo: LoginUserInfo = this.getUserInfo();
    //従業員番号が取得出来ない場合、false
    if (null == loginUserInfo) {
      return false;
    }
    if (undefined == loginUserInfo.SESSION_LOGINUSER_INFO.SESSION_LOGINUSER_ID) {
      return false;
    }
    return true;
  }
}
