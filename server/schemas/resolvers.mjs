import queries from "./resolvers/queries/index.mjs";
import mutations from "./resolvers/mutations/index.mjs";

const resolvers = {
  Query: {
    ...queries,
  },
  Mutation: {
    ...mutations,
  },
};

export default resolvers;
