import fetch from 'node-fetch';

import {
  AnonymousAuthMiddlewareOptions,
  type AuthMiddlewareOptions,
  ClientBuilder, createAuthForAnonymousSessionFlow,
  type HttpMiddlewareOptions,
  TokenCacheOptions,
  TokenStore
} from '@commercetools/sdk-client-v2';
import {environment} from "../../../environments/environment";
import {createApiBuilderFromCtpClient} from "@commercetools/platform-sdk";

const projectKey = environment.projectKey;
const scopes = environment.scopes

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: environment.authHost,
  projectKey: projectKey,
  credentials: {
    clientId: environment.clientId,
    clientSecret: environment.clientSecret,
  },
  scopes,
  fetch,
};

const anonymousAuthMiddlewareOptions: AnonymousAuthMiddlewareOptions = {
  host: environment.authHost,
  projectKey: projectKey,
  credentials: {
    clientId: environment.clientId,
    clientSecret: environment.clientSecret,
  },
  scopes,
  fetch,
  tokenCache: {

    set(cache: TokenStore, tokenCacheOptions?: TokenCacheOptions) {
      if(!localStorage.getItem('local_token')) {
        localStorage.setItem('local_token', JSON.stringify(cache))
      }
      console.log(cache.token)
    },

    get(tokenCacheOptions?: TokenCacheOptions) {
      const tokenStoreStr = localStorage.getItem('local_token')
      if(tokenStoreStr) {
        return <TokenStore>JSON.parse(tokenStoreStr)
      }
      else {
        return <TokenStore>{}
      }
    }

  }

};


// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: environment.httpHost,
  fetch,
};

// Export the ClientBuilder
const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)// .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withAnonymousSessionFlow(anonymousAuthMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();


const apiRoot = createApiBuilderFromCtpClient(ctpClient)
  .withProjectKey({projectKey: environment.projectKey})

export default  apiRoot



