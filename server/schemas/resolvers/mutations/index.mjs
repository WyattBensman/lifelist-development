import * as userActionsMutations from "./userActions/index.mjs";
import * as userRegristrationMutations from "./userRegristration/index.mjs";
import * as userRelationsMutations from "./userRelations/index.mjs";
import * as cameraMutations from "./camera/index.mjs";
import * as collageActionsMutations from "./collageActions/index.mjs";
import * as collageCreationMutations from "./collageCreation/index.mjs";
import * as lifeListMutations from "./lifeList/index.mjs";
import * as messagingMutations from "./messaging/index.mjs";
import * as notificationsMutations from "./notifications/index.mjs";
import * as privacyGroupsMutations from "./privacyGroups/index.mjs";
import * as mockMutations from "./mock/index.mjs";

const mutations = {
  ...userActionsMutations,
  ...userRegristrationMutations,
  ...userRelationsMutations,
  ...cameraMutations,
  ...collageActionsMutations,
  ...collageCreationMutations,
  ...lifeListMutations,
  ...messagingMutations,
  ...notificationsMutations,
  ...privacyGroupsMutations,
  ...mockMutations,
};

export default mutations;
