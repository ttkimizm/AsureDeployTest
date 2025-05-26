import { Inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { LoginUserInfo } from '../models/user-info.model';
import { ParamMap } from '@angular/router';
import { CommonConst } from '../const/common-const';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';
import { environment } from '../../environments/environment';
import { AjaxService } from '../services/ajax.service';
import { CommonLogicService } from '../services/common-logic.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  private DEBUG_LOGIN_USERID: string = "DebugLoginUser";   // デバッグログイン時のユーザーID
  private DEBUG_LOGIN_MODE_KEY: string = "DebugLoginMode"; // デバッグログインモードのキー（URL引数）
  private DEBUG_LOGIN_MODE_ON: string = "ON";              // デバッグログインモードON
  private DEBUG_LOGIN_MODE_OFF: string = "OFF";            // デバッグログインモードOFF
  private PROGRAM_ID: string = "ProgramId";                //未処理一覧などの特定の画面に遷移するための画面ID
  private NEW_FLAG: string = "new_winFlg";
  private SIDE_FLAG: string = "side_flg";
  private KEY_FEILD: string = "KeyFeild";
  private POWER_SITE_KEY: string = 'KEY';
  private isLoggedIn: boolean = false;
  private loginUserInfo: LoginUserInfo = new LoginUserInfo();

  public constructor(
    private router: Router,
    private loginService: LoginService,
    private authService: MsalService,
    private ajaxService: AjaxService,
    private commonLogic: CommonLogicService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration
  ) { }

  public async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    if (this.commonLogic.isClientRendering()) {
      let logoutFlg: string | null = sessionStorage.getItem(CommonConst.LOGOUT_FLG);

      if ('1' == logoutFlg) {
        let logoutPtnCd: string | null = sessionStorage.getItem(CommonConst.LOGOUT_PTNCD);
        this.router.navigate(['logout'], { queryParams: { new_winFlg: '1', patterncd: logoutPtnCd || '0' } });
      }
      else {
        let azureRedFlg: string | null = sessionStorage.getItem(CommonConst.AZURE_REDIRECT_FLG);
        if (null == azureRedFlg) {
          azureRedFlg = '0';
        }
        //this.userInfoを UserInfo|null で定義すると書き換えが多く大変なため、ここだけ"null"で定義(下のif文は問題なく判別可)
        this.loginUserInfo = this.loginService.getUserInfo();

        if (null == this.loginUserInfo || '1' == azureRedFlg || next.queryParamMap.get('KEY')) {
          //認証されていない場合、シングルサインオンチェック
          await this.checkLogin(next.queryParamMap)
            .then(async res => {
              if (res && null != this.loginService.getEmpNo()) {
                //メンテナンス中チェック
                if (await this.checkMaintenance()) {
                  this.router.navigate(['pmtay0400'], { queryParams: { new_winFlg: 1 } }); //メンテナンス通知画面に遷移
                } else {
                  //M-TRIPシステム利用可
                  if (1 !== this.loginUserInfo.SESSION_LOGINUSER_INFO.SESSION_LOGINUSER_SYSTEM_NOT_AVAILABLE) {
                    //初期表示時の遷移先として"null"から""へ変更
                    let programId: string | null = next.queryParamMap.get(this.PROGRAM_ID);
                    if (undefined != programId && null != programId) {
                      let newFlg: string | null = next.queryParamMap.get(this.NEW_FLAG);
                      let sideFlg: string | null = next.queryParamMap.get(this.SIDE_FLAG);
                      if (undefined == newFlg || null == newFlg) {
                        newFlg = '0';
                      }
                      if (undefined == sideFlg || null == sideFlg) {
                        sideFlg = '0';
                      }

                      let queryParamsObj: any = {};
                      queryParamsObj.new_winFlg = newFlg;
                      queryParamsObj.side_flg = sideFlg;

                      //業務依頼側の未処理一覧から遷移してきた場合
                      let keyFeild: string | null = next.queryParamMap.get(this.KEY_FEILD);
                      let keyId: string = '';
                      if (undefined != keyFeild && null != keyFeild) {
                        keyId = next.queryParamMap.get(keyFeild)!;
                        queryParamsObj[keyFeild] = keyId;
                        queryParamsObj['vd_program_id'] = next.queryParamMap.get('vd_program_id');
                      }

                      this.router.navigate([programId], { queryParams: queryParamsObj });
                    } else {
                      console.log('認証OK');
                    }
                  } else {
                    //システム利用不可
                    //セッション情報を全てクリア
                    sessionStorage.clear();
                    this.router.navigate(['logout'], { queryParams: { new_winFlg: 1, patterncd: 2 } }); //ログアウト画面に遷移
                  }
                }
              } else {
                //ログインエラー
                sessionStorage.setItem(CommonConst.LOGOUT_FLG, '1');
                sessionStorage.setItem(CommonConst.LOGOUT_PTNCD, '1');
                this.router.navigate(['logout'], { queryParams: { new_winFlg: 1, patterncd: 1 } });  //システムエラー画面に認証エラーパターンで遷移
              }
            });
        } else {
          if (null != this.loginService.getEmpNo()) {
            // 既に認証されている場合は、メンテナンス中かの確認だけ行う
            if (await this.checkMaintenance()) {
              this.router.navigate(['pmtay0400'], { queryParams: { new_winFlg: 1 } }); //メンテナンス通知画面に遷移
            }
            console.log('認証OK');
          } else {
            //ログインエラー
            sessionStorage.setItem(CommonConst.LOGOUT_FLG, '1');
            sessionStorage.setItem(CommonConst.LOGOUT_PTNCD, '1');
            this.router.navigate(['logout'], { queryParams: { new_winFlg: 1, patterncd: 1 } });  //システムエラー画面に認証エラーパターンで遷移
          }
        }
      }
    }
    return true;
  }

  /**
   * ログイン状態を確認します。
   * ログイン状態ならログイン情報が取得でき、未ログインの場合は空のオブジェクトが渡されます。
   */
  private async checkLogin(x_params: ParamMap): Promise<boolean> {
    //シングルサインオンキー取得して、シングルサインオンチェック
    let key: string | null = x_params.get('KEY');
    console.log('GetUserInfoキー', key);
    //デバッグモードパラメータ
    let debugMode: string | null = x_params.get(this.DEBUG_LOGIN_MODE_KEY);
    let debugUser: string | null = x_params.get(this.DEBUG_LOGIN_USERID);
    //初期化処理
    // this.userInfo = new UserInfo();
    await this.clearInfo();
    this.loginService.setUserInfo(this.loginUserInfo);
    //デバッグモードによるユーザー情報取得
    if (this.DEBUG_LOGIN_MODE_ON == debugMode) {
      await this.getUserInfoInDebugMode(debugUser);
    }
    //シングルサインオンによるユーザー情報取得
    else if (null != key) {
      sessionStorage.setItem(CommonConst.SSO_KEY, key);
      if (!await this.getUserInfoInSingleSignOn(key)) {
        return false;
      }
    }
    //AzureADによるユーザー情報取得
    else {
      return await this.certificationAzureAD();
    }
    return true;
  }

  /**
   * AzureAD認証処理
   * @returns boolean
   */
  private async certificationAzureAD() {
    console.log('AzureAdモード');
    await this.authService.instance.handleRedirectPromise();
    // アカウント取得
    let account = this.authService.instance.getAllAccounts();
    console.log('ac1:', account);
    if (!(account && account.length > 0)) {
      console.log('ログイン');
      this.azureLogin();
      await this.authService.instance.handleRedirectPromise();
      account = this.authService.instance.getAllAccounts();
    }
    console.log('ac2:', account);
    // Token情報が含まれているアカウント情報取得
    // アカウント情報がない場合、エラーが発生し、処理を終了させる
    const p_accessToken = await this.getAzureAccessToken(account[0]);
    if (account && account.length > 0) {
      console.log('アカウント情報あり');
      sessionStorage.setItem(CommonConst.AZURE_REDIRECT_FLG, '0');
      this.ajaxService.setRequestHeader('Authorization', p_accessToken);
      let result: any = await this.ajaxService.httpGet(environment.azure_graph_url + '?$select=onPremisesSamAccountName');
      if (
        !this.ajaxService.errFlg &&
        !await this.getUserInfoInAzureAd(result.onPremisesSamAccountName)
      ) {
        console.log('getUserInfo取得エラー');
        return false;
      }
    }
    return true;
  }

  /**
   * AzureADログイン
   */
  private azureLogin() {
    if (this.msalGuardConfig.authRequest) {
      console.log('azureLogin1');
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      console.log('azureLogin2');
      this.authService.loginRedirect();
    }
  }

  /**
   * AzureAD AccessToken取得
   * @returns string
   */
  private async getAzureAccessToken(account: any) {
    // AcessToken取得
    const account_detail = await this.authService.instance.acquireTokenSilent({
      scopes: ['user.read'],
      account: account,
    });
    return account_detail.accessToken;
  }

  /**
   * Exception発生時の処理
   */
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    this.router.navigate(['pmtay0500'], { queryParams: { new_winFlg: 1 } }); //システムエラー画面に遷移
    return Promise.reject(error.message || error);
  }

  /**
   * メンテナンス状況確認
   */
  private async checkMaintenance(): Promise<boolean> {
    this.ajaxService.setRequestParameter('userinfo', JSON.stringify(this.loginService.getUserInfo()));
    let result: any = await this.ajaxService.httpPost('../pmt_web/pmtlogin/chkmainte');
    if (this.ajaxService.errFlg) throw this.handleError(result);
    return result ? true : false;
  }

  /**
   * ログイン構造体初期化
   */
  private async clearInfo() {
    this.loginUserInfo = new LoginUserInfo();
    this.loginUserInfo = {
      SESSION_LOGINUSER_INFO: {},          //ログインユーザ情報 単行
      SESSION_LOGINUSER_SOSIKI: [],         //ログインユーザの配属情報
      SESSION_LOGINUSER_ROLE_CD: [],        //ログインユーザの権限コード
      SESSION_LOGINUSER_ROLE_CD_ORG: [],    //ログインユーザのオリジナル権限コード
      SESSION_LOGINUSER_PRINCIPAL: [],      //ログインユーザの被代理人情報
      SESSION_LOGINUSER_BUSYO_CD: [],       //ログインユーザの部署コード
      SESSION_LOGINUSER_TEAM_BUSYO_CD: [],  //ログインユーザのチーム部署コード
      SESSION_LOGINUSER_BUSYO_CD_KAI: [],   //ログインユーザの下位部署コード
      SESSION_LOGINUSER_KNM_BUSYO_CD: []    //ログインユーザの兼務部署コード
    };
  }

  /**
   * デバッグモードによるユーザー情報取得
   */
  private async getUserInfoInDebugMode(x_debug_user: string | null) {
    return await this.getUserInfoInCommon(
      '../pmt_web/pmtlogin/getdebuginfo',
      'emp_no', x_debug_user
    );
  }

  /**
   * シングルサインオンによるユーザー情報取得
   */
  private async getUserInfoInSingleSignOn(x_key: string): Promise<boolean> {
    return await this.getUserInfoInCommon(
      '../pmt_web/pmtlogin/getuserinfo',
      'key', x_key
    );
  }

  /**
   * AzureADによるユーザー情報取得
   */
  private async getUserInfoInAzureAd(x_emp_no: string): Promise<boolean> {
    return await this.getUserInfoInCommon(
      '../pmt_web/pmtlogin/getazuread',
      'emp_no', x_emp_no,
      'Access-Control-Allow-Origin', '*'
    );
  }

  private async getUserInfoInCommon(
    url: string,
    paramKey: string, paramValue: string | null,
    headKey?: string, headValue?: string
  ): Promise<boolean> {
    this.ajaxService.setRequestParameter(paramKey, paramValue);
    if (headKey) this.ajaxService.setRequestHeader(headKey, headValue);
    let result: any = await this.ajaxService.httpPost(url);
    if (this.ajaxService.errFlg) throw this.handleError(result);
    if (null != result && null == result.ERROR) {
      await this.setUserInfo(result);
      return true;
    }
    return false;
  }

  /**
   * ユーザー情報セット
   * 取得したユーザー情報をセッションにセットする
   */
  private async setUserInfo(x_data: any) {
    for (let i = 0; i < x_data.length; i++) {
      console.log(x_data[i]);
      if (x_data[i].SESSION_LOGINUSER_INFO) {
        //ログインユーザ情報
        this.loginUserInfo.SESSION_LOGINUSER_INFO.SESSION_LOGINUSER_ID = x_data[i].SESSION_LOGINUSER_INFO.SESSION_LOGINUSER_ID;      //ユーザID
        this.loginUserInfo.SESSION_LOGINUSER_INFO.SESSION_LOGINUSER_NAME = x_data[i].SESSION_LOGINUSER_INFO.SESSION_LOGINUSER_NAME;  //氏名
        this.loginUserInfo.SESSION_LOGINUSER_INFO.SESSION_LOGINUSER_SYSTEM_NOT_AVAILABLE = x_data[i].SESSION_LOGINUSER_INFO.SESSION_LOGINUSER_SYSTEM_NOT_AVAILABLE;  //土木業務管理システム利用不可
        this.loginUserInfo.SESSION_LOGINUSER_INFO.SESSION_HNM_BUSYO_CD = x_data[i].SESSION_LOGINUSER_INFO.SESSION_HNM_BUSYO_CD;            //本務配属部署コード
        this.loginUserInfo.SESSION_LOGINUSER_INFO.SESSION_HNM_BUSYO_NM = x_data[i].SESSION_LOGINUSER_INFO.SESSION_HNM_BUSYO_NM;            //本務配属部署名称
        this.loginUserInfo.SESSION_LOGINUSER_INFO.SESSION_HNM_BU_BUSYO_CD = x_data[i].SESSION_LOGINUSER_INFO.SESSION_HNM_BU_BUSYO_CD;      //本務配属_部_部署コード
        this.loginUserInfo.SESSION_LOGINUSER_INFO.SESSION_HNM_SITU_BUSYO_CD = x_data[i].SESSION_LOGINUSER_INFO.SESSION_HNM_SITU_BUSYO_CD;  //本務配属_室_部署コード
        this.loginUserInfo.SESSION_LOGINUSER_INFO.SESSION_LOGIN_TIME = new Date();
      } else if (x_data[i].SESSION_LOGINUSER_SOSIKI) {
        //ログインユーザの配属情報
        for (let j = 0; j < x_data[i].SESSION_LOGINUSER_SOSIKI.length; j++) {
          this.loginUserInfo.SESSION_LOGINUSER_SOSIKI.push(
            {
              SESSION_BUSYO_CD: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_BUSYO_CD,						//部署コード
              SESSION_BUSYO_NM: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_BUSYO_NM,						//部署名称
              SESSION_SSK_NM_DISP: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_SSK_NM_DISP,				//組織名称(表示用)
              SESSION_SSK_NM_KAISO: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_SSK_NM_KAISO,				//組織名称(階層用)
              SESSION_BUSYO_SYBT_KBN: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_BUSYO_SYBT_KBN,			//部署種別区分
              SESSION_SSK_KBN: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_SSK_KBN,						//組織区分
              SESSION_HAIZOKU_KBN: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_HAIZOKU_KBN,				//配属区分
              SESSION_DAIHYO_EMP_NO: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_DAIHYO_EMP_NO,			//代表従業員番号
              SESSION_BU_BUSYO_CD: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_BU_BUSYO_CD,				//部_部室コード
              SESSION_BU_BUSYO_NM: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_BU_BUSYO_NM,				//部_部署名称
              SESSION_BU_SSK_NM_DISP: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_BU_SSK_NM_DISP,			//部_組織名称(表示用)
              SESSION_BU_SSK_NM_KAISO: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_BU_SSK_NM_KAISO,		//部_組織名称(階層用)
              SESSION_SITU_BUSYO_CD: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_SITU_BUSYO_CD,			//室_部署コード
              SESSION_SITU_BUSYO_NM: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_SITU_BUSYO_NM,			//室_部署名称
              SESSION_SITU_SSK_NM_DISP: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_SITU_SSK_NM_DISP,		//室_組織名称(表示用)
              SESSION_SITU_SSK_NM_KAISO: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_SITU_SSK_NM_KAISO,	//室_組織名称(階層用)
              SESSION_HNM_KNM_KBN: x_data[i].SESSION_LOGINUSER_SOSIKI[j].SESSION_HNM_KNM_KBN,				//利用者DB本務兼務区分
            }
          );
        }
      } else if (x_data[i].SESSION_LOGINUSER_ROLE_CD) {
        //ログインユーザの権限コード
        for (let j = 0; j < x_data[i].SESSION_LOGINUSER_ROLE_CD.length; j++) {
          this.loginUserInfo.SESSION_LOGINUSER_ROLE_CD.push(
            {
              ROLE_CD: x_data[i].SESSION_LOGINUSER_ROLE_CD[j].ROLE_CD
            }
          )
        }
      } else if (x_data[i].SESSION_LOGINUSER_ROLE_CD_ORG) {
        //ログインユーザのオリジナル権限コード
        for (let j = 0; j < x_data[i].SESSION_LOGINUSER_ROLE_CD_ORG.length; j++) {
          this.loginUserInfo.SESSION_LOGINUSER_ROLE_CD_ORG.push(
            {
              ROLE_CD: x_data[i].SESSION_LOGINUSER_ROLE_CD_ORG[j].ROLE_CD
            }
          )
        }
      } else if (x_data[i].SESSION_LOGINUSER_PRINCIPAL) {
        //ログインユーザの被代理人情報（本人含む）
        for (let j = 0; j < x_data[i].SESSION_LOGINUSER_PRINCIPAL.length; j++) {
          this.loginUserInfo.SESSION_LOGINUSER_PRINCIPAL.push(
            {
              BUSYO_CD: x_data[i].SESSION_LOGINUSER_PRINCIPAL[j].BUSYO_CD,
              EMP_NO: x_data[i].SESSION_LOGINUSER_PRINCIPAL[j].EMP_NO
            }
          )
        }
      } else if (x_data[i].SESSION_LOGINUSER_BUSYO_CD) {
        //ログインユーザの部室情報
        for (let j = 0; j < x_data[i].SESSION_LOGINUSER_BUSYO_CD.length; j++) {
          this.loginUserInfo.SESSION_LOGINUSER_BUSYO_CD.push(
            {
              BUSYO_CD: x_data[i].SESSION_LOGINUSER_BUSYO_CD[j]
            }
          )
        }
      } else if (x_data[i].SESSION_LOGINUSER_TEAM_BUSYO_CD) {
        //ログインユーザのチーム情報
        for (let j = 0; j < x_data[i].SESSION_LOGINUSER_TEAM_BUSYO_CD.length; j++) {
          this.loginUserInfo.SESSION_LOGINUSER_TEAM_BUSYO_CD.push(
            {
              BUSYO_CD: x_data[i].SESSION_LOGINUSER_TEAM_BUSYO_CD[j]
            }
          )
        }
      } else if (x_data[i].SESSION_LOGINUSER_BUSYO_CD_KAI) {
        //ログインユーザの下位組織情報
        for (let j = 0; j < x_data[i].SESSION_LOGINUSER_BUSYO_CD_KAI.length; j++) {
          this.loginUserInfo.SESSION_LOGINUSER_BUSYO_CD_KAI.push(
            {
              BUSYO_CD: x_data[i].SESSION_LOGINUSER_BUSYO_CD_KAI[j].SESSION_BUSYO_CD
            }
          )
        }
      } else if (x_data[i].SESSION_LOGINUSER_KNM_BUSYO_CD) {
        //ログインユーザの兼務組織情報
        for (let j = 0; j < x_data[i].SESSION_LOGINUSER_KNM_BUSYO_CD.length; j++) {
          this.loginUserInfo.SESSION_LOGINUSER_KNM_BUSYO_CD.push(
            {
              BUSYO_CD: x_data[i].SESSION_LOGINUSER_KNM_BUSYO_CD[j].SESSION_BUSYO_CD
            }
          )
        }
      }
    }
    this.loginService.setUserInfo(this.loginUserInfo);
    //サイドメニューの初期処理を呼び出している
    // window.document.getElementById("sidemenu")!.focus();
  }
}
