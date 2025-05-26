import { MsalInterceptorConfiguration, MsalGuardConfiguration } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication, BrowserCacheLocation, LogLevel, InteractionType } from '@azure/msal-browser';
import { environment } from '../../environments/environment';

export function msalInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.azure_clientid,
      authority: environment.azure_authority,
      redirectUri: environment.azure_redirecturi,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      // IEは既にサポートを終了しているため、今後の開発で考慮する必要はない
      // storeAuthStateInCookie:
      //   window.navigator.userAgent.indexOf('MSIE ') > -1 ||
      //   window.navigator.userAgent.indexOf('Trident/') > -1, // set to true for IE 11
      storeAuthStateInCookie: false
    },
    system: {
      loggerOptions: {
        loggerCallback:
          function (level: LogLevel, message: string, containsPii: boolean) {
            console.log(message);
          },
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false,
      },
    },
  });
}

export function msalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(environment.azure_redirecturi, ['user.read']);
  //protectedResourceMap.set(environment.azure_graph_url, ['user.read']);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function msalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read'],
    },
  };
}
