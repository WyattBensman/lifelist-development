import queries from "./resolvers/queries/index.mjs";
import mutations from "./resolvers/mutations/index.mjs";
import { GraphQLUpload } from "graphql-upload";

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    ...queries,
  },
  Mutation: {
    ...mutations,
  },
};

export default resolvers;
