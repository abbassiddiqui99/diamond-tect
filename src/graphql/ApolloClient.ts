import { createClient } from 'graphql-ws';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition, offsetLimitPagination } from '@apollo/client/utilities';
import { ApolloClient, createHttpLink, InMemoryCache, split, from } from '@apollo/client';

import configEnv from 'src/config.env';
import { showToast } from 'src/utils/Toast';
import { LOCAL_CONSTANT } from 'src/constant/LocalConstant';

interface httpResponseStatus {
  response: {
    status: number;
  };
}

const httpLink = createHttpLink({
  uri: `${configEnv.BASE_URL}/graphql`,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `${configEnv.WEB_SOCKET_BASE_URL}/graphql`,
  }),
);

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(LOCAL_CONSTANT.USER);
  const userToken = token ? JSON.parse(token) : null;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: userToken?.accessToken ? `Bearer ${userToken?.accessToken}` : '',
    },
  };
});

const responseLink = onError(({ graphQLErrors }) => {
  const httpCode = graphQLErrors?.[0].extensions.exception as httpResponseStatus;
  if (httpCode?.response?.status === 401) {
    localStorage.clear();
    window.location.reload();
    localStorage.setItem('sessionMessage', 'Your session has expired. Please sign-in again.');
  }
  if (httpCode?.response?.status === 403) {
    setTimeout(() => {
      showToast({ type: 'warning', message: 'You have reached the limit of this Plan, For queries visit payment plan page' });
    }, 100);
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  from([responseLink, authLink, httpLink]),
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          mintFeed: offsetLimitPagination(),
          getNotifications: offsetLimitPagination(),
          getProtectedNfts: offsetLimitPagination(),
        },
      },
    },
  }),
});
