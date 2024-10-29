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
  isOnboardingComplete: Boolean
  hasAcceptedPermissions: Boolean
  invitedFriends: [InvitedFriend]
  hasAcceptedTerms: Boolean
  verified: Boolean
  emailVerification: VerificationStatus
  phoneVerification: VerificationStatus
  status: String
  expiryDate: Date
}

  type Auth {
    token: ID!
    user: User
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

  type DailyCameraShots {
    count: Int
    lastReset: Date
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
    associatedShots: [CameraShotInfo]
    associatedCollages: [Collage]
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

  type CameraShotInfo {
    shot: CameraShot
    isHidden: Boolean
  }

  type Experience {
    _id: ID!
    title: String
    image: String
    location: String
    coordinates: Coordinates
    category: ExperienceCategory
    collages: [Collage]
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
  }

  type CameraAlbum {
    _id: ID!
    author: User
    coverImage: String
    title: String
    description: String
    shots: [CameraShot]
    shotsCount: Int
  }

  type CameraShot {
    _id: ID!
    author: User
    image: String
    capturedAt: Date
    developingTime: Int!
    isDeveloped: Boolean!
    readyToReviewAt: Date 
    transferredToRoll: Boolean!
  }

  type Query {
    # User Queries
    getUserProfileById(userId: ID!): UserProfileResponse
    getUserCounts(userId: ID!): UserCountsResponse
    getFollowers(userId: ID!, limit: Int, lastSeenId: ID): [UserRelationsResponse]
    getFollowing(userId: ID!, limit: Int, lastSeenId: ID): [UserRelationsResponse]
    getUserCollages(userId: ID!): [Collage]
    getRepostedCollages(userId: ID!): [Collage]
    getTaggedCollages(userId: ID!): [Collage]
    getLikedCollages: [Collage]
    getSavedCollages: [Collage]
    getArchivedCollages: [Collage]
    getBlockedUsers: [User]
    getUserProfileInformation: UserProfileInformation
    getUserContactInformation: UserContactInformation
    getUserIdentityInformation: UserIdentityInformation
    getUserSettingsInformation: UserSettingsInformation
    getAllUsers(limit: Int, offset: Int): [User]
  
    # Privacy Group Queries
    getAllPrivacyGroups: [PrivacyGroup]
    getPrivacyGroup(privacyGroupId: ID!): PrivacyGroup
  
    # LifeList Queries
    getCurrentUserLifeList: LifeList
    getUserLifeList(userId: ID!): LifeList
    getExperiencedList(lifeListId: ID!): [LifeListExperience]
    getWishListedList(lifeListId: ID!): [LifeListExperience]
    getLifeListExperience(experienceId: ID!): LifeListExperience
    getLifeListExperiencesByExperienceIds(lifeListId: ID!, experienceIds: [ID]): [LifeListExperience]
  
    # Collage Queries
    getCollageById(collageId: ID!): CollageResponse
    getComments(collageId: ID!): [Comment]
    getTaggedUsers(collageId: ID!): [User]
    getInteractions(collageId: ID!): CollageInteractions
  
    # Camera Queries
    getDailyCameraShotsLeft: Int
    getAllCameraAlbums: [CameraAlbum]
    getCameraAlbum(albumId: ID!): CameraAlbum
    getAllCameraShots: [CameraShot]
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
    getAllExperiences(limit: Int, offset: Int): [Experience]

    # Main Feed Queries
    getMainFeed(userId: ID!, page: Int!): FeedResult
  }

  # Query Responses
  type FeedResult {
    collages: [Collage]
    hasMore: Boolean
  }

  type UserProfileResponse {
    _id: ID!
    fullName: String
    username: String
    bio: String
    profilePicture: String
    collages: [Collage]
    repostedCollages: [Collage]
    collagesCount: Int
  }

  type UserCountsResponse {
    followersCount: Int
    followingCount: Int
  }

  type UserRelationsResponse {
    _id: ID!
    username: String
    fullName: String
    profilePicture: String
    settings: UserSettings
    followRequests: [User]
    lastCursor: ID
  }

  type CollageResponse {
    collage: Collage
    isLikedByCurrentUser: Boolean
    isRepostedByCurrentUser: Boolean
    isSavedByCurrentUser: Boolean
    hasParticipants: Boolean
  }

  type UserProfileInformation {
    profilePicture: String
    fullName: String
    username: String
    bio: String
    birthday: Date
    gender: String
  }

  type UserContactInformation {
    email: String
    phoneNumber: String
  }
  
  type UserIdentityInformation {
    birthday: Date
    gender: String
  }
  
  type UserSettingsInformation {
    isProfilePrivate: Boolean
    darkMode: Boolean
    language: String
    notifications: Boolean
    postRepostToMainFeed: Boolean
  }

  type CollageInteractions {
    likes: Int
    reposts: Int
    saves: Int
    comments: Int
  }

  type Mutation {
    # User Authentication Mutations
    login(usernameOrEmailOrPhone: String!, password: String!): Auth
    initializeRegistration(email: String, phoneNumber: String, birthday: String!): AuthResponse!
    setBasicInformation(fullName: String!, gender: String!): UserResponse!
    setLoginInformation(username: String!, password: String!): UserResponse!
    setProfilePictureAndBio(profilePicture: Upload, bio: String): UserResponse!
    setProfileInformation(fullName: String!, gender: String!, profilePicture: Upload, bio: String): UserResponse!
    inviteFriend(name: String!, phoneNumber: String!): StandardResponse
    updateInviteStatus(inviteCode: String!): StandardResponse

    # User Actions Mutations
    updatePhoneNumber(phoneNumber: String!): UpdatePhoneNumberResponse!
    updateEmail(email: String!): UpdateEmailResponse!
    updatePassword(currentPassword: String!, newPassword: String!): UpdatePasswordResponse!
    updateProfile(profilePicture: Upload, fullName: String, username: String, bio: String): UpdateProfileResponse!
    updateIdentity(gender: String, birthday: String): UpdateIdentityResponse!
    updateSettings(privacy: String, darkMode: Boolean, language: String, notifications: Boolean, postRepostToMainFeed: Boolean): UpdateSettingsResponse!
    deleteUser(userId: ID!): StandardResponse

    # User Relations Mutations
    followUser(userIdToFollow: ID!): StandardResponse!
    unfollowUser(userIdToUnfollow: ID!): StandardResponse!
    sendFollowRequest(userIdToFollow: ID!): StandardResponse!
    unsendFollowRequest(userIdToUnfollow: ID!): StandardResponse!
    acceptFollowRequest(userIdToAccept: ID!): StandardResponse!
    denyFollowRequest(userIdToDeny: ID!): StandardResponse!
    blockUser(userIdToBlock: ID!): StandardResponse!
    unblockUser(userIdToUnblock: ID!): StandardResponse!

    #Collage Creation Mutations
    startCollage(images: [Upload]): CollageCreationResponse!
    setCoverImage(collageId: ID!, selectedImage: String!): CollageCreationResponse!
    setCaption(collageId: ID!, caption: String): CollageCreationResponse!
    setLocation(collageId: ID!, locations: [LocationInput]): CollageCreationResponse!
    setAudience(collageId: ID!, audience: PrivacySetting!): CollageCreationResponse!
    tagUsers(collageId: ID!, userIds: [ID]): CollageCreationResponse!
    untagUsers(collageId: ID!, userIds: [ID]): CollageCreationResponse!
    createCollage(caption: String, images: [String]!, taggedUsers: [ID]): StandardResponse!

    # Collage Actions Mutations
    saveCollage(collageId: ID!): ActionResponse!
    unsaveCollage(collageId: ID!): ActionResponse!
    repostCollage(collageId: ID!): ActionResponse!
    unrepostCollage(collageId: ID!): ActionResponse!
    likeCollage(collageId: ID!): ActionResponse
    unlikeCollage(collageId: ID!): ActionResponse!
    archiveCollage(collageId: ID!): ActionResponse!
    unarchiveCollage(collageId: ID!): ActionResponse!
    createComment(collageId: ID!, text: String!): ActionResponse!
    editComment(commentId: ID!, newText: String!): ActionResponse!
    deleteComment(collageId: ID!, commentId: ID!): ActionResponse!
    deleteCollage(collageId: ID!): ActionResponse!
    reportCollage(collageId: ID!, reason: ReportReason!): ActionResponse!
    reportComment(commentId: ID!, reason: ReportReason!): ActionResponse!
    likeComment(commentId: ID!): ActionResponse!
    unlikeComment(commentId: ID!): ActionResponse!
  

    # LifeList Mutations
    addExperienceToLifeList(
      lifeListId: ID!
      experienceId: ID!
      list: String!
      associatedShots: [ID]
      associatedCollages: [ID]
    ): StandardResponse
    removeExperienceFromLifeList(lifeListId: ID!, lifeListExperienceId: ID!): StandardResponse
    updateLifeListExperienceListStatus(lifeListExperienceId: ID!, newListStatus: String!): StandardResponse
    addCollagesToLifeListExperience(lifeListExperienceId: ID!, collageIds: [ID]): LifeListExperience
    addShotsToLifeListExperience(lifeListExperienceId: ID!, shotIds: [ID]): LifeListExperience
    removeCollagesFromLifeListExperience(lifeListExperienceId: ID!, collageIds: [ID]): LifeListExperience
    removeShotsFromLifeListExperience(lifeListExperienceId: ID!, shotIds: [ID]): LifeListExperience
    updateAssociatedShots(lifeListExperienceId: ID!, shotIds: [ID]): StandardResponse
    updateAssociatedCollages(lifeListExperienceId: ID!, collageIds: [ID]): StandardResponse

    # Camera Mutations
    createCameraShot(image: Upload!): StandardResponse
    transferCameraShot(shotId: ID!): StandardResponse
    editCameraShot(shotId: ID!, image: String!): StandardResponse
    deleteCameraShot(shotId: ID!): StandardResponse
    createCameraAlbum(title: String!, description: String, shots: [ID]): CameraAlbum
    editCameraAlbum(albumId: ID!, title: String, description: String): CameraAlbum
    deleteCameraAlbum(albumId: ID!): StandardResponse
    addShotToAlbum(albumId: ID!, shotId: ID!): StandardResponse
    removeShotFromAlbum(albumId: ID!, shotId: ID!): StandardResponse
    addShotToExperience(experienceId: ID!, shotId: ID!): StandardResponse
    removeShotFromExperience(experienceId: ID!, shotId: ID!): StandardResponse
    updateAlbumShots(albumId: ID!, shotIds: [ID]!): StandardResponse

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

  type AuthResponse {
    success: Boolean!
    message: String!
    token: String
    user: User
  }
  
  type UserResponse {
    success: Boolean!
    message: String!
    user: User
  }

  type CollageCreationResponse {
    success: Boolean!
    message: String!
    collageId: ID!
  }

  type UpdateEmailResponse {
    success: Boolean!
    message: String!
    email: String
  }
  
  type UpdatePhoneNumberResponse {
    success: Boolean!
    message: String!
    phoneNumber: String
  }
  
  type UpdatePasswordResponse {
    success: Boolean!
    message: String!
  }
  
  type UpdateProfileResponse {
    profilePicture: String
    fullName: String
    username: String
    bio: String
  }
  
  type UpdateIdentityResponse {
    gender: String
    birthday: String
  }
  
  type UpdateSettingsResponse {
    privacy: String
    darkMode: Boolean
    language: String
    notifications: Boolean
    postRepostToMainFeed: Boolean
  }

  input DimensionsInput {
    width: Int
    height: Int
  }

  input LocationInput {
    name: String
    coordinates: CoordinatesInput
  }
  
  input CoordinatesInput {
    latitude: Float
    longitude: Float
  }

  input ExperienceInput {
    experienceId: ID!
    list: LifeListListEnum!
    associatedShots: [ID]
    associatedCollages: [ID]
  }
  
  `;

export default typeDefs;
