// Azure AD 認証情報格納用インターフェース
export interface Environment {
    production?: boolean;
    baseurl?: string;
    azure_graph_url?: string;
    azure_clientid: string;
    azure_authority?: string;
    azure_redirecturi: string;
}