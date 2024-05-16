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

// HOME ACCESS
const uploadLink = createUploadLink({
  uri: "http://192.168.1.205:3001/graphql",
  formDataAppendFile,
  isExtractableFile,
});

// SPARKMAN WHARF ACCESS
/* const uploadLink = createUploadLink({
  uri: "http://100.66.6.237:3001/graphql",
  formDataAppendFile,
  isExtractableFile,
}); */

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
