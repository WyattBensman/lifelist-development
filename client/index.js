import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import formDataAppendFile from "apollo-upload-client/formDataAppendFile.mjs";
import isExtractableFile from "apollo-upload-client/isExtractableFile.mjs";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import * as SecureStore from "expo-secure-store";

// Check if in a development environment and load error messages
if (process.env.NODE_ENV !== "production") {
  loadDevMessages();
  loadErrorMessages();
}

// Use the Heroku server URL
const graphqlUri = "https://lifelist-server-6ad435fbc893.herokuapp.com/graphql";

const uploadLink = createUploadLink({
  uri: graphqlUri,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync("authToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
});
