import { Injectable, ApplicationRef, Inject, LOCALE_ID, PLATFORM_ID } from '@angular/core';
import { formatDate, DatePipe, isPlatformBrowser } from '@angular/common';
import { CommonConst } from '../const/common-const';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AuthService } from '../services/auth.service';
import { AjaxService } from '../services/ajax.service';
import dayjs, { Dayjs } from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import Encoding from 'encoding-japanese';

@Injectable({
  providedIn: 'root'
})
export class CommonLogicService {

  private halfAndFullRegex: RegExp = new RegExp('(' + Object.keys(CommonConst.HALF_AND_FULL_WIDTH_KATAKANA).join('|') + ')', 'g');
  private halfAndFullObj: any = CommonConst.HALF_AND_FULL_WIDTH_KATAKANA;
  private semiVoicedRegex: RegExp = new RegExp('(' + Object.keys(CommonConst.SEMI_VOICED_SOUND).join('|') + ')', 'g');
  private semiVoicedObj: any = CommonConst.SEMI_VOICED_SOUND;

  public constructor(
    public applicationRef: ApplicationRef,
    public datePipe: DatePipe,
    private httpClient: HttpClient,
    private authService: AuthService,
    private ajax: AjaxService,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // DOMや子コンポーネントにアクセスする場合、
  // isPlatformBrowserがtrue(クライアント側からの読み込み)かどうかを判定する
  public isClientRendering(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /*
  * テキストエリア高さ自動調整
  */
  public textAreaHeightSet(el: HTMLElement, argElmNm: string, initLineH: number = 1): number | void {
    var forEach = Array.prototype.forEach;
    var textarea: HTMLCollection = el.getElementsByTagName("textarea")
    return forEach.call(textarea, function (e) {
      if (argElmNm == e.name) {
        // テキストエリアを小さくするとスクロールがその分ズレるので、予めスクロール位置を取得する
        let scrollX: any = window.scrollX;
        let scrollY: any = window.scrollY;
        // 一旦テキストエリアを小さくしてスクロールバー（縦の長さを取得）
        e.style.height = '1px';
        var wSclollHeight: number = parseInt(e.scrollHeight);
        // 1行の長さを取得する
        var wLineH: number = 10;
        // 最低行の表示エリアにする
        if (wSclollHeight < (wLineH * initLineH * 2)) {
          wSclollHeight = (wLineH * initLineH * 2);
        }
        // テキストエリアの高さを設定する
        e.style.height = (wSclollHeight - 3) + 'px';
        //取得しておいたスクロール位置に戻す
        window.scrollTo(scrollX, scrollY);
        return wSclollHeight;
      } else {
        return
      }
    });
  }

  //ソート順格納配列のクリア処理 ( ソート順: g_sort_order,階層数:number(5,10,15,20,25))
  public clearSort(order: any[], kaiso: any) {
    for (var i = 0; i <= kaiso; i++) {//画面のソートする要素数分クリアする
      order[i] = { value: 1, name: '' };
    }
  }

  /*
  * 文字列をソートのために統一
  * 英数字記号 => 半角
  * カタカナ　=> 全角ひらがな
  */
  public changeString(x_str: any) {
    if (typeof x_str != "string") {
      return x_str;
    }
    //全角英字を半角にする
    x_str = x_str.replace(/[！＂＃＄％＆＇（）＊＋，－．／０-９：；＜＝＞？＠Ａ-Ｚ［＼］＾＿｀ａ-ｚ｛｜｝～]/g, (x: string) => String.fromCharCode(x.charCodeAt(0) - 0xFEE0));
    //半角カナを全角にする
    x_str = x_str.replace(this.halfAndFullRegex, (x: string) => this.halfAndFullObj[x]);
    //カナをかなにする
    x_str = x_str.replace(/[\u30A1-\u30FA]/g, (ch: string) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
    //半濁を取り除くにする
    x_str = x_str.replace(this.semiVoicedRegex, (x: string) => this.semiVoicedObj[x]);
    return x_str.toLowerCase();
  }

  //文字コード大小イコール関係判定処理
  public isJudgeEqualBiggerCode(x_first_obj_nm: any, x_second_obj_nm: any): boolean {
    if (x_first_obj_nm == " " && x_second_obj_nm == " ") {
      return true
    }
    //半濁音も統一して比べる
    let p_first_endode = Encoding.convert(Encoding.stringToCode(this.changeString(x_first_obj_nm)), { to: 'SJIS', from: 'UNICODE' });
    let p_second_endode = Encoding.convert(Encoding.stringToCode(this.changeString(x_second_obj_nm)), { to: 'SJIS', from: 'UNICODE' });
    //同じ値の場合
    if (p_first_endode.toString() == p_second_endode.toString()) {
      //上が同じだった場合に半濁音を1,2に変えてもう一度比べる
      p_first_endode = this.handakuChange(x_first_obj_nm);
      p_second_endode = this.handakuChange(x_second_obj_nm);
      if (p_first_endode.toString() == p_second_endode.toString()) {
        return true;
      } else {
        return this.isJudgeEncod(p_first_endode, p_second_endode);
      }
      //異なる値の場合
    } else {
      return this.isJudgeEncod(p_first_endode, p_second_endode);
    }
  }

  //文字コード大小関係判定処理
  public isJudgeBiggerCode(x_first_obj_nm: any, x_second_obj_nm: any): boolean {
    if (x_first_obj_nm == " " && x_second_obj_nm == " ") {
      return false
    }
    let p_first_endode = Encoding.convert(Encoding.stringToCode(this.changeString(x_first_obj_nm)), { to: 'SJIS', from: 'UNICODE' });
    let p_second_endode = Encoding.convert(Encoding.stringToCode(this.changeString(x_second_obj_nm)), { to: 'SJIS', from: 'UNICODE' });
    //同じ値の場合
    if (p_first_endode.toString() == p_second_endode.toString()) {
      //上が同じだった場合に半濁音を1,2に変えてもう一度比べる
      p_first_endode = this.handakuChange(x_first_obj_nm);
      p_second_endode = this.handakuChange(x_second_obj_nm)
      if (p_first_endode.toString() == p_second_endode.toString()) {
        return false;
      } else {
        return this.isJudgeEncod(p_first_endode, p_second_endode);
      }
      //異なる値の場合
    } else {
      return this.isJudgeEncod(p_first_endode, p_second_endode);
    }
  }

  //文字コードイコール判定処理
  public isJudgeEqualCode(x_first_obj_nm: any, x_second_obj_nm: any): boolean {
    if (x_first_obj_nm == " " && x_second_obj_nm == " ") {
      return true
    }
    let p_first_endode = Encoding.convert(Encoding.stringToCode(this.changeString(x_first_obj_nm)), { to: 'SJIS', from: 'UNICODE' }).toString();
    let p_second_endode = Encoding.convert(Encoding.stringToCode(this.changeString(x_second_obj_nm)), { to: 'SJIS', from: 'UNICODE' }).toString();
    //同じ値の場合
    if (p_first_endode == p_second_endode) {
      p_first_endode = this.handakuChange(x_first_obj_nm).toString();
      p_second_endode = this.handakuChange(x_second_obj_nm).toString();
      if (p_first_endode == p_second_endode) {
        return true;
      } else {
        return false
      }
    } else {
      return false
    }
  }

  //ソートで半濁文字を分ける処理
  public handakuChange(x_first_obj_nm: any) {
    //全角英字を半角にする
    x_first_obj_nm = x_first_obj_nm.replace(/[！＂＃＄％＆＇（）＊＋，－．／０-９：；＜＝＞？＠Ａ-Ｚ［＼］＾＿｀ａ-ｚ｛｜｝～]/g, (x: string) => String.fromCharCode(x.charCodeAt(0) - 0xFEE0)).toLowerCase();
    //半角カナを全角にする
    x_first_obj_nm = x_first_obj_nm.replace(this.halfAndFullRegex, (x: string | number) => this.halfAndFullObj[x]);
    //カナをかなにする
    x_first_obj_nm = x_first_obj_nm.replace(/[\u30A1-\u30FA]/g, (ch: string) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
    x_first_obj_nm = x_first_obj_nm.replace(/[がぎぐげござじずぜぞだぢづでどばびぶべぼゔわ゙を゙]/g, 1);
    x_first_obj_nm = x_first_obj_nm.replace(/[ぱぴぷぺぽ]/g, 2);
    x_first_obj_nm = x_first_obj_nm.replace(/[あ-ん]/g, 0);
    return Encoding.convert(Encoding.stringToCode(x_first_obj_nm), { to: 'SJIS', from: 'UNICODE' });
  }

  //文字コード同士の大小を比較する
  public isJudgeEncod(x_first_endode: string | any[], x_second_endode: string | any[]): boolean {
    let len = 0;
    if (x_first_endode.length >= x_second_endode.length) {
      len = x_first_endode.length;
    } else {
      len = x_second_endode.length;
    }
    for (var i = 0; i < len; i++) {
      if (x_first_endode[i] > x_second_endode[i] || this.isEmpty(x_second_endode[i])) {
        //文字コードが大きい
        return true;
      } else if (x_first_endode[i] == x_second_endode[i]) {
        //同じ文字コードの場合次の文字コードで比較
      } else if (x_first_endode[i] < x_second_endode[i] || this.isEmpty(x_first_endode[i])) {
        //文字コードが小さい
        return false;
      }
    }
    return false;
  }


  //resultItemのソート変更処理 引数 ( 検索結果:g_result_Items, ソート順: g_sort_order, 各画面のプライマリーキー: x_primaryKey )
  public orderChange5(resultItems: any[], order: any[], x_primaryKey?: undefined | string) {
    resultItems.sort((firstObject: any, secondObject: any) =>
      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[0].name]), this.nullChange(secondObject[order[0].name]))) ? order[0].value :
        (this.isJudgeEqualCode(this.nullChange(firstObject[order[0].name]), this.nullChange(secondObject[order[0].name]))) ? (
          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[1].name]), this.nullChange(secondObject[order[1].name]))) ? order[1].value :
            (this.isJudgeEqualCode(this.nullChange(firstObject[order[1].name]), this.nullChange(secondObject[order[1].name]))) ? (
              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[2].name]), this.nullChange(secondObject[order[2].name]))) ? order[2].value :
                (this.isJudgeEqualCode(this.nullChange(firstObject[order[2].name]), this.nullChange(secondObject[order[2].name]))) ? (
                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[3].name]), this.nullChange(secondObject[order[3].name]))) ? order[3].value :
                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[3].name]), this.nullChange(secondObject[order[3].name]))) ? (
                      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[4].name]), this.nullChange(secondObject[order[4].name]))) ? order[4].value :
                        (this.isJudgeEqualCode(this.nullChange(firstObject[order[4].name]), this.nullChange(secondObject[order[4].name]))) ? (
                          (firstObject[this.nullChange(x_primaryKey)].padStart(15, '0') > secondObject[this.nullChange(x_primaryKey)].padStart(15, '0')) ? 1 : -1)
                          : order[4].value * -1)
                      : order[3].value * -1)
                  : order[2].value * -1)
              : order[1].value * -1)
          : order[0].value * -1)
  }

  //resultItemのソート変更処理 引数 ( 検索結果:g_result_Items, ソート順: g_sort_order, 各画面のプライマリーキー: x_primaryKey)
  public orderChange10(resultItems: any[], order: any[], x_primaryKey?: undefined | string) {
    resultItems.sort((firstObject: any, secondObject: any) =>
      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[0].name]), this.nullChange(secondObject[order[0].name]))) ? order[0].value :
        (this.isJudgeEqualCode(this.nullChange(firstObject[order[0].name]), this.nullChange(secondObject[order[0].name]))) ? (
          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[1].name]), this.nullChange(secondObject[order[1].name]))) ? order[1].value :
            (this.isJudgeEqualCode(this.nullChange(firstObject[order[1].name]), this.nullChange(secondObject[order[1].name]))) ? (
              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[2].name]), this.nullChange(secondObject[order[2].name]))) ? order[2].value :
                (this.isJudgeEqualCode(this.nullChange(firstObject[order[2].name]), this.nullChange(secondObject[order[2].name]))) ? (
                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[3].name]), this.nullChange(secondObject[order[3].name]))) ? order[3].value :
                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[3].name]), this.nullChange(secondObject[order[3].name]))) ? (
                      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[4].name]), this.nullChange(secondObject[order[4].name]))) ? order[4].value :
                        (this.isJudgeEqualCode(this.nullChange(firstObject[order[4].name]), this.nullChange(secondObject[order[4].name]))) ? (
                          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[5].name]), this.nullChange(secondObject[order[5].name]))) ? order[5].value :
                            (this.isJudgeEqualCode(this.nullChange(firstObject[order[5].name]), this.nullChange(secondObject[order[5].name]))) ? (
                              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[6].name]), this.nullChange(secondObject[order[6].name]))) ? order[6].value :
                                (this.isJudgeEqualCode(this.nullChange(firstObject[order[6].name]), this.nullChange(secondObject[order[6].name]))) ? (
                                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[7].name]), this.nullChange(secondObject[order[7].name]))) ? order[7].value :
                                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[7].name]), this.nullChange(secondObject[order[7].name]))) ? (
                                      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[8].name]), this.nullChange(secondObject[order[8].name]))) ? order[8].value :
                                        (this.isJudgeEqualCode(this.nullChange(firstObject[order[8].name]), this.nullChange(secondObject[order[8].name]))) ? (
                                          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[9].name]), this.nullChange(secondObject[order[9].name]))) ? order[9].value :
                                            (this.isJudgeEqualCode(this.nullChange(firstObject[order[9].name]), this.nullChange(secondObject[order[9].name]))) ? (
                                              (firstObject[this.nullChange(x_primaryKey)].padStart(15, '0') > secondObject[this.nullChange(x_primaryKey)].padStart(15, '0')) ? 1 : -1)
                                              : order[9].value * -1)
                                          : order[8].value * -1)
                                      : order[7].value * -1)
                                  : order[6].value * -1)
                              : order[5].value * -1)
                          : order[4].value * -1)
                      : order[3].value * -1)
                  : order[2].value * -1)
              : order[1].value * -1)
          : order[0].value * -1)
  }

  //resultItemのソート変更処理 引数 ( 検索結果:g_result_Items, ソート順: g_sort_order, 各画面のプライマリーキー: x_primaryKey )
  public orderChange15(resultItems: any[], order: any[], x_primaryKey?: undefined | string) {
    resultItems.sort((firstObject: any, secondObject: any) =>
      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[0].name]), this.nullChange(secondObject[order[0].name]))) ? order[0].value :
        (this.isJudgeEqualCode(this.nullChange(firstObject[order[0].name]), this.nullChange(secondObject[order[0].name]))) ? (
          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[1].name]), this.nullChange(secondObject[order[1].name]))) ? order[1].value :
            (this.isJudgeEqualCode(this.nullChange(firstObject[order[1].name]), this.nullChange(secondObject[order[1].name]))) ? (
              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[2].name]), this.nullChange(secondObject[order[2].name]))) ? order[2].value :
                (this.isJudgeEqualCode(this.nullChange(firstObject[order[2].name]), this.nullChange(secondObject[order[2].name]))) ? (
                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[3].name]), this.nullChange(secondObject[order[3].name]))) ? order[3].value :
                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[3].name]), this.nullChange(secondObject[order[3].name]))) ? (
                      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[4].name]), this.nullChange(secondObject[order[4].name]))) ? order[4].value :
                        (this.isJudgeEqualCode(this.nullChange(firstObject[order[4].name]), this.nullChange(secondObject[order[4].name]))) ? (
                          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[5].name]), this.nullChange(secondObject[order[5].name]))) ? order[5].value :
                            (this.isJudgeEqualCode(this.nullChange(firstObject[order[5].name]), this.nullChange(secondObject[order[5].name]))) ? (
                              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[6].name]), this.nullChange(secondObject[order[6].name]))) ? order[6].value :
                                (this.isJudgeEqualCode(this.nullChange(firstObject[order[6].name]), this.nullChange(secondObject[order[6].name]))) ? (
                                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[7].name]), this.nullChange(secondObject[order[7].name]))) ? order[7].value :
                                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[7].name]), this.nullChange(secondObject[order[7].name]))) ? (
                                      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[8].name]), this.nullChange(secondObject[order[8].name]))) ? order[8].value :
                                        (this.isJudgeEqualCode(this.nullChange(firstObject[order[8].name]), this.nullChange(secondObject[order[8].name]))) ? (
                                          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[9].name]), this.nullChange(secondObject[order[9].name]))) ? order[9].value :
                                            (this.isJudgeEqualCode(this.nullChange(firstObject[order[9].name]), this.nullChange(secondObject[order[9].name]))) ? (
                                              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[10].name]), this.nullChange(secondObject[order[10].name]))) ? order[10].value :
                                                (this.isJudgeEqualCode(this.nullChange(firstObject[order[10].name]), this.nullChange(secondObject[order[10].name]))) ? (
                                                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[11].name]), this.nullChange(secondObject[order[11].name]))) ? order[11].value :
                                                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[11].name]), this.nullChange(secondObject[order[11].name]))) ? (
                                                      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[12].name]), this.nullChange(secondObject[order[12].name]))) ? order[12].value :
                                                        (this.isJudgeEqualCode(this.nullChange(firstObject[order[12].name]), this.nullChange(secondObject[order[12].name]))) ? (
                                                          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[13].name]), this.nullChange(secondObject[order[13].name]))) ? order[13].value :
                                                            (this.isJudgeEqualCode(this.nullChange(firstObject[order[13].name]), this.nullChange(secondObject[order[13].name]))) ? (
                                                              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[14].name]), this.nullChange(secondObject[order[14].name]))) ? order[14].value :
                                                                (this.isJudgeEqualCode(this.nullChange(firstObject[order[14].name]), this.nullChange(secondObject[order[14].name]))) ? (
                                                                  (firstObject[this.nullChange(x_primaryKey)].padStart(15, '0') > secondObject[this.nullChange(x_primaryKey)].padStart(15, '0')) ? 1 : -1)
                                                                  : order[14].value * -1)
                                                              : order[13].value * -1)
                                                          : order[12].value * -1)
                                                      : order[11].value * -1)
                                                  : order[10].value * -1)
                                              : order[9].value * -1)
                                          : order[8].value * -1)
                                      : order[7].value * -1)
                                  : order[6].value * -1)
                              : order[5].value * -1)
                          : order[4].value * -1)
                      : order[3].value * -1)
                  : order[2].value * -1)
              : order[1].value * -1)
          : order[0].value * -1)
  }

  //resultItemのソート変更処理 引数 ( 検索結果:g_result_Items, ソート順: g_sort_order, 各画面のプライマリーキー: x_primaryKey )
  public orderChange20(resultItems: any[], order: any[], x_primaryKey?: undefined | string) {
    resultItems.sort((firstObject: any, secondObject: any) =>
      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[0].name]), this.nullChange(secondObject[order[0].name]))) ? order[0].value :
        (this.isJudgeEqualCode(this.nullChange(firstObject[order[0].name]), this.nullChange(secondObject[order[0].name]))) ? (
          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[1].name]), this.nullChange(secondObject[order[1].name]))) ? order[1].value :
            (this.isJudgeEqualCode(this.nullChange(firstObject[order[1].name]), this.nullChange(secondObject[order[1].name]))) ? (
              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[2].name]), this.nullChange(secondObject[order[2].name]))) ? order[2].value :
                (this.isJudgeEqualCode(this.nullChange(firstObject[order[2].name]), this.nullChange(secondObject[order[2].name]))) ? (
                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[3].name]), this.nullChange(secondObject[order[3].name]))) ? order[3].value :
                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[3].name]), this.nullChange(secondObject[order[3].name]))) ? (
                      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[4].name]), this.nullChange(secondObject[order[4].name]))) ? order[4].value :
                        (this.isJudgeEqualCode(this.nullChange(firstObject[order[4].name]), this.nullChange(secondObject[order[4].name]))) ? (
                          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[5].name]), this.nullChange(secondObject[order[5].name]))) ? order[5].value :
                            (this.isJudgeEqualCode(this.nullChange(firstObject[order[5].name]), this.nullChange(secondObject[order[5].name]))) ? (
                              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[6].name]), this.nullChange(secondObject[order[6].name]))) ? order[6].value :
                                (this.isJudgeEqualCode(this.nullChange(firstObject[order[6].name]), this.nullChange(secondObject[order[6].name]))) ? (
                                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[7].name]), this.nullChange(secondObject[order[7].name]))) ? order[7].value :
                                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[7].name]), this.nullChange(secondObject[order[7].name]))) ? (
                                      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[8].name]), this.nullChange(secondObject[order[8].name]))) ? order[8].value :
                                        (this.isJudgeEqualCode(this.nullChange(firstObject[order[8].name]), this.nullChange(secondObject[order[8].name]))) ? (
                                          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[9].name]), this.nullChange(secondObject[order[9].name]))) ? order[9].value :
                                            (this.isJudgeEqualCode(this.nullChange(firstObject[order[9].name]), this.nullChange(secondObject[order[9].name]))) ? (
                                              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[10].name]), this.nullChange(secondObject[order[10].name]))) ? order[10].value :
                                                (this.isJudgeEqualCode(this.nullChange(firstObject[order[10].name]), this.nullChange(secondObject[order[10].name]))) ? (
                                                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[11].name]), this.nullChange(secondObject[order[11].name]))) ? order[11].value :
                                                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[11].name]), this.nullChange(secondObject[order[11].name]))) ? (
                                                      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[12].name]), this.nullChange(secondObject[order[12].name]))) ? order[12].value :
                                                        (this.isJudgeEqualCode(this.nullChange(firstObject[order[12].name]), this.nullChange(secondObject[order[12].name]))) ? (
                                                          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[13].name]), this.nullChange(secondObject[order[13].name]))) ? order[13].value :
                                                            (this.isJudgeEqualCode(this.nullChange(firstObject[order[13].name]), this.nullChange(secondObject[order[13].name]))) ? (
                                                              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[14].name]), this.nullChange(secondObject[order[14].name]))) ? order[14].value :
                                                                (this.isJudgeEqualCode(this.nullChange(firstObject[order[14].name]), this.nullChange(secondObject[order[14].name]))) ? (
                                                                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[15].name]), this.nullChange(secondObject[order[15].name]))) ? order[15].value :
                                                                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[15].name]), this.nullChange(secondObject[order[15].name]))) ? (
                                                                      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[16].name]), this.nullChange(secondObject[order[16].name]))) ? order[16].value :
                                                                        (this.isJudgeEqualCode(this.nullChange(firstObject[order[16].name]), this.nullChange(secondObject[order[16].name]))) ? (
                                                                          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[17].name]), this.nullChange(secondObject[order[17].name]))) ? order[17].value :
                                                                            (this.isJudgeEqualCode(this.nullChange(firstObject[order[17].name]), this.nullChange(secondObject[order[17].name]))) ? (
                                                                              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[18].name]), this.nullChange(secondObject[order[18].name]))) ? order[18].value :
                                                                                (this.isJudgeEqualCode(this.nullChange(firstObject[order[18].name]), this.nullChange(secondObject[order[18].name]))) ? (
                                                                                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[19].name]), this.nullChange(secondObject[order[19].name]))) ? order[19].value :
                                                                                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[19].name]), this.nullChange(secondObject[order[19].name]))) ? (
                                                                                      (firstObject[this.nullChange(x_primaryKey)].padStart(15, '0') > secondObject[this.nullChange(x_primaryKey)].padStart(15, '0')) ? 1 : -1)
                                                                                      : order[19].value * -1)
                                                                                  : order[18].value * -1)
                                                                              : order[17].value * -1)
                                                                          : order[16].value * -1)
                                                                      : order[15].value * -1)
                                                                  : order[14].value * -1)
                                                              : order[13].value * -1)
                                                          : order[12].value * -1)
                                                      : order[11].value * -1)
                                                  : order[10].value * -1)
                                              : order[9].value * -1)
                                          : order[8].value * -1)
                                      : order[7].value * -1)
                                  : order[6].value * -1)
                              : order[5].value * -1)
                          : order[4].value * -1)
                      : order[3].value * -1)
                  : order[2].value * -1)
              : order[1].value * -1)
          : order[0].value * -1)
  }

  //resultItemのソート変更処理 引数 ( 検索結果:g_result_Items, ソート順: g_sort_order, 各画面のプライマリーキー: x_primaryKey )
  public orderChange25(resultItems: any[], order: any[], x_primaryKey?: undefined | string) {
    resultItems.sort((firstObject: any, secondObject: any) =>
      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[0].name]), this.nullChange(secondObject[order[0].name]))) ? order[0].value :
        (this.isJudgeEqualCode(this.nullChange(firstObject[order[0].name]), this.nullChange(secondObject[order[0].name]))) ? (
          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[1].name]), this.nullChange(secondObject[order[1].name]))) ? order[1].value :
            (this.isJudgeEqualCode(this.nullChange(firstObject[order[1].name]), this.nullChange(secondObject[order[1].name]))) ? (
              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[2].name]), this.nullChange(secondObject[order[2].name]))) ? order[2].value :
                (this.isJudgeEqualCode(this.nullChange(firstObject[order[2].name]), this.nullChange(secondObject[order[2].name]))) ? (
                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[3].name]), this.nullChange(secondObject[order[3].name]))) ? order[3].value :
                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[3].name]), this.nullChange(secondObject[order[3].name]))) ? (
                      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[4].name]), this.nullChange(secondObject[order[4].name]))) ? order[4].value :
                        (this.isJudgeEqualCode(this.nullChange(firstObject[order[4].name]), this.nullChange(secondObject[order[4].name]))) ? (
                          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[5].name]), this.nullChange(secondObject[order[5].name]))) ? order[5].value :
                            (this.isJudgeEqualCode(this.nullChange(firstObject[order[5].name]), this.nullChange(secondObject[order[5].name]))) ? (
                              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[6].name]), this.nullChange(secondObject[order[6].name]))) ? order[6].value :
                                (this.isJudgeEqualCode(this.nullChange(firstObject[order[6].name]), this.nullChange(secondObject[order[6].name]))) ? (
                                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[7].name]), this.nullChange(secondObject[order[7].name]))) ? order[7].value :
                                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[7].name]), this.nullChange(secondObject[order[7].name]))) ? (
                                      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[8].name]), this.nullChange(secondObject[order[8].name]))) ? order[8].value :
                                        (this.isJudgeEqualCode(this.nullChange(firstObject[order[8].name]), this.nullChange(secondObject[order[8].name]))) ? (
                                          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[9].name]), this.nullChange(secondObject[order[9].name]))) ? order[9].value :
                                            (this.isJudgeEqualCode(this.nullChange(firstObject[order[9].name]), this.nullChange(secondObject[order[9].name]))) ? (
                                              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[10].name]), this.nullChange(secondObject[order[10].name]))) ? order[10].value :
                                                (this.isJudgeEqualCode(this.nullChange(firstObject[order[10].name]), this.nullChange(secondObject[order[10].name]))) ? (
                                                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[11].name]), this.nullChange(secondObject[order[11].name]))) ? order[11].value :
                                                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[11].name]), this.nullChange(secondObject[order[11].name]))) ? (
                                                      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[12].name]), this.nullChange(secondObject[order[12].name]))) ? order[12].value :
                                                        (this.isJudgeEqualCode(this.nullChange(firstObject[order[12].name]), this.nullChange(secondObject[order[12].name]))) ? (
                                                          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[13].name]), this.nullChange(secondObject[order[13].name]))) ? order[13].value :
                                                            (this.isJudgeEqualCode(this.nullChange(firstObject[order[13].name]), this.nullChange(secondObject[order[13].name]))) ? (
                                                              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[14].name]), this.nullChange(secondObject[order[14].name]))) ? order[14].value :
                                                                (this.isJudgeEqualCode(this.nullChange(firstObject[order[14].name]), this.nullChange(secondObject[order[14].name]))) ? (
                                                                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[15].name]), this.nullChange(secondObject[order[15].name]))) ? order[15].value :
                                                                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[15].name]), this.nullChange(secondObject[order[15].name]))) ? (
                                                                      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[16].name]), this.nullChange(secondObject[order[16].name]))) ? order[16].value :
                                                                        (this.isJudgeEqualCode(this.nullChange(firstObject[order[16].name]), this.nullChange(secondObject[order[16].name]))) ? (
                                                                          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[17].name]), this.nullChange(secondObject[order[17].name]))) ? order[17].value :
                                                                            (this.isJudgeEqualCode(this.nullChange(firstObject[order[17].name]), this.nullChange(secondObject[order[17].name]))) ? (
                                                                              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[18].name]), this.nullChange(secondObject[order[18].name]))) ? order[18].value :
                                                                                (this.isJudgeEqualCode(this.nullChange(firstObject[order[18].name]), this.nullChange(secondObject[order[18].name]))) ? (
                                                                                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[19].name]), this.nullChange(secondObject[order[19].name]))) ? order[19].value :
                                                                                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[19].name]), this.nullChange(secondObject[order[19].name]))) ? (
                                                                                      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[20].name]), this.nullChange(secondObject[order[20].name]))) ? order[20].value :
                                                                                        (this.isJudgeEqualCode(this.nullChange(firstObject[order[20].name]), this.nullChange(secondObject[order[20].name]))) ? (
                                                                                          (this.isJudgeBiggerCode(this.nullChange(firstObject[order[21].name]), this.nullChange(secondObject[order[21].name]))) ? order[21].value :
                                                                                            (this.isJudgeEqualCode(this.nullChange(firstObject[order[21].name]), this.nullChange(secondObject[order[21].name]))) ? (
                                                                                              (this.isJudgeBiggerCode(this.nullChange(firstObject[order[22].name]), this.nullChange(secondObject[order[22].name]))) ? order[22].value :
                                                                                                (this.isJudgeEqualCode(this.nullChange(firstObject[order[22].name]), this.nullChange(secondObject[order[22].name]))) ? (
                                                                                                  (this.isJudgeBiggerCode(this.nullChange(firstObject[order[23].name]), this.nullChange(secondObject[order[23].name]))) ? order[23].value :
                                                                                                    (this.isJudgeEqualCode(this.nullChange(firstObject[order[23].name]), this.nullChange(secondObject[order[23].name]))) ? (
                                                                                                      (this.isJudgeBiggerCode(this.nullChange(firstObject[order[24].name]), this.nullChange(secondObject[order[24].name]))) ? order[24].value :
                                                                                                        (this.isJudgeEqualCode(this.nullChange(firstObject[order[24].name]), this.nullChange(secondObject[order[24].name]))) ? (
                                                                                                          (firstObject[this.nullChange(x_primaryKey)].padStart(15, '0') > secondObject[this.nullChange(x_primaryKey)].padStart(15, '0')) ? 1 : -1)
                                                                                                          : order[24].value * -1)
                                                                                                      : order[23].value * -1)
                                                                                                  : order[22].value * -1)
                                                                                              : order[21].value * -1)
                                                                                          : order[20].value * -1)
                                                                                      : order[19].value * -1)
                                                                                  : order[18].value * -1)
                                                                              : order[17].value * -1)
                                                                          : order[16].value * -1)
                                                                      : order[15].value * -1)
                                                                  : order[14].value * -1)
                                                              : order[13].value * -1)
                                                          : order[12].value * -1)
                                                      : order[11].value * -1)
                                                  : order[10].value * -1)
                                              : order[9].value * -1)
                                          : order[8].value * -1)
                                      : order[7].value * -1)
                                  : order[6].value * -1)
                              : order[5].value * -1)
                          : order[4].value * -1)
                      : order[3].value * -1)
                  : order[2].value * -1)
              : order[1].value * -1)
          : order[0].value * -1)
  }

  //ソート順の変更処理
  public sort(order: any[], target: any, sort_count: number, last_add: String) {
    //並び順の作成処理(1:昇順 -1:降順)
    if (this.includes(order, target)) { //既に押下したヘッダーかの判定
      sort_count -= 1;
      if (last_add === target) { //押下したものが最後に押下したものと同じか
        if (this.get(order, target, 1)) {//押下したものが現在昇順なら降順にする
          order[sort_count] = { value: -1, name: target };
        }
        else if (this.get(order, target, -1)) {//押下したものが現在降順ならソートを取り消す
          order[sort_count] = { value: 1, name: '' };
          if (sort_count === 0) { //取り消した時にorderが全てなくなったなら押下したものでソートする
            order[0].name = target;
          }
        }
        else { }
      } else { //押下したのものが最後に押下したものと違う場合ソートをリセットし、今押下したものでソートする
        this.del_order(order, target);
        order[sort_count] = { value: 1, name: target };
      }
    } else { //新しく押下したものの場合orderに追加する
      order[sort_count] = { value: 1, name: target };
    }

    if (order[sort_count].name !== '') {//上の処理でsort_countの番号のorderが消えたかの判定
      return [target, sort_count];//消えてなければ今押下したものを、最後に押下したものとして保存する
    } else {
      return [order[sort_count - 1].name, sort_count - 1];//消えていればソート順が一個上のものを最後に押下したものとして保存する
      sort_count -= 1;
    }

  }

  //既に選択したものを消して前に詰める処理
  public del_order(order: any[], target: String) {
    let n: number = 0;
    for (var i = 0; i < order.length; i++) {//orderから押下したものと同じもののインデックス番号を得る
      if (order[i].name == target) {
        n = i;
        break;
      }
    }
    for (var i = n; i < order.length - 1; i++) {//上で得たインデックス番号の要素をそれ以降のもので上書きしていく
      order[i] = { value: order[i + 1].value, name: order[i + 1].name }
    }
  }

  //対象のArraylist内に指定した文字列と同じnameの要素があるかの判定
  public includes(list: Array<any>, target: String) {
    let result: Boolean = false;
    for (var li of list) {
      if (li.name === target) {
        result = true;
      }

    }
    return result;
  }

  //対象のArraylistの指定した文字列と同じnameの要素のvalueがiと一致しているかの判定
  public get(list: Array<any>, target: String, i: any) {
    let result: Boolean = false;
    for (var li of list) {
      if (li.name === target) {
        if (li.value === i) {
          result = true;
        }
      }
    }
    return result;
  }

  //ソート順の表示の設定
  public sortMessage(order: any, i: number, sort_headr: any, sort_message: any) {

    let name: String = "";
    if (i > 0) {//ソートの表示間に > を入れたいのでその判定
      name = " > "
    } else {
      name = "ソート順："
    }
    for (var sh of sort_headr) {
      if (order.name === sh.name) {//地道に要素名を入れていく
        name += sh.value;
        break;
      }
    }

    sort_message.push({ name: name, value: order.value });

  }

  //CSV出力処理でのソート順の生成(証跡管理は個別に書いている)
  public orderByGene(x_sort_order: any[], x_primaryKey: string) {
    let p_csv_order: string = "";
    let p_primaryKey: string = "," + x_primaryKey;
    for (let i = 0; i < x_sort_order.length; i++) {
      //nameに値が入っているレコードのみ抽出
      if (x_sort_order[i].name) {
        //x_sort_order内にプライマリーキーがある場合、最後にプライマリーキーを追加しない
        if (x_sort_order[i].name == x_primaryKey) {
          p_primaryKey = "";
        }
        //条件はカンマで足していく(先頭(空の場合)はカンマなし)
        if (p_csv_order != "") {
          p_csv_order += ","
        }
        //昇順(value:1)
        if (x_sort_order[i].value == 1) {
          p_csv_order += x_sort_order[i].name
          //降順(value:-1)の場合descを付ける
        } else {
          p_csv_order += x_sort_order[i].name + " desc"
        }
      }
    }
    return p_csv_order + p_primaryKey;
  }

  //nullを空文字に変換する
  public nullChange(string: any) {
    let empty: any = "";
    if (string == "" || string == null || string == undefined) {
      //SJISの一番最初のコード値　NULLと空文字はコードでは判定できなかった
      return " "
    } else if (typeof (string) == "number") {
      return String(string).padStart(15, '0');
    }
    else {
      return string
    }
  }

  /*
  * 表示順ツールチップ(title)用設定
    x_sort_message 各画面で作成したソートメッセージ
    をツールチップ用に１行にする。
    アイコンを使用するのが難しいため、降順にのみ「(降順)」をつける
  */
  public chgSortMessageToTitle(x_sort_message: any): string {
    let p_sort_message_title = "";
    for (let p_message of x_sort_message) {
      p_sort_message_title += p_message.name;
      if (p_message.value == 1) {
        p_sort_message_title
      } else {
        p_sort_message_title += "(降順)"
      }
    }
    return p_sort_message_title;
  }

  /*
  * パンくずリスト取得(生成)
  * 遷移先(ポップアップ含む)の画面名を最後に追加し、返却する
  * サイドメニューから遷移した場合はリセットする
  * x_activated_route：それぞれの画面のrooting情報(画面名を取得するために使用)
  * x_moto_breadcrumb：遷移元画面から引き渡されたパンくずリスト
  */
  public getBreadcrumb(x_activated_route: any, x_moto_breadcrumb: any) {
    let rtn_breadcrumb = ""; //
    //1.サイドメニューから遷移してきた場合は、「side」に「1」の値が入っている(他はundifined、サイドメニューのhtmlでのみ設定)
    //2.URL未指定の場合は、「home」に「1」の値が張っている(他はundifined、rooting.moduleで設定)
    //⇒「画面名」をセットする
    if (this.isEmpty(x_moto_breadcrumb)) {
      rtn_breadcrumb = x_activated_route.snapshot.data.breadcrumb;
      //他の場合は、遷移元のパンくずリストに画面名を追加する。
    } else {
      rtn_breadcrumb = x_moto_breadcrumb + " > " + x_activated_route.snapshot.data.breadcrumb;
    }

    return rtn_breadcrumb;
  }

  /*
  * ログインユーザー名カット処理
  * ユーザー名を7文字にカットする
  * x_orgString 元の文字列
  * x_length 最大文字数
  */
  public substringLoginUserName(x_loginUserName: string): string {
    if (this.isEmpty(x_loginUserName)) {
      return x_loginUserName;
    } else {
      return x_loginUserName.substring(0, 7)
    }
  }

  /**
   * サイドメニューの開閉処理
   */
  public async sidemenuSize() {
    if (null != document.getElementById("table_result")) {
      document.getElementById("table_result")!.style.left = document.getElementById("side_menu_area")!.offsetWidth + "px";
    }
    if (null != document.getElementById("table_result2")) {
      document.getElementById("table_result2")!.style.left = document.getElementById("side_menu_area")!.offsetWidth + "px";
    }
    if (typeof document.getElementById("header") != 'undefined' && document.getElementById("header")) {
      document.getElementById("header")!.style.left = document.getElementById("side_menu_area")!.offsetWidth + "px";
      document.getElementById("header")!.style.width = document.getElementById('main')!.offsetWidth - document.getElementById("header")!.offsetLeft + "px";
    }
    if (typeof document.getElementById("footer") != 'undefined' && document.getElementById("footer")) {
      document.getElementById("footer")!.style.left = document.getElementById("side_menu_area")!.offsetWidth + "px";
      document.getElementById("footer")!.style.width = document.getElementById('main')!.offsetWidth - document.getElementById("footer")!.offsetLeft + "px";
    }
  }

  /**
   * 行列固定のズレ修正処理処理
   * x_reset_flg 検索結果の表示フラグ
   */
  public reset(x_reset_flg: any, x_changeDetectorRef: any) {
    let p_scrollX: number = window.scrollX;
    let p_scrollY: number = window.scrollY;
    setTimeout(() => {
      x_reset_flg.value = true;

      //テーブルの行列固定再再描画
      x_changeDetectorRef.detectChanges();
      x_reset_flg.value = false;
      //テーブルの行列固定再再描画
      x_changeDetectorRef.detectChanges();
      window.scrollTo(p_scrollX, p_scrollY);
    }, 0);
  }

  //ポップアップの画面で初期表示に使うもの
  public initPopup(): boolean {
    document.getElementById("side_menu_area")!.style.width = "0px"; //サイドメニュー
    document.getElementById("main")!.style.paddingLeft = "0px";
    document.getElementById("table_koteiyou_area")!.style.width = "10px";
    return true;
  }

  /*
  * 空文字チェック
  */
  public isEmpty(value: any): boolean {
    let result: boolean = false;
    if (undefined === value || null === value) {
      result = true;
    }
    if (typeof value === 'string' || '' == value) {
      result = true;
    }
    return result;
  }

  /*
  * 電話帳に送るパラメータの生成
  */
  public stringTel(tableParamKey: any): string {
    let str: string = "";
    for (let i = 0; i < tableParamKey.length; i++) {
      str += tableParamKey[i].id + ":" + tableParamKey[i].param;
      if (tableParamKey[i + 1]) {
        str += ",";
      }
    }
    return str;
  }

  /*
  * カンマ区切りに変換
  */
  public commaEditing(param: any): string {
    //入力されていない場合は空文字を返却
    if (this.isEmpty(param)) { return ''; }
    //カンマ除去
    param = String(param).replace(/,/g, '');
    //整数部分と小数点がに分離
    let paramSplitArray = String(param).split('.');
    let result = "";
    //整数部分にカンマ、小数点部分はそのまま(整数だけでも問題ない)
    for (let i = 0; i < paramSplitArray.length; i++) {
      if (i == 0) {
        result += String(paramSplitArray[i]).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      } else {
        result += "." + paramSplitArray[i];
      }
    }
    return result;
  }

  /*
  * カンマ区切りに変換
  * (値が大きい用：15桁以上入力出来てしまう場合用)
  * ★使用する画面がある場合に、修正する
  */
  public chgCommaSeparated2(x_param: any): string {
    if (this.isEmpty(x_param)) { return ''; }
    x_param = String(x_param).replace(/,/g, '');
    return String(x_param).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  }

  /*
  * カンマ区切りを除外
  */
  public removeCommaEditing(param: any): string {
    if (this.isEmpty(param)) { return ''; }
    return String(param).replace(/,/g, '');
  }

  /*
  * 複数チェックボックス 変更処理
  * selected 変更したチェックボックスの値
  * val 変更したチェックボックスの選択肢のValue
  * selVal 選択済みの値（カンマ区切りの文字列）
  */
  public chgMultipleCheckbox(x_selected: boolean, x_val: string, x_selVal: string): string {
    //チェックがON
    if (x_selected) {
      if (0 == x_selVal.length) {
        x_selVal = x_val;
      } else {
        x_selVal = x_selVal + ',' + x_val;
      }
      //カンマ区切りを配列変換
      var p_ary = x_selVal.split(',');
      //ソートを実行
      p_ary.sort();
      //文字列に戻す
      x_selVal = p_ary.join(',');
    }
    //チェックがOFF
    else {
      //カンマ区切りを配列変換
      var p_ary = x_selVal.split(',');
      //配列から位置を取得
      var idx: number = p_ary.indexOf(x_val);
      //取得した位置から要素を削除
      p_ary.splice(idx, 1);
      //文字列に戻す
      x_selVal = p_ary.join(',');
    }
    return x_selVal;
  }

  /*
  * コロン区切りに変換
  */
  public chgColonSeparated(x_param: any): string {
    if (this.isEmpty(x_param)) { return ''; }
    x_param = String(x_param).replace(/:/g, '');
    return String(x_param).replace(/(\d)(?=(\d\d)+(?!\d))/g, '$1:');
  }

  /*
  * コロン区切りを除外
  */
  public chgColonExclusion(x_param: any): string {
    if (this.isEmpty(x_param)) { return ''; }
    return String(x_param).replace(/:/g, '');
  }

  /*
  * チェックボックス 復元処理
  * 詳細画面から検索画面に戻った時にチェックボックスの状態を復元する処理
  * セレクトボックスの選択肢を取得後に実行すること
  * ★2022/12/05 チェックボックスを外す処理を追加
  * x_searchStr 検索条件　カンマ区切りの文字列
  * x_selmap セレクトボックスの選択肢
  */
  public restoreMultipleCheckbox(x_searchStr: string, x_selmap: any[]) {
    x_selmap.forEach((t: { checked: boolean; }) => { t.checked = false });

    if (x_searchStr.length > 0) {
      var ary: string[] = x_searchStr.split(',');
      for (var str of ary) {
        const target = x_selmap.find((x_selval) => {
          return (x_selval.value === str);
        });
        target.checked = true;
      }
    }
  }

  /*
  * 折り畳み展開パネルの開閉処理
  * 開閉範囲はdivタグで囲う
  * x_div_id 囲ったdivタグのID名 */

  /*★オブジェクトは 'null' である可能性があります? */

  public openAccordionPanel(x_div_id: string): boolean {
    //!
    var p_obj = document.getElementById(x_div_id)!.style;
    p_obj.display = (p_obj.display == 'none') ? 'block' : 'none';
    if (p_obj.display == 'none') {
      return false;
    } else {
      return true;
    }
  }

  /*
  * 文字を指定した長さにカットして「...」を付ける（設計書で40文字で打ち切りの場合は、39文字...で表示する）
  * x_orgString 元の文字列
  * x_length 最大文字数
  */
  public substringLongName(x_orgString: string, x_length: number): string {
    if (this.isEmpty(x_orgString)) {
      return x_orgString;
    }

    if (x_orgString.length > x_length) {
      return x_orgString.substring(0, x_length - 1) + '...';
    }
    return x_orgString;
  }


  /**
   * ファイルエンコード処理
   * x_file ファイル
   */
  public readBase64(x_file: File): Promise<any> {
    var reader = new FileReader();
    var future = new Promise((resolve, reject) => {
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);

      reader.addEventListener("error", function (event) {
        reject(event);
      }, false);

      reader.readAsDataURL(x_file);
    });
    return future;
  }

  /**
   * ダウンロードファイルパス取得
   *  ex) ../../files/mnl/000000005
   * x_path　添付ファイル管理テーブルの保存パス*/

  public getDownloadPath(x_path: string): string {
    var p_path: string = '';

    if (this.isEmpty(x_path)) {
      return p_path;
    }

    //保存パスを分解
    var p_split_path: String[] = x_path.split('\\');
    var p_join_str: string = '';

    for (var p_item of p_split_path) {
      //必ず添付ファイルは「files」というフォルダ名にすること
      p_join_str = p_join_str + '/' + p_item;
    }
    //「///https:」や「///localhost」となっているため、先頭1文字を削除する
    p_path = p_join_str.substring(1);
    return p_path;
  }

  /**
   * 年月フォーマット
   */
  public formatDateYm(x_date: string): string {
    if (this.isEmpty(x_date)) {
      return '';
    }
    return formatDate(x_date, "yyyy/MM", this.locale);
  }

  /**
   * 年月フォーマット(yyyyMM形式)
   */
  public formatDateYm2(x_date: string): string {
    if (this.isEmpty(x_date)) {
      return '';
    }
    return formatDate(x_date, "yyyyMM", this.locale);
  }

  /**
   * 年月フォーマット
   * yyyyMM ⇒ yyyy/MM に変換を行う（DBの定義がchar(6)の場合にのみ使用）
   */
  public formatYmSlash(x_date: string): string {
    if (this.isEmpty(x_date)) {
      return '';
    }
    return x_date.substring(0, 4) + "/" + x_date.substring(4, 6);
  }
  /**
   * 日付フォーマット
   */
  public formatDate(x_date: string): string {
    if (this.isEmpty(x_date)) {
      return '';
    }
    return formatDate(x_date, "yyyy/MM/dd", this.locale);
  }

  /**
 * 日時フォーマット
   */
  public formatDatetime(x_date: string | null): string | null {
    if (this.isEmpty(x_date)) {
      return '';
    }
    return this.datePipe.transform(x_date, "yyyy/MM/dd HH:mm:ss", '+0000');
  }


  /**
   * 日付変換
   * String　→　Dateに変換する
   * Stringは"YYYY/MM/DD"とする。
   * Angularでの日付の扱いは非常に繊細です。
   * "-"にしないと正常に変換されません。（1日前、1か月前の値が取れる）
   * また、時刻部分「hh:mm:ss:sss」が存在しても正しく変換されません。
   */
  // convertStrDate(x_date: string): Date {
  public convertStrDate(x_date: string): string {
    var p_ymd = x_date;
    var p_ymdAry = p_ymd.split('/')
    if (p_ymdAry.length >= 3) {
      p_ymd = p_ymdAry[0] + '-' + p_ymdAry[1] + '-' + p_ymdAry[2];
    } else {
      // p_ymd = p_ymd.substr(0, 10);
      p_ymd = p_ymd.substring(0, 11);
    }
    // return new Date(p_ymd);
    return p_ymd;
  }

  /**
 * 日付変換
 * ★↑のString返却バージョン
 * Stringは"YYYY/MM/DD"とする。
 * Angularでの日付の扱いは非常に繊細です。
 * "-"にしないと正常に変換されません。（1日前、1か月前の値が取れる）
 * また、時刻部分「hh:mm:ss:sss」が存在しても正しく変換されません。
 */
  // convertDateSlashToHyphen(x_date: string): string {
  //   var p_ymd = x_date;
  //   var p_ymdAry = p_ymd.split('/')
  //   if (p_ymdAry.length >= 3) {
  //     p_ymd = p_ymdAry[0] + '-' + p_ymdAry[1] + '-' + p_ymdAry[2];
  //   } else {
  //     p_ymd = p_ymd.substr(0, 10);
  //   }
  //   return p_ymd;
  // }

  /**
   * Momentから年月日を取得する
   * yyyy/MM/dd形式の文字列に変換する
   */
  public getYmdFromMoment(normalizedMonth: Dayjs): string {
    var p_yyyy = normalizedMonth.year();
    var p_mm = normalizedMonth.month() + 1;
    var p_dd = normalizedMonth.date();

    var p_ymd: string = p_yyyy + '-' + p_mm + '-' + p_dd;
    return this.formatDate(p_ymd);
  }

  /**
   * ファイルダウンロード
   */
  public async downloadFile(downloadPath: string, fileName: string) {
    await this.downloadFileInCommon('../pmt_web/pmtacommon/getFile', downloadPath, fileName, 'blob');
  }

  /**
   * ファイルダウンロード(Blobタイプ指定)
   */
  public async downloadFileSpecBlobType(downloadPath: string, fileName: string, blobType: string) {
    await this.downloadFileInCommon('../pmt_web/pmtacommon/getFile', downloadPath, fileName, 'blob', blobType);
  }

  /**
   * ファイルダウンロード(業務依頼専用)
   */
  public async downloadFileForBusinessReq(downloadPath: string, fileName: string) {
    await this.downloadFileInCommon('../pmt_web/pmtacommon/getFileForGyomuIrai', downloadPath, fileName, 'blob');
  }

  /**
   * ファイルダウンロード共通処理
   */
  public async downloadFileInCommon(
    url: string,
    downloadPath: string,
    fileName: string,
    resType: string,
    blobType?: any
  ): Promise<void> {
    // ダウンロード処理リクエスト
    this.ajax.setRequestParameter('hzn_path', downloadPath);
    this.ajax.setRequestParameter('file_nm', fileName);
    this.ajax.setResponseType(resType);
    let result: any = await this.ajax.httpPost(url);
    // HTTP通信に成功した場合、
    // 取得したBlobオブジェクトをaタグに埋め込み、動的にクリックイベントを発火
    if (!this.ajax.errFlg) {
      if (!blobType) blobType = result.type;
      let aTagElem: HTMLAnchorElement = document.createElement('a');
      aTagElem.href = window.URL.createObjectURL(new Blob([result], { type: blobType }));
      aTagElem.style.display = 'none';
      aTagElem.download = fileName;
      document.body.appendChild(aTagElem);
      aTagElem.click();
    }
  }

  /**
   * 年月カレンダーの見た目を整えるための処理
   */
  public updateCalendarUI(): void {
    setTimeout(() => {
      let calendar: any = document.getElementsByClassName('mat-calendar').item(0);
      if (calendar) {
        calendar['style'].height = '275px';
        calendar['style']['padding-top'] = '15px';
      }
      let header: any = document.getElementsByClassName('mat-calendar-header').item(0);
      if (header) {
        header['style'].height = '0px';
      }
      let controls: any = document.getElementsByClassName('mat-focus-indicator mat-calendar-period-button mat-button mat-button-base').item(0);
      if (controls) {
        controls['style'].display = 'none';
      }
      let tbl_header: any = document.getElementsByClassName('mat-calendar-table-header').item(0);
      if (tbl_header) {
        tbl_header['style'].height = '10px';
      }
      let label: any = document.getElementsByClassName('mat-calendar-body-label').item(0);
      if (label) {
        label['style'].height = '10px';
      }
    }, 1);
  }


  /**
   * Undefinedを空文字に変換する
   */
  public convertUndefToBlk(x_param: string): string {
    if (undefined == x_param) {
      return '';
    }
    return x_param;
  }

  /**
   * Undefinedをゼロに変換する（文字列）
   */
  public convertUndefToZeroStr(x_param: string): string {
    if (undefined == x_param) {
      return '0';
    }
    return x_param;
  }

  /**
   * Undefinedをゼロに変換する（数値）
   */
  public convertUndefToZeroNum(x_param: number): number {
    if (undefined == x_param) {
      return 0;
    }
    return x_param;
  }

  /**
   * 現在年月日日時取得（yyyyMMddhhmmss形式）
  */
  public getNowStrYMDHMS(): string {
    var p_now: Date = new Date();
    let p_ymd: any = this.datePipe.transform(p_now, "yyyyMMddHHmmss");
    return p_ymd;
  }

  /**
   * プログラムID取得
   */
  public getPgId(x_router: Router): string {
    //「/pdgy0100」このような文字列で取得出来る
    // var p_pg_id: string = x_router.url.substr(1);
    var p_pg_id: string = x_router.url.substring(1);

    //AzureAD認証の場合、初回は画面IDが取得出来ないので表示しない
    if (p_pg_id.indexOf('code=') > 0) {
      p_pg_id = '';
    } else {
      //URLに?のGETパラメータが存在した場合、フッターに表示されてしまうので除外する。
      if (p_pg_id.indexOf('?') > 0) {
        p_pg_id = p_pg_id.substring(0, p_pg_id.indexOf('?'));
      } else if (p_pg_id.indexOf(';') > 0) {
        p_pg_id = p_pg_id.substring(0, p_pg_id.indexOf(';'));
      }
    }
    return p_pg_id;
  }

  /**
   * 電話帳（組織）呼び出し
   * x_retSet 戻り値を設定するフィールドの組み合わせの文字列。複数ある場合はカンマ区切り。
  */
  public openWinPhonebookSsk(resSetFldName: string): void {
    this.openSubWindowInCommon('pmtaz0300', CommonConst.PHONEBOOK_SSK_KEYVAL, resSetFldName, 'phonebookSsk');
  }

  /**
   * 電話帳（従業員）呼び出し
   * x_retSet 戻り値を設定するフィールドの組み合わせの文字列。複数ある場合はカンマ区切り。
   */
  public openWinPhonebookEmp(resSetFldName: string): void {
    this.openSubWindowInCommon('pmtaz0500', CommonConst.PHONEBOOK_EMP_KEYVAL, resSetFldName, 'phonebookEmp');
  }

  public async openSubWindowInCommon(
    url: string,
    sessKey: string,
    resSetFldName: string,
    windowName: string
  ): Promise<void> {
    let result: any = await this.ajax.httpPost('../pmt_web/' + url + '/getUrl');
    if (!this.ajax.errFlg) {
      var features = CommonConst.OPEN_WINDOW_COMMON_PARAM + ',' + CommonConst.OPEN_WINDOW_SIZE_MAIN;
      var sendParam: string = '&next_method=get';
      //エンコード、半角スペース除外
      var nextUrl: string = encodeURI('&next_url=' + location.href + url);
      //パラメータをセッションに保存
      sessionStorage.setItem(sessKey, resSetFldName);
      //電話帳画面を呼び出す
      window.open(result.url + sendParam + nextUrl, windowName, features);
    }
  }

  /**
   * 呼び出し元ウィンドウの存在チェック
   */
  // public checkExistOpenerWindow(): boolean {
  //   if (window.opener) {
  //     return true;
  //   }
  //   return false;
  // }

  /**
   * ダウンロードファイルオープン(pdf専用)
   * aタグのリンクのみでは動かないことがあるので確実な方法として実装
   */
  public async download_file_open(path: string, win_nm: string) {
    // ダウンロード処理リクエスト
    await this.httpClient.post('../pmt_web/pmtacommon/getFile',
      { hzn_path: path, file_nm: win_nm }
      , { responseType: 'blob' }
    ).toPromise()
      .then((res: any) => {
        // aタグの生成
        const a: any = document.createElement("a");
        // レスポンスからBlobオブジェクト＆URLの生成
        const blobUrl: any = window.URL.createObjectURL(new Blob([res], {
          //※PDF以外を表示する場合、この設定を変更する必要あり
          type: 'application/pdf'
        }));
        var features = CommonConst.OPEN_WINDOW_COMMON_PARAM;
        this.authService.windowOpen(blobUrl, win_nm, features);
      });
  }

  /**
   * ダウンロードファイルオープン(pdf以外も可)
   * aタグのリンクのみでは動かないことがあるので確実な方法として実装
   */
  public async download_file_open_any(path: string, win_nm: string, x_type: string) {
    // ダウンロード処理リクエスト
    await this.httpClient.post('../pmt_web/pmtacommon/getFile',
      { hzn_path: path, file_nm: win_nm }
      , { responseType: 'blob' }
    ).toPromise()
      .then((res: any) => {
        // aタグの生成
        const a: any = document.createElement("a");
        // レスポンスからBlobオブジェクト＆URLの生成
        const blobUrl: any = window.URL.createObjectURL(new Blob([res], {
          type: x_type
        }));
        var features = CommonConst.OPEN_WINDOW_COMMON_PARAM;
        this.authService.windowOpen(blobUrl, win_nm, features);
      });
  }

  /**
   * フォーカス解除
   */
  public unFocus() {
    // 現在のフォーカスを取得
    let p_current_focus = <HTMLElement>document.activeElement;
    if (p_current_focus) {
      // フォーカスを解除
      p_current_focus.blur();
    }
  }

  /**
   * 日付選択処理
   */
  public dateSelect(event: MatDatepickerInputEvent<Dayjs>) {
    if (!this.isEmpty(event.value)) {
      event.value?.set('hour', 9);
    }
  }

  public setOnlyYearMonth(date: Dayjs, datepicker: MatDatepicker<Dayjs>): void {
    datepicker.close();
  }

  /**
   * 設定した日付をMoment型に変換する処理
   * 
   * @param x_event 
   * @param x_date_format "yyyy/mm/dd" または "yyyy/mm" 
   * @returns 
   */
  public async convertMomentData(x_event: any) {
    if (this.isEmpty(x_event.target.value)) {
      return;
    }
    //画面で入力した日付は「yyyy/mm/dd」 または 「yyyy/mm」形式で来るため、スラッシュで分割する
    let p_split_date: any = x_event.target.value.split("/");
    if (
      p_split_date.length != 3
      && p_split_date.length != 2
      && p_split_date.length != 1
    ) {
      //想定外の形式の場合は処理終了
      return;
    }
    let p_moment: Dayjs;
    dayjs.extend(objectSupport);
    if (p_split_date.length == 3) {
      //「yyyy/mm/dd」形式の場合
      p_moment = dayjs(
        {
          year: Number(p_split_date[0])
          , month: Number(p_split_date[1]) - 1
          , day: Number(p_split_date[2])
        }
      );
    } else if (p_split_date.length == 2) {
      //「yyyy/mm」形式の場合
      p_moment = dayjs(
        {
          year: Number(p_split_date[0])
          , month: Number(p_split_date[1]) - 1
        }
      );
    } else {
      //「yyyy」形式の場合
      p_moment = dayjs(
        {
          year: Number(p_split_date[0])
        }
      );
    }
    if (!this.isEmpty(p_moment)) {
      p_moment.set('hour', 9);
    }
    return p_moment;
  }

  private footerHeight: number = 0;
  public resizeFooter(event: any): void {
    // フッターの高さを常時監視
    // 画面外にはみ出た場合は、右側に展開用ボタンを表示する
    if (this.footerHeight == 0) this.footerHeight = event.target.offsetHeight;
    let footerOpen: HTMLDivElement = <HTMLDivElement>document.getElementById("footer_open_icon");
    if (this.footerHeight >= event.target.scrollHeight) {
      footerOpen.style.display = "none";
    }
    else if (this.footerHeight < event.target.scrollHeight) {
      footerOpen.style.display = "inline-block";
    }
  }
}
