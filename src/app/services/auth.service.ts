import { Injectable } from '@angular/core';
import { CommonConst } from '../const/common-const';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public constructor(
    private activatedRoute: ActivatedRoute
  ) {
    //呼び出し元画面からのパラメータ取得
    this.activatedRoute.queryParams.subscribe(params => {
      //新しいウィンドウか(ポップアップかどうかの判定に利用)
      this.g_new_winFlg = params['new_winFlg'];
    });
  }

  private g_new_winFlg: string = "";

  /**
   * 不正遷移チェックキーを設定する
   */
  private setTransitionKey() {
    sessionStorage.setItem(CommonConst.TRANSITION_KEY, CommonConst.TRANSITION_VALUE);
  }

  /**
   * 不正遷移チェックキーを削除する
   */
  private removeTransitionKey() {
    sessionStorage.removeItem(CommonConst.TRANSITION_KEY);
  }

  /**
   * 不正遷移を考慮したwindow.open
   */
  public windowOpen(x_url: string, x_window_nm: string, x_features: string): Window {
    //ポップアップ画面を開いているか判定（ポップアップ表示時：false）
    if ("1" != this.g_new_winFlg) {
      //ポップアップ画面以外の表示の場合は、不正遷移チェックを実行する
      //不正遷移チェックキー設定
      this.setTransitionKey();

      var p_windowRef: Window | null = window.open(x_url, x_window_nm, x_features);

      //不正遷移チェックキー削除
      this.removeTransitionKey();
    } else {
      // ポップアップ画面の表示の場合は、URL編集不可のため不正遷移チェックを行わない
      var p_windowRef: Window | null = window.open(x_url, x_window_nm, x_features);
    }
    return p_windowRef!;
  }
}
