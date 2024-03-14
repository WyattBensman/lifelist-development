import * as userQueries from "./user/userQueries.mjs";
import * as notificationQueries from "./notifications/notificationQueries.mjs";
import * as messagingQueries from "./messaging/messagingQueries.mjs";
import * as experienceQueries from "./experience/experienceQueries.mjs";
import * as collageMutations from "./collage/collageMutations.mjs";
import * as cameraQueries from "./camera/cameraQueries.mjs";
import * as lifeListQueries from "./lifelist/lifeListQueries.mjs";
import * as privacyGroupQueries from "./privacyGroup/privacyGroupQueries.mjs";

const queries = {
  ...userQueries,
  ...notificationQueries,
  ...messagingQueries,
  ...experienceQueries,
  ...collageMutations,
  ...cameraQueries,
  ...lifeListQueries,
  ...privacyGroupQueries,
};

export default queries;
