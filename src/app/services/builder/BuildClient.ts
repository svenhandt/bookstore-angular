
import fetch, {
  Headers,
  RequestInit
} from 'node-fetch';

import {
  ClientBuilder,

  // Import middlewares
  type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/sdk-client-v2';

const projectKey = 'bookstore-17091979';
const scopes = ['manage_my_business_units:bookstore-17091979',
                'create_anonymous_token:bookstore-17091979',
                'view_categories:bookstore-17091979',
                'manage_my_shopping_lists:bookstore-17091979',
                'manage_my_profile:bookstore-17091979',
                'manage_my_orders:bookstore-17091979',
                'manage_my_payments:bookstore-17091979',
                'manage_my_quotes:bookstore-17091979',
                'view_published_products:bookstore-17091979',
                'manage_my_quote_requests:bookstore-17091979'];

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey: projectKey,
  credentials: {
    clientId: 'uYOjDoM2bWIyOgTXh_qTRF4A',
    clientSecret: 'dMCyDGXWXZP45KwJXFTQsIq91CwykGUM',
  },
  scopes,
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
};

// Export the ClientBuilder
export const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();

