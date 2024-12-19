const typeDefs = `
scalar Date
scalar Int
scalar Upload

type User {
  _id: ID!
  fullName: String
  email: String
  phoneNumber: String
  username: String
  bio: String
  gender: String
  birthday: Date
  profilePicture: String
  followers: [User]
  following: [User]
  followRequests: [User]
  pendingFriendRequests: [User]
  lifeList: LifeList
  collages: [Collage]
  repostedCollages: [Collage]
  taggedCollages: [Collage]
  savedCollages: [Collage]
  archivedCollages: [Collage]
  moments: [Moment]
  shotsLeft: Int
  developingCameraShots: [CameraShot]
  cameraShots: [CameraShot]
  cameraAlbums: [CameraAlbum]
  notifications: [Notification]
  conversations: [UserConversation]
  unreadMessagesCount: Int
  settings: UserSettings
  privacyGroups: [PrivacyGroup]
  blocked: [User]
  accessCode: String
  isOnboardingComplete: Boolean
  hasAcceptedPermissions: Boolean
  invitedFriends: [InvitedFriend]
  hasAcceptedTerms: Boolean
  verified: Boolean
  emailVerification: VerificationStatus
  phoneVerification: VerificationStatus
  status: String
  expiryDate: Date
  reports: [Report]
}

  type Auth {
    token: ID!
    user: User
  }

  type AccessCode {
    id: ID!
    code: String!
    endDate: String!
    count: Int!
    users: [AccessCodeUser]
    isActive: Boolean!
  }

  type AccessCodeUser {
    userId: ID
    usedAt: String
  }

  type InvitedFriend {
  _id: ID!
  name: String!
  phoneNumber: String!
  status: InviteStatus!
  inviteCode: String!
  invitedAt: String!
  expiresAt: String!
}

enum InviteStatus {
  INVITED
  JOINED
  EXPIRED
}

  type UserSettings {
    isProfilePrivate: Boolean
    darkMode: Boolean
    language: String
    notifications: Boolean
    postRepostToMainFeed: Boolean
  }
  
  type PrivacyGroup {
    _id: ID!
    author: User
    groupName: String
    users: [User]
  }

  type Conversation {
    _id: ID!
    participants: [User]
    messages: [Message]
    lastMessage: Message
  }

  type Message {
    _id: ID!
    sender: User
    content: String!
    sentAt: Date
  }

  type UserConversation {
    conversation: Conversation
    isRead: Boolean
  }

  type Notification {
    _id: ID!
    recipient: User
    sender: User
    type: NotificationType
    collage: Collage
    message: String
    read: Boolean
    createdAt: Date
  }

  enum NotificationType {
    FOLLOW_REQUEST
    FOLLOW_ACCEPTED
    FOLLOW
    COLLAGE_REPOST
    COLLAGE_LIKE
    COMMENT
    TAG
    MESSAGE
  }

  type VerificationStatus {
    code: String
    verified: Boolean
  }

  type LifeList {
    _id: ID!
    author: User
    experiences: [LifeListExperience]
  }
  
  type LifeListExperience {
    _id: ID!
    lifeList: LifeList
    experience: Experience
    list: LifeListListEnum
    associatedShots: [CameraShot]
    year: Int
    venue: Experience
    performers: [Experience]
    opponent: Experience
    score: [Score]
  }
  
  enum LifeListListEnum {
    EXPERIENCED
    WISHLISTED
  }

  type Experience {
    _id: ID!
    title: String
    image: String
    address: String
    city: String
    state: String
    country: String
    postalCode: String
    latitude: Float
    longitude: Float
    category: ExperienceCategory
    subCategory: ExperienceSubCategory
    collages: [Collage]
  }

enum ExperienceCategory {
  ATTRACTIONS
  CONCERTS
  DESTINATIONS
  EVENTS
  FESTIVALS
  TRAILS
  RESORTS
  VENUES
  PERFORMERS
  COURSES
  ARTISTS
}

enum ExperienceSubCategory {
  ATTRACTION
  CONCERT
  DESTINATION
  SPORTING_EVENT
  THEATRE_AND_PERFORMING_ARTS_EVENT
  PARADE
  MUSIC_FESTIVAL
  CULTURAL_FESTIVAL
  RELIGIOUS_FESTIVAL
  FOOD_AND_DRINK_FESTIVAL
  ART_FESTIVAL
  HISTORICAL_FESTIVAL
  FLOWER_FESTIVAL
  SEASONAL_FESTIVAL
  TRAIL
  MOUNTAIN_RESORT
  BEACH_RESORT
  GOLF_RESORT
  ISLAND_RESORT
  VENUE
  ARTIST
  COMEDIAN
  GOLF_COURSE
  FOOTBALL
  BASKETBALL
  BASEBALL
  VOLLEYBALL
  SOCCER
  BEACH
  LAKE
  AMUSEMENT_PARK
}

type Score {
  team: String
  score: Int
}

  type Coordinates {
    latitude: Float
    longitude: Float
  }

  type Collage {
    _id: ID!
    author: User
    createdAt: Date
    caption: String
    images: [String]
    coverImage: String
    privacy: PrivacySetting
    privacyGroup: PrivacyGroup
    locations: [Location]
    tagged: [User]
    likes: [User]
    reposts: [User]
    saves: [User]
    comments: [Comment]
    posted: Boolean
    archived: Boolean
    reports: [Report]
  }

  type Comment {
    _id: ID!
    author: User
    text: String
    createdAt: Date
    comments: [Comment]
    reports: [Report]
    likes: Int
    likedBy: [User] 
  }

  enum PrivacySetting {
    PUBLIC
    PRIVATE
    PRIVACY_GROUP
    TAGGED
  }

  type Location {
    name: String
    coordinates: GeoJSONPoint
  }
  
  type GeoJSONPoint {
    type: String
    coordinates: [Float!]
  }
  
  type Report {
    reporter: User
    reason: ReportReason
  }

  enum ReportReason {
    INAPPROPRIATE_CONTENT
    COPYRIGHT_VIOLATION
    HARASSMENT_OR_BULLYING
    FALSE_INFORMATION_OR_MISREPRESENTATION
    VIOLATES_COMMUNITY_GUIDELINES
    SPAM_OR_SCAMS
    IMPERSONATION
    UNSOLICITED_CONTACT
    HATE_SPEECH_OR_DISCRIMINATION
    UNDERAGE_ACCOUNT
    NUDITY_OR_SEXUAL_CONTENT
    UNAUTHORIZED_ACTIVITY
    OTHER
  }

  type CameraAlbum {
    _id: ID!
    author: User
    coverImage: String
    title: String
    shots: [CameraShot]
    shotsCount: Int
  }

  type CameraShot {
    _id: ID!
    author: User
    image: String
    imageThumbnail: String
    capturedAt: Date
    developingTime: Int!
    isDeveloped: Boolean!
    readyToReviewAt: Date 
    transferredToRoll: Boolean!
  }

  type Moment {
    _id: ID!
    author: User
    cameraShot: CameraShot
    createdAt: String
    expiresAt: String
    views: [User]
    likes: [User]
    reports: [Report]
  }

  type Query {
    # User Queries
    getUserData: UserData
    getUserProfileById(userId: ID!, collagesCursor: ID, repostsCursor: ID, limit: Int = 15): UserProfileResponse
    getUserCounts(userId: ID!): UserCountsResponse
    getCollagesRepostsMoments(userId: ID!, collagesCursor: ID, repostsCursor: ID, limit: Int = 15): CollagesRepostsMomentsResponse
    checkIsFollowing(userId: ID!): FollowStatus
    getFollowers(userId: ID!, cursor: ID, limit: Int): UserWithRelationshipStatusPagination
    getFollowing(userId: ID!, cursor: ID, limit: Int): UserWithRelationshipStatusPagination
    getTaggedCollages(userId: ID!, cursor: ID, limit: Int): CollagePagination
    getSavedCollages(cursor: ID, limit: Int): CollagePagination
    getArchivedCollages(cursor: ID, limit: Int): CollagePagination
    getBlockedUsers: [User]
    getAllUsers(cursor: ID, limit: Int, searchQuery: String): UserWithRelationshipStatusPagination

    # Moment Queries
    getUserMoments(userId: ID!): [Moment]
    getFriendsMoments(cursor: String, limit: Int): PaginatedMoments
    getMomentLikes(momentId: ID!): [User]

    # Fle Upload Queries
    getPresignedUrl(folder: String!, fileName: String!, fileType: String!): PresignedUrlResponse!
  
    # Privacy Group Queries
    getAllPrivacyGroups: [PrivacyGroup]
    getPrivacyGroup(privacyGroupId: ID!): PrivacyGroup
  
    # LifeList Queries
    getUserLifeList(userId: ID!, cursor: ID, limit: Int): LifeListPagination
    getLifeListExperience(experienceId: ID!, cursor: ID, limit: Int): LifeListExperiencePagination
  
    # Collage Queries
    getCollageById(collageId: ID!): CollageResponse
    getComments(collageId: ID!): [Comment]
    getTaggedUsers(collageId: ID!): [User]
    getInteractions(collageId: ID!): CollageInteractions
  
    # Camera Queries
    getAllCameraAlbums: [CameraAlbum]
    getCameraAlbum(albumId: ID!, cursor: ID, limit: Int = 12): CameraAlbumPagination
    getAllCameraShots(cursor: ID, limit: Int): CameraRollPagination
    getCameraShot(shotId: ID!): CameraShot
    getDevelopingCameraShots: [CameraShot]
  
    # Messaging Queries
    getUserConversations: [Conversation]
    getConversation(conversationId: ID!): Conversation
    getUnreadMessagesCount: Int
  
    # Notification Queries
    getUserNotifications: [Notification]
    getFollowRequests: [User]
  
    # Experience Queries
    getExperience(experienceId: ID!): Experience
    getAllExperiences(cursor: ID, limit: Int): ExperiencePagination

    # Main Feed Queries
    getMainFeed(userId: ID!, page: Int!): FeedResult

    # Explore Queries
    getRecommendedProfiles(cursor: ID, limit: Int): RecommendedProfilePagination
    getRecommendedCollages(cursor: ID, limit: Int): RecommendedCollagePagination
  }

  # Query Responses
  type FeedResult {
    collages: [Collage]
    hasMore: Boolean
  }

  type CollagesRepostsMomentsResponse {
    collages: CollageRepostPagination
    repostedCollages: CollageRepostPagination
    moments: [Moment]
  }

  type CollagePagination {
    collages: [Collage]
    nextCursor: ID
    hasNextPage: Boolean
  }

  type RecommendedProfilePagination {
    profiles: [RecommendedProfile]
    nextCursor: ID
    hasNextPage: Boolean
  }

  type RecommendedProfile {
    user: User
    overlapScore: Int
    followerCount: Int
  }

  type RecommendedCollagePagination {
    collages: [RecommendedCollage]
    nextCursor: ID
    hasNextPage: Boolean
  }

  type RecommendedCollage {
    _id: ID!
    author: User
    coverImage: String
    createdAt: String
    likesCount: Int
    repostsCount: Int
    savesCount: Int
    overlapScore: Int
    popularityScore: Int
  }

  type LifeListPagination {
    _id: ID!
    experiences: [LifeListExperienceWithDetails]
    nextCursor: ID
    hasNextPage: Boolean
  }

  type PaginatedMoments {
    moments: [Moment]
    nextCursor: String
    hasNextPage: Boolean
  }

  type LifeListExperiencePagination {
    lifeListExperience: LifeListExperience
    nextCursor: ID
    hasNextPage: Boolean
  }

type LifeListExperienceWithDetails {
  _id: ID!
  list: LifeListListEnum
  experience: ExperienceDetails
  hasAssociatedShots: Boolean
  associatedShots: [CameraShotMetadata]
}

type CameraShotMetadata {
  _id: ID!
  capturedAt: Date
  image: String
  imageThumbnail: String
}

type ExperienceDetails {
  _id: ID!
  title: String
  image: String
  category: String
  subCategory: String
}

  type CollageRepostPagination {
    items: [Collage]
    nextCursor: ID
    hasNextPage: Boolean
  }

  type ExperiencePagination {
    experiences: [Experience]
    nextCursor: ID
    hasNextPage: Boolean
  }

  type CameraRollPagination {
    shots: [CameraShot]
    nextCursor: ID
    hasNextPage: Boolean
  }

  type CameraAlbumPagination {
    album: CameraAlbum
    shots: [CameraShot]
    nextCursor: ID
    hasNextPage: Boolean
  }

  type UserWithRelationshipStatusPagination {
    users: [UserWithRelationshipStatus]
    nextCursor: ID
    hasNextPage: Boolean
  }

  type UserWithRelationshipStatus {
    user: User
    relationshipStatus: String
    isPrivate: Boolean
    hasSentFollowRequest: Boolean
  }

  type UserProfileResponse {
    _id: ID!
    fullName: String
    username: String
    bio: String
    profilePicture: String
    collages: CollageRepostPagination
    repostedCollages: CollageRepostPagination
    followersCount: Int!
    followingCount: Int!
    collagesCount: Int!
    isFollowing: Boolean!
    isFollowedBy: Boolean!
    isFollowRequested: Boolean!
    hasActiveMoments: Boolean!
  }

  type UserCountsResponse {
    followersCount: Int
    followingCount: Int
    collagesCount: Int
  }

  type FollowStatus {
    isFollowing: Boolean
  }

  type CollageResponse {
    collage: Collage
    isLikedByCurrentUser: Boolean
    isRepostedByCurrentUser: Boolean
    isSavedByCurrentUser: Boolean
    hasParticipants: Boolean
  }

  type UserData {
    profilePicture: String
    fullName: String
    username: String
    bio: String
    birthday: String
    gender: String
    email: String
    phoneNumber: String
    settings: UserSettings
  }

  type CollageInteractions {
    likes: Int
    reposts: Int
    saves: Int
    comments: Int
  }

  input CreateProfileInput {
    fullName: String!
    bio: String
    gender: String
    profilePicture: String
    username: String!
    password: String!
    email: String
    phoneNumber: String
    birthday: String!
    accessCode: String
  }

  type Mutation {
    # User Authentication Mutations
    login(usernameOrEmailOrPhone: String!, password: String!): Auth
    createProfile(input: CreateProfileInput!): Auth
    validateContactAndBirthday(email: String, phoneNumber: String, birthday: String!): StandardResponse
    validateUsernameAndPassword(username: String!, password: String!): StandardResponse
    validateProfileDetails(fullName: String!, gender: String!, bio: String): StandardResponse
    inviteFriend(name: String!, phoneNumber: String!): StandardResponse
    updateInviteStatus(inviteCode: String!): StandardResponse

    # Early Access Mutations
    verifyAccessCode(code: String!): StandardResponse!
    associateUserWithAccessCode(userId: ID!, code: String!): StandardResponse!
    createAccessCode(
      code: String!
      endDate: String!
      isActive: Boolean
    ): CreateAccessCodeResponse!

    # User Actions Mutations
    deleteUser(userId: ID!): StandardResponse
    reportProfile(profileId: ID!, reason: String!): StandardResponse
    updateUserData(
    email: String
    currentPassword: String
    newPassword: String
    phoneNumber: String
    profilePicture: Upload
    fullName: String
    username: String
    bio: String
    gender: String
    birthday: String
    isProfilePrivate: Boolean
    darkMode: Boolean
    language: String
    notifications: Boolean
    postRepostToMainFeed: Boolean
  ): UpdateUserResponse

    # User Relations Mutations
    followUser(userIdToFollow: ID!): StandardResponse!
    unfollowUser(userIdToUnfollow: ID!): StandardResponse!
    sendFollowRequest(userIdToFollow: ID!): StandardResponse!
    unsendFollowRequest(userIdToUnfollow: ID!): StandardResponse!
    acceptFollowRequest(userIdToAccept: ID!): StandardResponse!
    denyFollowRequest(userIdToDeny: ID!): StandardResponse!
    blockUser(userIdToBlock: ID!): StandardResponse!
    unblockUser(userIdToUnblock: ID!): UnblockUserResponse!

    #Collage Creation Mutations
    createCollage(caption: String, images: [String]!, taggedUsers: [ID], coverImage: String): CreateCollageResponse!
    updateCollage(collageId: ID!, caption: String, images: [String]!, taggedUsers: [ID], coverImage: String): StandardResponse!

    # Collage Actions Mutations
    saveCollage(collageId: ID!): ActionResponse!
    unsaveCollage(collageId: ID!): ActionResponse!
    repostCollage(collageId: ID!): CollageCollageResponse
    unrepostCollage(collageId: ID!): CollageIdResponse
    likeCollage(collageId: ID!): ActionResponse
    unlikeCollage(collageId: ID!): ActionResponse!
    archiveCollage(collageId: ID!): CollageIdResponse
    unarchiveCollage(collageId: ID!): CollageCollageResponse
    createComment(collageId: ID!, text: String!): ActionResponse!
    editComment(commentId: ID!, newText: String!): ActionResponse!
    deleteComment(collageId: ID!, commentId: ID!): ActionResponse!
    deleteCollage(collageId: ID!): CollageIdResponse
    reportCollage(collageId: ID!, reason: String!): StandardResponse
    reportComment(commentId: ID!, reason: String!): StandardResponse
    reportMoment(momentId: ID!, reason: String!): StandardResponse
    likeComment(commentId: ID!): ActionResponse!
    unlikeComment(commentId: ID!): ActionResponse!
  
    # LifeList Mutations
    addLifeListExperience(
      lifeListId: ID!
      experienceId: ID!
      list: LifeListListEnum!
      associatedShots: [ID]
    ): AddLifeListExperienceResponse

    updateLifeListExperience(
      lifeListExperienceId: ID!
      list: LifeListListEnum
      associatedShots: [ID]
    ): StandardResponse

    removeLifeListExperience(
      lifeListId: ID!
      lifeListExperienceId: ID!
    ): StandardResponse

    # Camera Mutationss
    createCameraShot(image: String!, thumbnail: String!): CreateCameraShotResponse
    getAndTransferCameraShot(shotId: ID!): GetAndTransferCameraShotResponse
    deleteCameraShot(shotId: ID!): StandardResponse
      createCameraAlbum(
    title: String!
    shots: [ID]
    shotsCount: Int
    coverImage: String
    ): CreateCameraAlbumResponse
    editCameraAlbum(albumId: ID!, title: String): CameraAlbum
    deleteCameraAlbum(albumId: ID!): StandardResponse
    updateAlbumShots(albumId: ID!, shotIds: [ID]!): StandardResponse

    # Moment Mutations
    postMoment(cameraShotId: ID!): PostMomentResponse
    deleteMoment(momentId: ID!): DeleteMomentResponse
    markMomentAsViewed(momentId: ID!): Boolean
    likeMoment(momentId: ID!): MomentActionResponse
    unlikeMoment(momentId: ID!): MomentActionResponse

    # Privacy Group Mutations
    createPrivacyGroup(groupName: String!, userIds: [ID]!): PrivacyGroup
    editPrivacyGroup(privacyGroupId: ID!, newGroupName: String!): PrivacyGroup
    deletePrivacyGroup(privacyGroupId: ID!): StandardResponse
    addUsersToPrivacyGroup(privacyGroupId: ID!, userIds: [ID]!): PrivacyGroup
    removeUsersFromPrivacyGroup(privacyGroupId: ID!, userIds: [ID]!): PrivacyGroup

    # Messaging Mutations
    createConversation(recipientId: ID!, message: String): StandardResponse
    sendMessage(conversationId: ID!, recipientId: ID, content: String): StandardResponse
    deleteMessage(conversationId: ID!, messageId: ID!): StandardResponse
    markConversationAsRead(conversationId: ID!): StandardResponse
    deleteConversation(conversationId: ID!): StandardResponse

    # Notification Mutations
    createNotification(
      recipientId: ID!
      senderId: ID!
      type: String!
      collageId: ID
      message: String
    ): StandardResponse
    deleteNotification(notificationId: ID!): StandardResponse
    markAllNotificationsAsSeen: StandardResponse
  }

  # Mutation Responses
  type StandardResponse {
    success: Boolean!
    message: String!
  }

  type ActionResponse {
    success: Boolean!
    message: String!
    action: String
  }

  type CollageCollageResponse {
    success: Boolean!
    message: String!
    collage: Collage
  }

  type CreateCollageResponse {
    success: Boolean!
    message: String!
    collage: Collage!
  }

  type CollageIdResponse {
    success: Boolean!
    message: String!
    collageId: ID!
  }

  type CreateAccessCodeResponse {
    success: Boolean!
    message: String!
    accessCode: AccessCode
  }

  type MomentActionResponse {
    success: Boolean!
    message: String!
    momentId: ID!
  }

  type UnblockUserResponse {
    success: Boolean!
    message: String!
    userIdToUnblock: ID!
  }

  type AddLifeListExperienceResponse {
    success: Boolean!
    message: String!
    lifeListExperienceId: ID
  }

  type CreateCameraAlbumResponse {
    success: Boolean!
    message: String!
    albumId: ID
  }

  type PostMomentResponse {
    _id: ID!
    createdAt: String!
    expiresAt: String!
    success: Boolean!
    message: String!
  }

  type DeleteMomentResponse {
    deletedMomentId: ID!
    success: Boolean!
    message: String!
  }


  type GetAndTransferCameraShotResponse {
    success: Boolean!
    message: String!
    cameraShot: CameraShotDetails
  }

  type CameraShotDetails {
    _id: ID!
    image: String!
  }

  type CreateCameraShotResponse {
    success: Boolean!
    message: String!
    cameraShot: CameraShot
  }

  type UpdateUserResponse {
    success: Boolean
    message: String
    user: UserData
  }

  type PresignedUrlResponse {
    presignedUrl: String
    fileUrl: String    
  }  
`;

export default typeDefs;
