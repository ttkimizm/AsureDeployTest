import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Screen3Component } from '../screen3/screen3.component';
import { MatDialog } from '@angular/material/dialog';
import { FontAwesomeService } from '../services/font-awesome.service';
import { LoadingSpinnerService } from '../services/loading-spinner.service';
import { AjaxService } from '../services/ajax.service';
import { CommonLogicService } from '../services/common-logic.service';

@Component({
  selector: 'app-screen1',
  standalone: false,
  templateUrl: './screen1.component.html',
  styleUrl: './screen1.component.css'
})
export class Screen1Component implements AfterViewInit {
  public constructor(
    public fontAwesome: FontAwesomeService,
    public commonLogic: CommonLogicService,
    private loadingSpinner: LoadingSpinnerService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private ajax: AjaxService
  ) { }

  public showOnePageDataLength: number = 100;
  public showDataStartIndex: number = 0;
  public tableData: any[] = [];
  public inputNumber: string = '';
  public inputSelect: string = '';
  public inputRadio: string = '';
  public inputDateFrom: string = '';
  public inputDateTo: string = '';
  public selectOption: string[] = []
  public inputRadioChecked: boolean = false;
  public inputRadioDisabled: boolean = false;
  // public nowPageNumber: number = 0;
  // public linkData: number[] = [];

  private footerHeight: number = 0;
  // private showPageLinkLength: number = 5;
  // private allPageCount: number = 0;

  public async ngAfterViewInit(): Promise<void> {
    if (this.commonLogic.isClientRendering()) {
      this.showLoadingSpinner();
      let test: any = await this.ajax.httpPost("../mock/hello-basic");
      console.log(test);
      for (var i: number = 0; i < 100; i++) {
        let dataObj: any = {};
        dataObj["lock_col1"] = "固定データ1" + i;
        dataObj["lock_col2"] = "固定データ2" + i;
        dataObj["lock_col3"] = "固定データ3" + i;
        dataObj["move_col1"] = "移動データ1" + i;
        dataObj["move_col2"] = "移動データ2" + i;
        dataObj["move_col3"] = "移動データ3" + i;
        dataObj["move_col4"] = "移動データ4" + i;
        dataObj["move_col5"] = "移動データ5" + i;
        dataObj["move_col6"] = "移動データ6" + i;
        dataObj["move_col7"] = "移動データ7" + i;
        dataObj["move_col8"] = "移動データ8" + i;
        dataObj["move_col9"] = "移動データ9" + i;
        dataObj["move_col10"] = "移動データ10" + i;
        this.tableData.push(dataObj);
        this.selectOption.push("オプション" + i);
      }

      this.inputRadioDisabled = true;
      this.inputRadioChecked = true;

      // 総ページ数の算出
      // this.allPageCount = Math.ceil(this.tableData.length / this.showOnePageDataLength) - 1;
      // this.setPageLink();
      this.cdr.detectChanges();
    }
  }

  public showLoadingSpinner() {
    // スピナー表示
    this.loadingSpinner.show();
    // API呼び出しの仮実装(5秒間待機する)
    setTimeout(() => {
      this.loadingSpinner.hide(); // Stop blocking
    }, 2000);
  }

  public resizeFooter(event: any): void {
    // フッターの高さを常時監視
    // 画面外にはみ出た場合は、右側に展開用ボタンを表示する
    if (this.footerHeight == 0) this.footerHeight = event.target.offsetHeight;
    let footerOpen: HTMLDivElement = <HTMLDivElement>document.getElementById("footer_open_icon");
    let mainCont: HTMLDivElement = <HTMLDivElement>document.getElementById('main_content_area');
    let footerArea: HTMLDivElement = <HTMLDivElement>document.getElementById('main_content_footer');
    if (this.footerHeight >= event.target.scrollHeight) {
      footerOpen.style.display = "none";
      mainCont.style.paddingBottom = '3rem';
    }
    else if (this.footerHeight < event.target.scrollHeight) {
      footerOpen.style.display = "inline-block";
      mainCont.style.paddingBottom = footerArea.offsetHeight + 'px';
    }
  }

  public openSubWindow(url: string): boolean {
    window.open(url, 'subwin', 'width=1510, height=800, menubar=no');
    return false;
  }

  public openModalDialog(): void {
    let p_current_focus = <HTMLElement>document.activeElement;
    if (p_current_focus) {
      p_current_focus.blur();
    }
    const dialogRef = this.dialog.open(Screen3Component, {
      //送信パラメーター
      data: {
        emp_nm: 'test',
      },
      height: '610px',
      width: '1000px',
      disableClose: true
    });
    //ダイアログからの戻り値を取得
    dialogRef.afterClosed().subscribe(async result => {
      //OKボタン押下の場合
      // if ('OK' == result.push_button) {

      // }
      let inputRef: HTMLInputElement = <HTMLInputElement>document.getElementById('input_ref');
      inputRef.value = result;
    });
  }

  public dateFocusOut(x_event: any) {
    //共通処理でMoment型に加工した日付オブジェクトを取得する
    let p_moment: any = this.commonLogic.convertMomentData(x_event);
    if (this.commonLogic.isEmpty(p_moment)) {
      return;
    }
  }

  public printPreview(): void {
    var userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("trident/7.0") > -1) {
      if (document.body.insertAdjacentHTML == null) {
        alert("印刷できない画面です。");
      } else {
        var sWebBrowserCode = '<object width="0" height="0" classid="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></object>';
        document.body.insertAdjacentHTML('beforeend', sWebBrowserCode);
        var objWebBrowser = document.body.lastChild;
        if (objWebBrowser == null) {
          alert("印刷できない画面です。");
        } else {
          // try {
          //   objWebBrowser.ExecWB(7, 1); 
          //   document.body.removeChild(objWebBrowser); 
          // } catch(err) {
          //   alert("印刷できない画面です。");
          // }
        }
      }
    } else {
      window.print();
    }
  }

  // public changePage(page: number): void {
  //   // ページ数がマイナス、または表示データのインデックスを超過しないように調整する
  //   page = page >= 0 ? page : 0;
  //   page = page < this.allPageCount ? page : this.allPageCount;
  //   this.showDataStartIndex = this.showOnePageDataLength * page;
  //   this.nowPageNumber = page;
  //   this.setPageLink();
  // }
  // private setPageLink(): void {
  //   let flg: boolean = true;
  //   this.linkData = [];
  //   let linkIndexUpper: number = Math.ceil(this.nowPageNumber + (this.showPageLinkLength / 2));
  //   let linkIndexLower: number = Math.ceil(this.nowPageNumber - (this.showPageLinkLength / 2));
  //   for (var i: number = 0; i <= this.allPageCount; i++) {
  //     if (i == 0 || i == this.allPageCount ||
  //       (0 > linkIndexLower && i < this.showPageLinkLength) ||
  //       (this.allPageCount < linkIndexUpper && i > (this.allPageCount - this.showPageLinkLength)) ||
  //       (i >= linkIndexLower && i < linkIndexUpper)) {
  //       // 固定ラベル
  //       this.linkData.push(i);
  //       flg = true;
  //     }
  //     else {
  //       if (flg) {
  //         this.linkData.push(-1);
  //       }
  //       flg = false;
  //     }
  //   }
  // }
}
