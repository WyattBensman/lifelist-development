import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { HttpLink } from "@apollo/client";
import * as SecureStore from "expo-secure-store";

const graphqlUri =
  "https://ggu5enboke.execute-api.us-east-2.amazonaws.com/graphql";

// Add Authorization header with token if available
const authLink = setContext((_, { headers }) => {
  const token = SecureStore.getItem("authToken");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Configure Apollo Client
export const client = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri: graphqlUri })),
  cache: new InMemoryCache(),
});
