import * as queryResolvers from "./queries";
import * as mutationResolvers from "./mutations";

const resolvers = {
  Query: {
    ...queryResolvers.cameraQueries,
    ...queryResolvers.collageQueries,
    ...queryResolvers.experienceQueries,
    ...queryResolvers.userQueries,
    ...queryResolvers.messagingQueries,
    ...queryResolvers.notificationsQueries,
  },
  Mutation: {
    ...mutationResolvers.cameraMutations,
    ...mutationResolvers.collageActionsMutations,
    ...mutationResolvers.collageCreationMutations,
    ...mutationResolvers.lifeListMutations,
    ...mutationResolvers.messagingMutations,
    ...mutationResolvers.mockCreateUserMutations,
    ...mutationResolvers.notificationsMutations,
    ...mutationResolvers.privacyGroupsMutations,
    ...mutationResolvers.userActionsMutations,
    ...mutationResolvers.userRelationsMutations,
    ...mutationResolvers.userMutations,
  },
};

export default resolvers;
