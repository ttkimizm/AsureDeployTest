import type { Environment } from '../app/models/environment.model';

// 単体環境用
export const environment: Environment = {
    // production: false,
    // baseurl: "http://localhost:4200/",
    // azure_graph_url: "https://graph.microsoft.com/v1.0/me/",
    azure_clientid: "8a5a1a0e-9310-4ee7-99ff-5a1217037f4d",
    // azure_authority: "https://login.microsoftonline.com/f88f30d0-09c9-496d-90e8-390f4009310c",
    azure_redirecturi: "http://localhost:4200/"
};