import { Component, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FontAwesomeService } from '../services/font-awesome.service';
import { AjaxService } from '../services/ajax.service';
import { CommonLogicService } from '../services/common-logic.service';

@Component({
  selector: 'app-screen4',
  standalone: false,
  templateUrl: './screen4.component.html',
  styleUrl: './screen4.component.css'
})
export class Screen4Component implements AfterViewInit, OnDestroy {
  public constructor(
    public fontAwesome: FontAwesomeService,
    public commonLogic: CommonLogicService,
    private cdr: ChangeDetectorRef,
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
  private footerHeight: number = 0;

  public async ngAfterViewInit(): Promise<void> {
    if (this.commonLogic.isClientRendering()) {
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

      let htmlElemArray: HTMLHtmlElement[] = Array.from(window.document.getElementsByTagName('html'));
      htmlElemArray[0].style.overflow = "auto";

      let sideMenu: HTMLDivElement = <HTMLDivElement>document.getElementById("navi_menu");
      sideMenu.style.position = "fixed";

      this.cdr.detectChanges();
    }
  }

  public async ngOnDestroy(): Promise<void> {

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

  public dateFocusOut(x_event: any) {
    //共通処理でMoment型に加工した日付オブジェクトを取得する
    let p_moment: any = this.commonLogic.convertMomentData(x_event);
    if (this.commonLogic.isEmpty(p_moment)) {
      return;
    }
  }
}
