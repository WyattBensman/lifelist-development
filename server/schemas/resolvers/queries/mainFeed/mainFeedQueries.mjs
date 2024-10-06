import { Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getMainFeed = async (_, { page = 1 }, { user }) => {
  isUser(user);

  const collagesPerPage = 10; // Adjust as needed
  const foundUser = await User.findById(user).populate("following");
  const followingIds = foundUser.following.map(
    (followingUser) => followingUser._id
  );

  const followingReposts = foundUser.following.reduce((acc, followee) => {
    return acc.concat(followee.repostedCollages);
  }, []);

  const collages = await Collage.find({
    archived: false,
    $or: [
      { author: user },
      { author: { $in: followingIds } },
      { _id: { $in: foundUser.repostedCollages } },
      { _id: { $in: followingReposts } },
    ],
  })
    .sort({ createdAt: -1 }) // Sort by creation date, most recent first
    .skip((page - 1) * collagesPerPage)
    .limit(collagesPerPage)
    .populate("author")
    .exec();

  const totalCollages = await Collage.countDocuments({
    archived: false,
    $or: [
      { author: user },
      { author: { $in: followingIds } },
      { _id: { $in: foundUser.repostedCollages } },
      { _id: { $in: followingReposts } },
    ],
  });

  return {
    collages,
    hasMore: totalCollages > page * collagesPerPage,
  };
};
