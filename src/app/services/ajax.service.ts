import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, last, catchError, of, EmptyError, Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AjaxService {

  // HTTP通信異常終了フラグ(true: 異常終了、false: 正常終了)
  public errFlg: boolean = false;

  // HTTPパラメータ設定用オブジェクト
  private reqParam: HttpParams = new HttpParams();

  // HTTPヘッダー設定用オブジェクト
  private reqHeader: HttpHeaders = new HttpHeaders();

  // HTTPレスポンスタイプ設定用フィールド
  private resType: string = '';

  // コンストラクタ
  public constructor(
    private http: HttpClient
  ) { }

  /**
   * リクエストパラメータ設定処理
   * 
   * @param key   設定キー名
   * @param value 設定値
   */
  public setRequestParameter(
    key: string,
    value: string | number | boolean | null | undefined
  ): void {
    this.reqParam.set(key, value ?? '');
  }

  /**
   * リクエストヘッダー設定処理
   * 
   * @param key   設定キー名
   * @param value 設定値
   */
  public setRequestHeader(
    key: string,
    value: string | string[] | null | undefined
  ): void {
    this.reqHeader.set(key, value ?? '');
  }

  /**
   * レスポンスタイプ設定処理
   * 
   * @param value レスポンスタイプ
   */
  public setResponseType(
    value: string | null | undefined
  ): void {
    this.resType = value ?? '';
  }

  /**
   * HTTP通信処理(GET)
   * 
   * @param url             リクエストURL
   * @param errCallBackFunc エラー発生時のコールバック関数(任意)
   * @param finallyFunc     finally実行用コールバック関数(任意)
   * @returns               処理結果
   */
  public async httpGet(
    url: string,
    finallyFunc?: () => Promise<void>
  ): Promise<any> {
    return await this.httpEditResponse<Object>(
      this.http.get(url, await this.getRequestOption()),
      finallyFunc
    );
  }

  /**
   * HTTP通信処理(POST)
   * 
   * @param url             リクエストURL
   * @param errCallBackFunc エラー発生時のコールバック関数(任意)
   * @param finallyFunc     finally実行用コールバック関数(任意)
   * @returns               処理結果
   */
  public async httpPost(
    url: string,
    finallyFunc?: () => Promise<void>
  ): Promise<any> {
    return await this.httpEditResponse<Object>(
      this.http.post(url, await this.getRequestOption()),
      finallyFunc
    );
  }

  /**
   * リクエストオプション取得処理
   * 
   * @returns リクエストオプションオブジェクト
   */
  private async getRequestOption(): Promise<any> {
    let httpOption: any = {};
    if (this.reqParam.keys().length != 0) {
      httpOption.params = this.reqParam;
    }
    if (this.reqHeader.keys().length != 0) {
      httpOption.headers = this.reqHeader;
    }
    if (this.resType !== '') {
      httpOption.responseType = this.resType;
    }
    return httpOption;
  }

  /**
   * HTTP通信結果編集処理
   * 
   * @param httpResponse    HTTP通信結果
   * @param errCallBackFunc エラー発生時のコールバック関数(任意)
   * @param finallyFunc     finally実行用コールバック関数(任意)
   * @returns               処理結果
   */
  private async httpEditResponse<T>(
    httpResponse: Observable<T>,
    finallyFunc?: () => Promise<void>
  ): Promise<any> {
    // 異常終了フラグを初期化(デフォルト:正常終了)
    this.errFlg = false;

    // HTTP通信結果を返却
    // 但し、異常終了した場合でも返却されたオブジェクトがEmptyError方の場合は、
    // 正常終了扱いでundefinedを返却する(toPromise同様)
    return await lastValueFrom(httpResponse.pipe(
      last(),
      catchError((error) => {
        if (error instanceof EmptyError) {
          return of(undefined);
        }
        else {
          throw error;
        }
      })
    )).then((value) => {
      return value;
    }).catch((error) => {
      this.errFlg = true;
      return error;
    }).finally(() => {
      if (finallyFunc) finallyFunc();
    });
  }
}
