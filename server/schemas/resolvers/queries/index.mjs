import * as userQueries from "./user/userQueries.mjs";
import * as experienceQueries from "./experience/experienceQueries.mjs";
import * as collageMutations from "./collage/collageQueries.mjs";
import * as cameraQueries from "./camera/cameraQueries.mjs";
import * as lifeListQueries from "./lifelist/lifeListQueries.mjs";
import * as privacyGroupQueries from "./privacyGroup/privacyGroupQueries.mjs";
import * as inboxQueries from "./inbox/inboxQueries.mjs";
import * as mainFeedQueries from "./mainFeed/mainFeedQueries.mjs";
import { getPresignedUrl } from "./fileUploads/getPresignedUrl.mjs";

const queries = {
  ...userQueries,
  ...experienceQueries,
  ...collageMutations,
  ...cameraQueries,
  ...lifeListQueries,
  ...privacyGroupQueries,
  ...inboxQueries,
  ...mainFeedQueries,
  getPresignedUrl,
};

export default queries;
