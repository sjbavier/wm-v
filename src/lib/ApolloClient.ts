import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  UriFunction
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';

interface ApolloClientProps {
  uri?: string | UriFunction;
  fetchOptions?: (options: RequestInit) => RequestInit | undefined;
}
export const createApolloClient = ({
  uri,
  fetchOptions
}: ApolloClientProps): ApolloClient<NormalizedCacheObject> => {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors && Array.isArray(graphQLErrors))
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const httpLink = new HttpLink({
    uri,
    fetch: (uri, options) => {
      if (fetchOptions) {
        options = fetchOptions(options || {});
      }
      return fetch(uri, options);
    }
  });

  const link = ApolloLink.from([errorLink, httpLink]);

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
        // <QueryType>: {
        //   keyFields: ['id', 'title']
        // },
      }
    })
  });

  return client;
};
