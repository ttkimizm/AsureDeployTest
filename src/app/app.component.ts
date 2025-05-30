import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeService } from '../app/services/font-awesome.service';
import { CommonLogicService } from './services/common-logic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {

  // milestoneLoop: any = [...Array(30)];
  public title = 'mock';
  public naviMenuOpen: boolean = true;
  public naviMenuCont: any[] = [];
  private naviMenuFlg?: HTMLInputElement;
  private naviMenuOpenCont?: HTMLInputElement;
  private prevOpenNaviMenu: boolean = false;

  public constructor(
    public fontAwesome: FontAwesomeService,
    public commonLogic: CommonLogicService,
    private router: Router
  ) { }

  // onInitでは画面操作前にDOMへアクセスすることができない
  public async ngAfterViewInit(): Promise<void> {

    if (this.commonLogic.isClientRendering()) {
      this.naviMenuCont.push({ title: "稼働中ＰＪ一覧", icon: this.fontAwesome.faChartLine, child: [] });
      this.naviMenuCont.push({ title: "未処理一覧", icon: this.fontAwesome.faHandshakeAltSlash, child: [] });
      this.naviMenuCont.push({ title: "付帯事業未処理一覧", icon: this.fontAwesome.faLinkSlash, child: [] });
      this.naviMenuCont.push({ title: "ＰＪ情報", icon: this.fontAwesome.faSheetPlastic, child: ["ＰＪ情報検索", "ＰＪ情報一括更新", "元積付替", "枝番移設"] });
      this.naviMenuCont.push({ title: "付帯事業", icon: this.fontAwesome.faLink, child: ["稼働中付帯事業一覧", "付帯事業情報検索"] });
      this.naviMenuCont.push({ title: "業務日誌", icon: this.fontAwesome.faBook, child: ["業務日誌入力", "業務日誌内訳表", "業務日誌ワーニングリスト", "業務日誌状況確認"] });
      this.naviMenuCont.push({ title: "ProcessControl", icon: this.fontAwesome.faMicrochip, child: [] });
      this.naviMenuCont.push({ title: "文書管理", icon: this.fontAwesome.faListCheck, child: ["文書管理", "定型文書管理", "送付状文書", "バインダー", "バインダーテンプレート", "アドレス帳", "アーカイブ文書"] });
      this.naviMenuCont.push({ title: "業務依頼/入手不能報告", icon: this.fontAwesome.faBullhorn, child: [] });
      this.naviMenuCont.push({ title: "帳票出力", icon: this.fontAwesome.faFileExcel, child: ["プロジェクト進捗管理", "受注見通し一覧", "売上利益管理", "手持ち工事集計表"] });
      this.naviMenuCont.push({ title: "コモン管理", icon: this.fontAwesome.faDatabase, child: [] });
      this.naviMenuCont.push({ title: "管理室メニュー", icon: this.fontAwesome.faPeopleRoof, child: [] });
      this.naviMenuCont.push({ title: "経理データメンテナンス", icon: this.fontAwesome.faCalculator, child: ["外注費等実績検索", "割掛戻入費実施予定", "起票部署設定", "振替勘定書作成", "振替勘定書一覧", "自動仕訳作成", "自動仕訳内訳帳", "自動仕訳提出", "仕掛計上締め", "特定付帯決裁処理"] });
      this.naviMenuCont.push({ title: "マスタメンテナンス", icon: this.fontAwesome.faUserTie, child: ["お知らせ", "組織設定", "配属設定", "代理設定", "保有資格", "コードマスタ", "WFフォルダコード", "WF経路"] });

      // 画面初期表示時にフォントや画像等の拡大率を確定する
      // 以降、単位rem(大元のhtml基準の単位)でサイズ指定を行う
      let htmlElemArray: HTMLHtmlElement[] = Array.from(window.document.getElementsByTagName('html'));
      if (htmlElemArray.length != 0) {
        let size: number = window.screen.width * 0.02;
        size = size >= 14 ? size : 14;
        size = size <= 18 ? size : 18;
        htmlElemArray[0].style.fontSize = size + 'px';
      }

      // スマートフォン用スタイルの場合、ナビゲーションメニューを非表示に設定
      if (window.matchMedia('(max-width: 999px)').matches) {
        this.naviMenuOpen = false;
      }

      let mediaQuery = window.matchMedia("(max-width: 999px)");
      this.naviMenuFlg = <HTMLInputElement>window.document.getElementById("navi_menu_open_flg");

      // メディアクエリの変更を監視
      mediaQuery.addEventListener('change', (e) => {
        if (e.matches) {
          this.naviMenuFlg!.checked = false;
        } else {
          this.naviMenuFlg!.checked = true;
        }
      });
    }
  }

  public clearRadioBtn(event: Event) {
    let naviMenuRadio: HTMLInputElement = <HTMLInputElement>event.target;
    if (this.naviMenuOpenCont != null) {
      // 前回開いたメニューコンテンツとは異なる場合
      if (this.naviMenuOpenCont !== naviMenuRadio) {
        // 前回開いたコンテンツを閉じる
        this.naviMenuOpenCont.checked = false;
        // 新たに選択したコンテンツを開く
        naviMenuRadio.checked = true;
      }
      // 前回開いたメニューコンテンツと同じ場合
      else {
        if (this.prevOpenNaviMenu) {
          naviMenuRadio.checked = false;
        }
        else {
          naviMenuRadio.checked = true;
        }
      }
    }

    this.naviMenuOpenCont = naviMenuRadio;
    this.prevOpenNaviMenu = naviMenuRadio.checked;
  }

  public transPage(title: string): void {
    if(this.commonLogic.isEmpty(title)) {
      if(title == "稼働中ＰＪ一覧") {
        this.router.navigate(['']);
      }
      else if(title == "未処理一覧") {
        this.router.navigate(['screen4']);
      }
    }
  }
}
