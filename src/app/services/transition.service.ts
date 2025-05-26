import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransitionService {

  private g_searchParamsArray: any = new Array();
  private g_breadcrumbParams: any = [];
  private g_backFlg?: boolean;
  private g_scroll?: number;
  private g_sort_orderArray: any = new Array();
  private g_sort_countArray: any = new Array();
  private g_sort_messageArray: any = new Array();

  public constructor() { }

  /*  
  * 検索条件　受け渡し
  * @params: 検索条件
  * @x_dispName: 画面ID
  */
  public setSearchParams(params: any, x_dispName: String): void {
    let p_searchParams: any;
    let p_searchParamsMap: any = new Map();
    //検索条件パラメータセット
    // 既に追加している場合は削除する
    if (undefined != this.g_searchParamsArray && this.g_searchParamsArray.length > 0) {
      let p_foundFlg = false;
      // list<map>を回す
      for (let i = 0; i < this.g_searchParamsArray.length; i++) {
        // mapのkeyを取得
        for (let key of this.g_searchParamsArray[i].keys()) {
          // key(画面ID)と現在表示している画面IDが同じ場合
          if (key == x_dispName) {
            // listから削除する
            this.g_searchParamsArray.splice(i, 1);
            // 同じ画面IDのものを見つめた場合trueとしてすべてのループ処理から抜ける
            p_foundFlg = true;
          }
        }
        if (p_foundFlg) {
          break;
        }
      }
    }
    //ディープコピーに変更
    p_searchParams = JSON.parse(JSON.stringify(params));
    // key: 画面ID　value: 検索条件でmapに詰める
    p_searchParamsMap.set(x_dispName, p_searchParams);
    // listにaddする
    this.g_searchParamsArray.push(p_searchParamsMap);
  }

  /*  
  * 検索条件　取得
  */
  public getSearchParams(x_dispName: String): any {
    // 戻り値用
    let p_getParamData = null;
    // 画面IDで検索する
    if (undefined != this.g_searchParamsArray && this.g_searchParamsArray.length > 0) {
      let p_foundFlg = false;
      // list<map>を回す
      for (let i = 0; i < this.g_searchParamsArray.length; i++) {
        // mapのkeyを取得
        for (let key of this.g_searchParamsArray[i].keys()) {
          // key(画面ID)と現在表示している画面IDが同じ場合
          if (key == x_dispName) {
            // 検索条件を取得
            p_getParamData = this.g_searchParamsArray[i].get(key);
            p_foundFlg = true;
          }
        }
        if (p_foundFlg) {
          break;
        }
      }
    }
    //検索条件パラメータ取得
    return p_getParamData;
  }

  /*  
  * パンくずリスト　受け渡し
  */
  public setBreadcrumbParams(params: any[]): void {
    //パンくずリストパラメータセット
    this.g_breadcrumbParams = [];
    this.g_breadcrumbParams = params;
  }

  /*  
  * パンくずリスト　取得
  */
  public getBreadcrumbParams(): any {
    //検索条件パラメータ取得
    return this.g_breadcrumbParams;
  }

  /*  
  * スクロール　受け渡し
  */
  public setScroll(scroll: number): void {
    //検索条件パラメータセット
    this.g_scroll = scroll;
  }

  /*  
  * スクロール　取得
  */
  public getScroll(): any {
    //検索条件パラメータ取得
    return this.g_scroll;
  }

  /*  
  * 戻るフラグON
  * 戻るボタンが押されたがどうかを判定するためのフラグをONにする
  */
  public setBackFlgOn(): void {
    //クエリパラメータセット
    this.g_backFlg = true;
  }

  /*  
  * 戻るフラグOFF
  * 戻るボタンが押されたがどうかを判定するためのフラグをOFFにする
  */
  public setBackFlgOff(): void {
    //クエリパラメータセット
    this.g_backFlg = false;
  }

  /*  
  * クエリパラメータ　取得
  * 戻るボタンが押されたがどうかを判定するためのフラグを取得する
  */
  public getBackFlg(): boolean {
    //クエリパラメータセット
    return this.g_backFlg ?? false;
  }

  /*  
  * ソート順　受け渡し
  */
  public setSortOrder(params: any, x_dispName: String): void {
    let p_sort_order: any = [];
    let p_sortOrderMap: any = new Map();
    //検索条件パラメータセット
    // 既に追加している場合は削除する
    if (undefined != this.g_sort_orderArray && this.g_sort_orderArray.length > 0) {
      let p_foundFlg = false;
      // list<map>を回す
      for (let i = 0; i < this.g_sort_orderArray.length; i++) {
        // mapのkeyを取得
        for (let key of this.g_sort_orderArray[i].keys()) {
          // key(画面ID)と現在表示している画面IDが同じ場合
          if (key == x_dispName) {
            // listから削除する
            this.g_sort_orderArray.splice(i, 1);
            // 同じ画面IDのものを見つめた場合trueとしてすべてのループ処理から抜ける
            p_foundFlg = true;
          }
        }
        if (p_foundFlg) {
          break;
        }
      }
    }
    //ディープコピーに変更
    p_sort_order = JSON.parse(JSON.stringify(params));
    // key: 画面ID　value: 検索条件でmapに詰める
    p_sortOrderMap.set(x_dispName, p_sort_order);
    // listにaddする
    this.g_sort_orderArray.push(p_sortOrderMap);
  }

  /*  
  * ソート順　取得
  */
  public getSortOrder(x_dispName: String): any {
    // 戻り値用
    let p_sort_order = null;
    // 画面IDで検索する
    if (undefined != this.g_sort_orderArray && this.g_sort_orderArray.length > 0) {
      let p_foundFlg = false;
      // list<map>を回す
      for (let i = 0; i < this.g_sort_orderArray.length; i++) {
        // mapのkeyを取得
        for (let key of this.g_sort_orderArray[i].keys()) {
          // key(画面ID)と現在表示している画面IDが同じ場合
          if (key == x_dispName) {
            // 検索条件を取得
            p_sort_order = this.g_sort_orderArray[i].get(key);
            p_foundFlg = true;
          }
        }
        if (p_foundFlg) {
          break;
        }
      }
    }
    //検索条件パラメータ取得
    return p_sort_order;
  }

  /*  
  * ソートカウント　受け渡し
  */
  public setSortCount(params: any, x_dispName: String): void {
    let p_sort_count: any = "";
    let p_sort_countMap: any = new Map();
    //検索条件パラメータセット
    // 既に追加している場合は削除する
    if (undefined != this.g_sort_countArray && this.g_sort_countArray.length > 0) {
      let p_foundFlg = false;
      // list<map>を回す
      for (let i = 0; i < this.g_sort_countArray.length; i++) {
        // mapのkeyを取得
        for (let key of this.g_sort_countArray[i].keys()) {
          // key(画面ID)と現在表示している画面IDが同じ場合
          if (key == x_dispName) {
            // listから削除する
            this.g_sort_countArray.splice(i, 1);
            // 同じ画面IDのものを見つめた場合trueとしてすべてのループ処理から抜ける
            p_foundFlg = true;
          }
        }
        if (p_foundFlg) {
          break;
        }
      }
    }
    //ディープコピーに変更
    p_sort_count = JSON.parse(JSON.stringify(params));
    // key: 画面ID　value: 検索条件でmapに詰める
    p_sort_countMap.set(x_dispName, p_sort_count);
    // listにaddする
    this.g_sort_countArray.push(p_sort_countMap);
  }

  /*  
  * ソートカウント　取得
  */
  public getSortCount(x_dispName: String): any {
    // 戻り値用
    let p_sort_count = null;
    // 画面IDで検索する
    if (undefined != this.g_sort_countArray && this.g_sort_countArray.length > 0) {
      let p_foundFlg = false;
      // list<map>を回す
      for (let i = 0; i < this.g_sort_countArray.length; i++) {
        // mapのkeyを取得
        for (let key of this.g_sort_countArray[i].keys()) {
          // key(画面ID)と現在表示している画面IDが同じ場合
          if (key == x_dispName) {
            // 検索条件を取得
            p_sort_count = this.g_sort_countArray[i].get(key);
            p_foundFlg = true;
          }
        }
        if (p_foundFlg) {
          break;
        }
      }
    }
    //検索条件パラメータ取得
    return p_sort_count;
  }

  /*  
  * ソートカウント　受け渡し
  */
  public setSortMsg(params: any, x_dispName: String): void {
    let p_ortMsg: any = [];
    let p_ortMsgMap: any = new Map();
    //検索条件パラメータセット
    // 既に追加している場合は削除する
    if (undefined != this.g_sort_messageArray && this.g_sort_messageArray.length > 0) {
      let p_foundFlg = false;
      // list<map>を回す
      for (let i = 0; i < this.g_sort_messageArray.length; i++) {
        // mapのkeyを取得
        for (let key of this.g_sort_messageArray[i].keys()) {
          // key(画面ID)と現在表示している画面IDが同じ場合
          if (key == x_dispName) {
            // listから削除する
            this.g_sort_messageArray.splice(i, 1);
            // 同じ画面IDのものを見つめた場合trueとしてすべてのループ処理から抜ける
            p_foundFlg = true;
          }
        }
        if (p_foundFlg) {
          break;
        }
      }
    }
    //ディープコピーに変更
    p_ortMsg = JSON.parse(JSON.stringify(params));
    // key: 画面ID　value: 検索条件でmapに詰める
    p_ortMsgMap.set(x_dispName, p_ortMsg);
    // listにaddする
    this.g_sort_messageArray.push(p_ortMsgMap);
  }

  /*  
  * ソートカウント　取得
  */
  public getSortMsg(x_dispName: String): any {
    // 戻り値用
    let p_ortMsg = null;
    // 画面IDで検索する
    if (undefined != this.g_sort_messageArray && this.g_sort_messageArray.length > 0) {
      let p_foundFlg = false;
      // list<map>を回す
      for (let i = 0; i < this.g_sort_messageArray.length; i++) {
        // mapのkeyを取得
        for (let key of this.g_sort_messageArray[i].keys()) {
          // key(画面ID)と現在表示している画面IDが同じ場合
          if (key == x_dispName) {
            // 検索条件を取得
            p_ortMsg = this.g_sort_messageArray[i].get(key);
            p_foundFlg = true;
          }
        }
        if (p_foundFlg) {
          break;
        }
      }
    }
    //検索条件パラメータ取得
    return p_ortMsg;
  }
}
