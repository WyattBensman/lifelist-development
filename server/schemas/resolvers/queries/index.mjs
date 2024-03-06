import * as userQueries from "./user/userQueries.mjs";
import * as notificationQueries from "./notifications/notificationQueries.mjs";
import * as messagingQueries from "./messaging/messagingQueries.mjs";
import * as experienceQueries from "./experience/experienceQueries.mjs";
import * as collageMutations from "./collage/collageMutations.mjs";
import * as cameraQueries from "./camera/cameraQueries.mjs";

const queries = {
  ...userQueries,
  ...notificationQueries,
  ...messagingQueries,
  ...experienceQueries,
  ...collageMutations,
  ...cameraQueries,
};

export default queries;
