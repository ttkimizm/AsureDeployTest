export interface Organization {
    SESSION_BUSYO_CD: string,				//部署コード
    SESSION_BUSYO_NM: string,				//部署名称
    SESSION_SSK_NM_DISP: string,			//組織名称(表示用)
    SESSION_SSK_NM_KAISO: string,          	//組織名称(階層用)
    SESSION_BUSYO_SYBT_KBN: string,			//部署種別区分
    SESSION_SSK_KBN: string,				//組織区分
    SESSION_HAIZOKU_KBN: string,			//配属区分
    SESSION_DAIHYO_EMP_NO: string,			//代表従業員番号
    SESSION_HNM_KNM_KBN: string,            //本務兼務区分
    SESSION_BU_BUSYO_CD: string,			//部_部室コード
    SESSION_BU_BUSYO_NM: string,			//部_部署名称
    SESSION_BU_SSK_NM_DISP: string,			//部_組織名称(表示用)
    SESSION_BU_SSK_NM_KAISO: string,		//部_組織名称(階層用)
    SESSION_SITU_BUSYO_CD: string,		    //室_部署コード
    SESSION_SITU_BUSYO_NM: string,	    	//室_部署名称
    SESSION_SITU_SSK_NM_DISP: string,		//室_組織名称(表示用)
    SESSION_SITU_SSK_NM_KAISO: string,	    //室_組織名称(階層用)
}

export interface Authority {
    ROLE_CD: string,
}

export interface Principal {
    BUSYO_CD: string,
    EMP_NO: string,
}

export interface Department {
    BUSYO_CD: string,
}

export interface UserInfo {
    SESSION_LOGINUSER_SYSTEM_NOT_AVAILABLE?: number;
    SESSION_LOGINUSER_ID?: string;
    SESSION_LOGINUSER_NAME?: string;
    SESSION_HNM_BUSYO_CD?: string;
    SESSION_HNM_BUSYO_NM?: string;
    SESSION_HNM_BU_BUSYO_CD?: string;
    SESSION_HNM_SITU_BUSYO_CD?: string;
    SESSION_LOGIN_TIME?: Date;
    SESSION_HNM_SCT_CD?: string;
}

export class LoginUserInfo {
    SESSION_LOGINUSER_INFO: UserInfo = {};               // ログインユーザ情報　単一
    SESSION_LOGINUSER_SOSIKI: Organization[] = [];       // ログインユーザの配属情報　複数
    SESSION_LOGINUSER_ROLE_CD: Authority[] = [];         // ログインユーザの権限コード　複数
    SESSION_LOGINUSER_ROLE_CD_ORG: Authority[] = [];     // ログインユーザのオリジナル権限コード　複数
    SESSION_LOGINUSER_PRINCIPAL: Principal[] = [];       // ログインユーザの被代理人従業員番号　複数
    SESSION_LOGINUSER_BUSYO_CD: Department[] = [];       // ログインユーザの部署コード　複数
    SESSION_LOGINUSER_TEAM_BUSYO_CD: Department[] = [];  // ログインユーザのチーム部署コード　複数
    SESSION_LOGINUSER_BUSYO_CD_KAI: Department[] = [];   // ログインユーザの下位部署コード　複数
    SESSION_LOGINUSER_KNM_BUSYO_CD: Department[] = [];   // ログインユーザの兼務部署コード　複数
}
