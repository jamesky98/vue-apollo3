import {
  ApolloClient, createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const tokenvalue = localStorage.getItem("AUTH_TOKEN");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: tokenvalue ? `Bearer ${tokenvalue}` : "",
      "Apollo-Require-Preflight": "true",
    },
  };
});

// const httpLink = createHttpLink({
//   uri: import.meta.env.VITE_GRAPHQL_URL,
// });

const httpLink = createUploadLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default apolloClient;
