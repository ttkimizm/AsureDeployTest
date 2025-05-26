import { Component, AfterViewInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoadingSpinnerService } from '../services/loading-spinner.service';
import { FontAwesomeService } from '../services/font-awesome.service';
import { CommonLogicService } from '../services/common-logic.service';

@Component({
  selector: 'app-screen3',
  standalone: false,
  templateUrl: './screen3.component.html',
  styleUrls: ['./screen3.component.css']
})
export class Screen3Component implements AfterViewInit {

  public g_data_response: any = {};
  public tableData: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public g_data_request: any,
    public matDialogRef: MatDialogRef<Screen3Component>,
    public commonLogic: CommonLogicService,
    public fontAwesome: FontAwesomeService,
    private loadingSpinner: LoadingSpinnerService,
    private cdr: ChangeDetectorRef
  ) { }

  public async ngAfterViewInit(): Promise<void> {
    if (this.commonLogic.isClientRendering()) {
      for (var i: number = 0; i < 100; i++) {
        let dataObj: any = {};
        dataObj["col1"] = "データ1" + i;
        dataObj["col2"] = "データ2" + i;
        dataObj["col3"] = "データ3" + i;
        this.tableData.push(dataObj);
      }
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

  closeDialog(value: string): void {
    this.g_data_response.push_button = "CANCEL";
    this.matDialogRef.close(value);
  }

  private footerHeight: number = 0;
  public resizeFooterDialog(event: any): void {
    // フッターの高さを常時監視
    // 画面外にはみ出た場合は、右側に展開用ボタンを表示する
    if (this.footerHeight == 0) this.footerHeight = event.target.offsetHeight;
    let footerOpen: HTMLDivElement = <HTMLDivElement>document.getElementById("dialog_footer_open_icon");
    if (this.footerHeight >= event.target.scrollHeight) {
      footerOpen.style.display = "none";
    }
    else if (this.footerHeight < event.target.scrollHeight) {
      footerOpen.style.display = "inline-block";
    }
  }
}
