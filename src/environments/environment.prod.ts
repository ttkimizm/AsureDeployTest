import type { Environment } from '../app/models/environment.model';

// 本番環境用
export const environment: Environment = {
    // production: true,
    // baseurl: "http://s-az01-ap226.pub.taisei.co.jp:8080/pmt/",
    // azure_graph_url: "https://graph.microsoft.com/v1.0/me/",
    azure_clientid: "66b387fc-6c04-4a28-b26a-8d2264dc5f41",
    // azure_authority: "https://login.microsoftonline.com/f88f30d0-09c9-496d-90e8-390f4009310c",
    azure_redirecturi: "https://contactpj-taiseigr.msappproxy.net/pmt/"
};