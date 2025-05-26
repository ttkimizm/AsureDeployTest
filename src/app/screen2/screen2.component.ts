import { Component, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FontAwesomeService } from '../services/font-awesome.service';
import { LoadingSpinnerService } from '../services/loading-spinner.service';
import { CommonLogicService } from '../services/common-logic.service';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-screen2',
  standalone: false,
  templateUrl: './screen2.component.html',
  styleUrls: ['./screen2.component.css']
})
export class Screen2Component implements AfterViewInit {

  @ViewChild(MatTabGroup) tabs?: MatTabGroup;

  public tabSelectedIndex: number = 0;
  public showOnePageDataLength: number = 20;
  public tableData: any[] = [];
  public nowPageNumber: number = 0;
  public showDataStartIndex: number = 0;
  public linkData: number[] = [];
  public inputNumber: string = '';
  public inputSelect: string = '';
  public inputRadio: string = '';
  public inputRadioChecked: boolean = false;
  public inputRadioDisabled: boolean = false;
  public inputDateFrom: string = '';
  public inputDateTo: string = '';
  public selectOption: string[] = [];
  private showPageLinkLength: number = 5;
  private allPageCount: number = 0;

  constructor(
    public fontAwesome: FontAwesomeService,
    public commonLogic: CommonLogicService,
    private loadingSpinner: LoadingSpinnerService,
    private cdr: ChangeDetectorRef
  ) { }

  public async ngAfterViewInit(): Promise<void> {
    if (this.commonLogic.isClientRendering()) {
      this.showLoadingSpinner();
      history.replaceState('', '', '');
      let naviMenu: HTMLDivElement = <HTMLDivElement>document.getElementById("navi_menu");
      let grayOut: HTMLDivElement = <HTMLDivElement>document.getElementById("display_gray_out");
      naviMenu.style.display = 'none';
      grayOut.style.display = 'none';

      for (var i: number = 0; i < 100; i++) {
        this.tableData.push("部署123456789012345678901234567890");
        this.selectOption.push("オプション" + i);
      }

      this.inputRadioChecked = true;
      this.inputRadioDisabled = true;

      // 総ページ数の算出
      this.allPageCount = Math.ceil(this.tableData.length / this.showOnePageDataLength) - 1;
      this.setPageLink();

      // if (this.tabs) {
      //   this.tabs._handleClick = (tab, header, index) => {
      //     //タブが切り替わる前の、現画面のスクロール位置を取得
      //     let p_page_y_offset = Math.round(window.pageYOffset) || 0;
      //     //タブの配列にスクロール位置を保持
      //     this.g_tab_flow_sybt[this.g_tab_current_index].page_y_offset = p_page_y_offset;
      //     //現在のタブ番号を、押下されたタブの番号に更新
      //     this.g_tab_current_index = index;
      //   }
      // }
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

  public changePage(page: number): void {

    // ページ数がマイナス、または表示データのインデックスを超過しないように調整する
    page = page >= 0 ? page : 0;
    page = page < this.allPageCount ? page : this.allPageCount;

    this.showDataStartIndex = this.showOnePageDataLength * page;
    this.nowPageNumber = page;
    this.setPageLink();
  }

  public dateFocusOut(x_event: any) {
    //共通処理でMoment型に加工した日付オブジェクトを取得する
    let p_moment: any = this.commonLogic.convertMomentData(x_event);
    if (this.commonLogic.isEmpty(p_moment)) {
      return;
    }
  }

  public onWinClose() {
    if (this.commonLogic.isClientRendering()) {
      window.close();
    }
  }

  private setPageLink(): void {
    let flg: boolean = true;
    this.linkData = [];

    let linkIndexUpper: number = Math.ceil(this.nowPageNumber + (this.showPageLinkLength / 2));
    let linkIndexLower: number = Math.ceil(this.nowPageNumber - (this.showPageLinkLength / 2));

    for (var i: number = 0; i <= this.allPageCount; i++) {
      if (i == 0 || i == this.allPageCount ||
        (0 > linkIndexLower && i < this.showPageLinkLength) ||
        (this.allPageCount < linkIndexUpper && i > (this.allPageCount - this.showPageLinkLength)) ||
        (i >= linkIndexLower && i < linkIndexUpper)) {
        // 固定ラベル
        this.linkData.push(i);
        flg = true;
      }
      else {
        if (flg) {
          this.linkData.push(-1);
        }
        flg = false;
      }
    }
  }
}
