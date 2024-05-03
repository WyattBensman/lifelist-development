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
  followRequests: [FollowRequest]
  lifeList: LifeList
  collages: [Collage]
  repostedCollages: [Collage]
  taggedCollages: [Collage]
  savedCollages: [Collage]
  archivedCollages: [Collage]
  developingCameraShots: [CameraShot]
  cameraShots: [CameraShot]
  cameraAlbums: [CameraAlbum]
  notifications: [Notification]
  conversations: [Conversation]
  unreadMessagesCount: Int
  settings: UserSettings
  privacyGroups: [PrivacyGroup]
  blocked: [User]
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

  type UserSettings {
    privacy: String
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
    FOLLOW
    COLLAGE_REPOST
    COMMENT
    TAG
    MESSAGE
  }

  type FollowRequest {
    userId: User
    status: FollowRequestStatus
  }

  enum FollowRequestStatus {
    PENDING
    ACCEPTED
    REJECTED
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
    associatedShots: [CameraShot]
    associatedCollages: [Collage]
  }
  
  enum LifeListListEnum {
    EXPERIENCED
    WISHLISTED
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

  enum ExperienceCategory {
    ATTRACTIONS
    DESTINATIONS
    EVENTS
    COURSES
    VENUES
    FESTIVALS
    HIKES_AND_TRAILS
    RESORTS
    CONCERTS
    ARTISTS
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
    camera: CameraType
    shotOrientation: ShotOrientation
    dimensions: Dimensions
  }

  type Dimensions {
    width: Int
    height: Int
  }

  enum CameraType {
    STANDARD
    FUJI
    DISPOSABLE
    POLAROID
  }

  enum ShotOrientation {
    VERTICAL
    HORIZONTAL
  }

  type Query {
    # User Queries
    getUserProfileById(userId: ID!): User
    getFollowers(userId: ID!): [User]
    getFollowing(userId: ID!): [User]
    getUserCollages(userId: ID!): [Collage]
    getRepostedCollages(userId: ID!): [Collage]
    getTaggedCollages(userId: ID!): [Collage]
    getLikedCollages: [Collage]
    getSavedCollages: [Collage]
    getArchives: [Collage]
    getBlockedUsers: [User]
    getUserProfileInformation: UserProfileInformation
    getUserContactInformation: UserContactInformation
    getUserIdentityInformation: UserIdentityInformation
    getUserSettingsInformation: UserSettingsInformation
  
    # Privacy Group Queries
    getAllPrivacyGroups: [PrivacyGroup]
    getPrivacyGroup(privacyGroupId: ID!): PrivacyGroup
  
    # LifeList Queries
    getCurrentUserLifeList: LifeList
    getUserLifeList(userId: ID!): LifeList
    getExperiencedList(lifeListId: ID!): [LifeListExperience]
    getWishListedList(lifeListId: ID!): [LifeListExperience]
    getLifeListExperience(lifeListId: ID!, experienceId: ID!): LifeListExperience
  
    # Collage Queries
    getCollageById(collageId: ID!): Collage
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
    getUserFollowRequest: [FollowRequest]
  
    # Experience Queries
    getExperience(experienceId: ID!): Experience
  }

  # Query Responses
  type UserProfileInformation {
    profilePicture: String
    fullName: String
    username: String
    bio: String
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
    privacy: String
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
    setUsernameAndPassword(username: String!, password: String!): UserResponse!
    setProfilePictureAndBio(profilePicture: Upload, bio: String): UserResponse!

    # User Actions Mutations
    updatePhoneNumber(phoneNumber: String!): UpdateEmailResponse!
    updateEmail(email: String!): UpdatePhoneNumberResponse!
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
    postCollage(collageId: ID!): Collage

    # Collage Actions Mutations
    saveCollage(collageId: ID!): ActionResponse!
    unsaveCollage(collageId: ID!): ActionResponse!
    repostCollage(collageId: ID!): ActionResponse!
    unrepostCollage(collageId: ID!): ActionResponse!
    likeCollage(collageId: ID!): ActionResponse!
    unlikeCollage(collageId: ID!): ActionResponse!
    archiveCollage(collageId: ID!): ActionResponse!
    unarchiveCollage(collageId: ID!): ActionResponse!
    createComment(collageId: ID!, text: String!): ActionResponse!
    editComment(collageId: ID!, commentId: ID!, newText: String!): ActionResponse!
    deleteComment(collageId: ID!, commentId: ID!): ActionResponse!
    deleteCollage(collageId: ID!): ActionResponse!
    reportCollage(collageId: ID!, reason: ReportReason!): ActionResponse!
    reportComment(commentId: ID!, reason: ReportReason!): ActionResponse!

    # LifeList Mutations
    addExperiencesToLifeList(lifeListId: ID!, experiences: [ExperienceInput]): LifeList
    removeExperiencesFromLifeList(lifeListId: ID!, experienceIds: [ID]): LifeList
    updateLifeListExperienceListStatus(lifeListExperienceId: ID!, newListStatus: String): LifeListExperience
    addCollagesToLifeListExperience(lifeListExperienceId: ID!, collageIds: [ID]): LifeListExperience
    addShotsToLifeListExperience(lifeListExperienceId: ID!, shotIds: [ID]): LifeListExperience
    removeCollagesFromLifeListExperience(lifeListExperienceId: ID!, collageIds: [ID]): LifeListExperience
    removeShotsFromLifeListExperience(lifeListExperienceId: ID!, shotIds: [ID]): LifeListExperience

    # Camera Mutations
    createCameraShot(authorId: ID!, image: Upload!, camera: CameraType, shotOrientation: ShotOrientation, dimensions: DimensionsInput): CameraShot
    editCameraShot(shotId: ID!, camera: CameraType): CameraShot
    deleteCameraShot(shotId: ID!): StandardResponse
    createCameraAlbum(authorId: ID!, title: String!, description: String): CameraAlbum
    editCameraAlbum(albumId: ID!, title: String, description: String): CameraAlbum
    deleteCameraAlbum(albumId: ID!): StandardResponse
    addShotsToAlbum(albumId: ID!, shotIds: [ID]): CameraAlbum
    removeShotsFromAlbum(albumId: ID!, shotIds: [ID]): CameraAlbum

    # Privacy Group Mutations
    createPrivacyGroup(groupName: String!, userIds: [ID]!): PrivacyGroup
    editPrivacyGroup(privacyGroupId: ID!, newGroupName: String!): PrivacyGroup
    deletePrivacyGroup(privacyGroupId: ID!): [PrivacyGroup]
    addUsersToPrivacyGroup(privacyGroupId: ID!, userIds: [ID]!): PrivacyGroup
    removeUsersFromPrivacyGroup(privacyGroupId: ID!, userIds: [ID]!): PrivacyGroup

    # Messaging Mutations
    createConversation(recipientId: ID!, message: String): Conversation
    sendMessage(conversationId: ID!, recipientId: ID, content: String): Conversation
    deleteMessage(conversationId: ID!, messageId: ID!): Conversation
    markConversationAsRead(conversationId: ID!): Conversation
    deleteConversation(conversationId: ID!): [Conversation]

    # Notification Mutations
    createNotification(
      recipientId: ID!
      senderId: ID!
      type: String!
      collageId: ID
      message: String
    ): Notification
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
    privacy: Boolean
    darkMode: Boolean
    language: String
    notifications: Boolean
    postRepostToMainFeed: Boolean
  }

  input ExperienceInput {
    experienceId: ID!
    list: String!
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
  `;

export default typeDefs;
