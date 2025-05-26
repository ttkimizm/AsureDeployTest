export namespace CommonConst {
    //ログイン情報のキー
    export const USER_INFO_KEY = 'userinfo';
    export const SSO_KEY = 'sso_key';

    //画面の不正遷移チェック用キー
    export const TRANSITION_KEY = 'transition_key';
    export const TRANSITION_VALUE = 'valid';

    //ログアウトフラグ
    export const LOGOUT_FLG = 'logout_flg';

    //ログアウトパターンコード
    export const LOGOUT_PTNCD = "logout_ptncd";

    //AzureADリダイレクトフラグ
    export const AZURE_REDIRECT_FLG = 'azure_redirect_flg';

    /** 正規表現 */
    //半角英数
    export const REGULAR_EXPRESSION_HAN_EI_SU = '^[0-9a-zA-Z]+$';
    //半角英数記号
    export const REGULAR_EXPRESSION_HAN_EI_SU_KIGOU = '^[a-zA-Z0-9!-/:-@¥[-`{-~]*$';
    //半角英数記号空白
    export const REGULAR_EXPRESSION_HAN_EI_SU_KIGOU_SPACE = '^([a-zA-Z0-9!-/:-@¥[-`{-~]+[ ]*[a-zA-Z0-9!-/:-@¥[-`{-~]+|[a-zA-Z0-9!-/:-@¥[-`{-~]*)$';
    //電話番号
    export const REGULAR_EXPRESSION_TEL = '^[\x20-\x7e]*$';
    //EMAIL
    export const REGULAR_EXPRESSION_EMAIL = '^[a-zA-Z0-9!-/:-@¥[-`{-~]+$';
    //半角数字(カンマ付き)
    export const REGULAR_EXPRESSION_HAN_SU = '^\\d{1,3}([,]\\d{3})*$';
    //半角数字(カンマ付き) マイナスを許可する
    export const REGULAR_EXPRESSION_HAN_SU_MINUS = '^[-]?\\d{1,3}([,]\\d{3})*$';
    //半角数字(カンマ付き、小数点許可) マイナスを許可する
    export const REGULAR_EXPRESSION_HAN_SU_DC_MINUS = '^((([-]?[1-9]\\d*)(,\\d{3})*)|0)(\\.\\d+)?$';
    //半角数字(カンマ無し)
    export const REGULAR_EXPRESSION_SU = '^[0-9]+$';
    //半角数字(カンマ無し)マイナスを許可する
    export const REGULAR_EXPRESSION_SU_MINUS = '^[-]?[0-9]+$';
    //全角文字
    export const REGULAR_EXPRESSION_ZENKAKU = '[^\x20-\x7E\uFF65-\uFF9F]*';
    //全角文字(特殊文字不可)
    export const REGULAR_EXPRESSION_ZENKAKU_WOTM = '[^\x01-\x7E\uFF65-\uFF9F]*';
    //半角英数字+半角ハイフン
    export const REGULAR_EXPRESSION_HAN_EI_SU_DASH = '^[0-9a-zA-Z\-]+$';
    //時刻
    export const REGULAR_EXPRESSION_TIME = '^([01][0-9]|2[0-3]|[0-9]):[0-5][0-9]$';
    //時刻秒
    export const REGULAR_EXPRESSION_TIME_SCOND = '^([01][0-9]|2[0-3]|[0-9]):[0-5][0-9]:[0-5][0-9]$';

    /** ダイアログオープン共通パラメータ */
    //確認ダイアログ
    export const OPEN_COMMON_CONFIRM_DIALOG_HEIGHT = '200px';
    export const OPEN_COMMON_CONFIRM_DIALOG_WIDTH = '400px';
    //他普通のダイアログ
    export const OPEN_COMMON_DIALOG_HEIGHT = '610px';
    export const OPEN_COMMON_DIALOG_WIDTH = '850px';
    //ダイアログのサイズpx無し
    export const OPEN_COMMON_DIALOG_HEIGHT_NUM = 610;
    export const OPEN_COMMON_DIALOG_WIDTH_NUM = 832;
    export const OPEN_COMMON_DIALOG_WIDTH_MAX = '1100px';
    export const OPEN_COMMON_DIALOG_HEIGHT_AUTO = 'auto';
    export const OPEN_COMMON_DIALOG_WIDTH_AUTO = 'auto';
    //支払先選択(pmta_z1500)用
    export const OPEN_Z1500_DIALOG_HEIGHT = '610px';
    export const OPEN_Z1500_DIALOG_WIDTH = '1000px';
    //企業選択(pmta_z0700)用
    export const OPEN_Z0700_DIALOG_WIDTH = '1070px';
    //付帯事業決裁書選択(pmta_z2900)用
    export const OPEN_Z2900_DIALOG_WIDTH = '950px';

    /** リロード指示メッセージ */
    export const LINK_MESSAGE_CODE = 'message';
    export const RELOAD_RUN_CODE = 'reload';

    //電話帳　パラメータ保存キー
    export const PHONEBOOK_SSK_KEYVAL = 'phonebookSsk_KeyVal';
    export const PHONEBOOK_EMP_KEYVAL = 'phonebookEmp_KeyVal';

    /**削除予定　window共通パラメータ*/
    export const OPEN_WINDOW_COMMON_PARAM = 'menubar=no,location=no,resizable=no,scrollbars=yes';
    export const OPEN_WINDOW_SIZE_MAIN = 'width=1850,height=1200';

    /**画面ごとにサイズを指定 */
    export const OPEN_WINDOW_SIZE_A0110 = 'width=1340,height=800';//業務依頼 回答 詳細
    export const OPEN_WINDOW_SIZE_B0200 = 'width=1510,height=800';//業務管理表
    export const OPEN_WINDOW_SIZE_B0310 = 'width=1500,height=800';//業務実施方針書詳細
    export const OPEN_WINDOW_SIZE_B0410 = 'width=1250,height=800';//付帯事業決裁書 一覧
    export const OPEN_WINDOW_SIZE_B0420 = 'width=1400,height=800';//付帯事業決裁書 詳細
    export const OPEN_WINDOW_SIZE_B0510 = 'width=1200,height=800';//業務番号（部門費）詳細
    export const OPEN_WINDOW_SIZE_B0600 = 'width=1100,height=750';//業務メンバー管理
    export const OPEN_WINDOW_SIZE_B0610 = 'width=1040,height=750';//完了時業務メンバー
    export const OPEN_WINDOW_SIZE_C0110 = 'width=1500,height=800';//実施予定詳細
    export const OPEN_WINDOW_SIZE_D0100 = 'width=1500,height=800';//業務日誌入力
    export const OPEN_WINDOW_SIZE_E0100 = 'width=1500,height=800';//機械日誌入力
    export const OPEN_WINDOW_SIZE_F0110 = 'width=1200,height=800';//経理データメンテナンス詳細
    export const OPEN_WINDOW_SIZE_F0200 = 'width=1350,height=750';//買掛金発注書検索・一覧
    export const OPEN_WINDOW_SIZE_F0210 = 'width=1510,height=800';//買掛金発注書詳細
    export const OPEN_WINDOW_SIZE_F0400 = 'width=1450,height=800';//業務番号実績検索
    export const OPEN_WINDOW_SIZE_F0610 = 'width=1300,height=800';//振替先設定詳細
    export const OPEN_WINDOW_SIZE_F0810 = 'width=1300,height=800';//振替勘定書詳細
    export const OPEN_WINDOW_SIZE_F0820 = 'width=1350,height=800';//振替勘定書内訳参照
    export const OPEN_WINDOW_SIZE_G0110 = 'width=1500,height=750';//実験機器詳細
    export const OPEN_WINDOW_SIZE_G0200 = 'width=1450,height=750';//実験機器修理申請一覧
    export const OPEN_WINDOW_SIZE_G0210 = 'width=1350,height=750';//実験機器修理申請詳細
    export const OPEN_WINDOW_SIZE_G0300 = 'width=1490,height=750';//関連書類検索・一覧
    export const OPEN_WINDOW_SIZE_G0310 = 'width=1350,height=750';//関連書類詳細
    export const OPEN_WINDOW_SIZE_G0410 = 'width=1000,height=550';//実験機器処分申請詳細
    export const OPEN_WINDOW_SIZE_G0510 = 'width=1350,height=750';//工事情報詳細一覧
    export const OPEN_WINDOW_SIZE_H0110 = 'width=1500,height=750';//情報機器詳細
    export const OPEN_WINDOW_SIZE_H0200 = 'width=1200,height=750';//振替先業務番号変更履歴
    export const OPEN_WINDOW_SIZE_I0200 = 'width=1500,height=750';//進捗管理(メインフロー)
    export const OPEN_WINDOW_SIZE_I0210 = 'width=1500,height=750';//進捗管理(サブフロー)
    export const OPEN_WINDOW_SIZE_I0300 = 'width=1500,height=750';//進捗管理予定履歴
    export const OPEN_WINDOW_SIZE_J0200 = 'width=1500,height=850';//会議管理審議対象検索一覧
    export const OPEN_WINDOW_SIZE_J0300 = 'width=700,height=550';//会議管理審議対象帳票出力
    export const OPEN_WINDOW_SIZE_W0110 = 'width=1100,height=750';//組織設定詳細
    export const OPEN_WINDOW_SIZE_W0210 = 'width=1100,height=750';//従業員設定詳細
    export const OPEN_WINDOW_SIZE_W0310 = 'width=1300,height=750';//代理設定詳細
    export const OPEN_WINDOW_SIZE_X0110 = 'width=950,height=750';//マスタメンテナンス_コードマスタメンテナンス詳細
    export const OPEN_WINDOW_SIZE_Z1600 = 'width=1350,height=800';//承認状況(専用ワークフロー)
    export const OPEN_WINDOW_SIZE_Z1900 = 'width=1220,height=550';//取込結果確認
    export const OPEN_WINDOW_SIZE_Z2300 = 'width=1200,height=800';//更新履歴
    export const OPEN_WINDOW_SIZE_Z2700 = 'width=1200,height=750';//メール送信
    export const OPEN_WINDOW_SIZE_POWERFLOW = 'width=1200,height=750';//PowerFlow
    export const OPEN_WINDOW_SIZE_CPJ01 = 'width=1200,height=750';//業務依頼
    export const OPEN_WINDOW_SIZE_GPP = 'width=1200,height=750';//総合調達
    export const OPEN_WINDOW_SIZE_CHOKEN = 'width=1200,height=750';//Choken
    export const OPEN_WINDOW_SIZE_WEBFOCUS_EXCEL = 'width=700,height=400';//業務依頼 回答 詳細
    export const OPEN_WINDOW_SIZE_WEBFOCUS_GRAPH = 'width=1000,height=600';//業務依頼 回答 詳細
    export const OPEN_WINDOW_SIZE_FILE_PORTAL = 'width=1200,height=750';//FilePortal

    export const HALF_AND_FULL_WIDTH_KATAKANA = {
        'ｧ': "ァ", 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
        'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
        'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
        'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
        'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
        'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
        'ｯ': 'ッ',
        'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
        'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
        'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
        'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
        'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
        'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
        'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
        'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
        'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
        'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
        'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
        'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
        '｡': '。', '｢': '「', '｣': '」', '､': '、', '･': '・', 'ｰ': 'ー',
    };
    export const SEMI_VOICED_SOUND = {
        'が': "か", 'ぎ': "き", 'ぐ': "く", 'げ': "け", 'ご': "こ",
        'ざ': "さ", 'じ': "し", 'ず': "す", 'ぜ': "せ", 'ぞ': "そ",
        'だ': "た", 'ぢ': "ち", 'づ': "つ", 'で': "て", 'ど': "と",
        'ば': "は", 'び': "ひ", 'ぶ': "ふ", 'べ': "へ", 'ぼ': "ほ",
        'ぱ': "は", 'ぴ': "ひ", 'ぷ': "ふ", 'ぺ': "へ", 'ぽ': "ほ",
        'ゔ': "う", 'わ゙': "わ", 'を゙': "を",
    };

    //g0110画面　添付ファイル＿指定拡張子
    export const ALLOW_EXT_PMTAG0110 = ['jpg', 'png', 'jpeg'];
}