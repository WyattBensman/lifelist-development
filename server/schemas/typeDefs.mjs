const typeDefs = `
scalar Date
scalar Int
scalar Upload

# user schema
type User {
    _id: ID!
    fName: String
    lName: String
    fullName: String
    email: String
    phoneNumber: String
    verified: Boolean
    emailVerification: EmailVerification
    phoneVerification: PhoneVerification
    password: String
    profilePicture: String
    username: String
    bio: String
    gender: String
    birthday: Date
    followers: [User]
    following: [User]
    followerRequests: [FollowerRequest]
    lifeList: [LifeListItem]
    collages: [Collage]
    dailyCameraShots: DailyCameraShots
    cameraShots: [CameraShot]
    cameraAlbums: [CameraAlbum]
    repostedCollages: [Collage]
    taggedCollages: [Collage]
    savedCollages: [Collage]
    archivedCollages: [Collage]
    conversations: [Conversation]
    unreadMessagesCount: Int
    settings: UserSettings
  }

  type Auth {
    token: ID!
    user: User
  }

  type Verification {
    code: String
    verified: Boolean
  }

  type EmailVerification {
    code: String
    verified: Boolean
  }
  
  type PhoneVerification {
    code: String
    verified: Boolean
  }

  type FollowerRequest {
    userId: ID
    status: FollowerRequestStatus
  }

  enum FollowerRequestStatus {
    PENDING
    ACCEPTED
    REJECTED
  }

  type LifeListItem {
    experience: Experience
    list: LifeListType
    associatedCollages: [Collage]
  }

  type DailyCameraShots {
    count: Int!
    lastReset: String!
  }

  type PrivacyGroup {
    _id: ID!
    groupName: String!
    users: [User]
  }

  type UserSettings {
    privacy: String
    darkMode: Boolean
    language: String
    notifications: Boolean
    blocked: [User]
    privacyGroups: [PrivacyGroup]
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
    FRIEND_REQUEST
    FRIEND_ACCEPTED
    FOLLOW
    COLLAGE_REPOSTED
    COMMENTED
    TAGGED
  }

  type Message {
    _id: ID!
    sender: User
    recipient: User
    content: String!
    sentAt: Date
  }

  type Conversation {
    _id: ID!
    participants: [User]
    messages: [Message]
    lastMessage: Message
  }

  type Experience {
    _id: ID!
    title: String!
    image: String!
    location: String!
    coordinates: Coordinates!
    types: [ExperienceType!]!
    collages: [Collage]
  }
  
  enum ExperienceType {
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

  type Collage {
    _id: ID!
    author: User
    createdAt: Date
    images: [String]!
    title: String
    caption: String
    summary: String
    experiences: [Experience]
    locations: [Location]
    tagged: [User]
    comments: [Comment]
    reposts: [User]
    audience: [PrivacyGroup]
    posted: Boolean
    reports: [Report]
  }
  
  type Location {
    name: String!
    coordinates: Coordinates!
  }
  
  type Coordinates {
    latitude: Int!
    longitude: Int!
  }
  
  type Comment {
    _id: ID!
    user: User
    text: String
    createdAt: Date
    comments: [Comment]
    reports: [Report]
  }
  
  type Report {
    reporter: User
    reason: String
  }

  type CameraAlbum {
    _id: ID!
    author: User
    title: String
    description: String
    shots: [CameraShot]
  }

  type CameraShot {
    _id: ID!
    author: User
    image: String
    capturedAt: Date
    filtered: Boolean
    shotOrientation: ShotOrientation
  }
  
  enum ShotOrientation {
    VERTICAL
    HORIZONTAL
  }

  # User Queries
  extend type Query {
    getUserById(userId: ID!): User
    searchUsers(query: String!): [User]
    getUserFollowers(userId: ID!): [User]
    getUserFollowing(userId: ID!): [User]
    getUserCollages(userId: ID!): [Collage]
    getUserReposts(userId: ID!): [Collage]
    getUserSavedCollages(userId: ID!): [Collage]
    getUserTaggedCollages(userId: ID!): [Collage]
    getUserLifeList(userId: ID!): [LifeListItem]
    getUserLogbook: [Collage]
    getUserArchives: [Collage]
  }
  
  # Collage Queries
  extend type Query {
    getCollageById(collageId: ID!): Collage
    getCollageMedia(collageId: ID!): [String]
    getCollageSummary(collageId: ID!): CollageSummary
    getCollageComments(collageId: ID!): [Comment]
    getCollageTaggedUsers(collageId: ID!): [User]
  }

  # Camera Queries
  extend type Query {
    getAllCameraAlbums: [CameraAlbum]
    getCameraAlbum(albumId: ID!): CameraAlbum
    getAllCameraShots: [CameraShot]
    getCameraShot(shotId: ID!): CameraShot
  }
  
  # Messaging Queries
  extend type Query {
    getUserConversations: [Conversation]
    getConversationMessages(conversationId: ID!): [Message]
    getUnreadMessagesCount: Int
  }

  # Notification Queries
  extend type Query {
    getUserNotifications: [Notification]
    getUserFollowRequest: [FollowerRequest]
  }

  # Experience Queries
  extend type Query {
    getExperience(experienceId: ID!): Experience
  }

  # User Regristration Mutations
  extend type Mutation {
    initializeRegistration(email: String, phoneNumber: String, birthday: Date): User
    verification(userId: ID!, verificationCode: String!): User
    resendVerificationCode(userId: ID!): User
    setUsernameAndPassword(userId: ID!, username: String!, password: String!): User
    setBasicInformation(userId: ID!, fName: String!, lName: String!, gender: String!): Auth
    setProfilePictureAndBio(userId: ID!, profilePicture: UploadInput, bio: String): User
  } 

  # User Actions Mutations
  extend type Mutation {
    deleteUser(userId: ID!): String
    login(usernameOrEmailOrPhone: String!, password: String!): Auth
    updateUserContact(userId: ID!, email: String, phoneNumber: String, gender: String): User
    updateUserPassword(userId: ID!, currentPassword: String!, newPassword: String!): User
    updateUserProfileInformation(userId: ID!, profilePicture: UploadInput, fName: String!, lName: String!, username: String!, bio: String): User
    updateUserSettings(userId: ID!, privacy: String, darkMode: Boolean, language: String, notifications: Boolean): User
  }

  # User Relations Mutations
  extend type Mutation {
    acceptFollowRequest(userIdToAccept: ID!): User
    denyFollowRequest(userIdToDeny: ID!): User
    followUser(userIdToFollow: ID!): User
    unfollowUser(userIdToUnfollow: ID!): User
    blockUser(userIdToBlock: ID!): User
    unblockUser(userIdToUnblock: ID!): User
  }

  # Privacy Group Mutations
  extend type Mutation {
    addUserToPrivacyGroup(userId: ID!, groupId: ID!, userToAddId: ID!): PrivacyGroup
    createPrivacyGroup(userId: ID!, groupName: String!): PrivacyGroup
    deletePrivacyGroup(userId: ID!, groupId: ID!): String
    editPrivacyGroup(userId: ID!, groupId: ID!, newGroupName: String!): PrivacyGroup
    removeUserFromPrivacyGroup(userId: ID!, groupId: ID!, userToRemoveId: ID!): PrivacyGroup
  }

  # Notification Mutations
  extend type Mutation {
    createNotification(
      recipientId: ID!
      senderId: ID!
      type: String!
      collageId: ID
      message: String
    ): Notification
    deleteNotification(notificationId: ID!): String
    markAllNotificationsAsSeen(userId: ID!): [Notification]
    updateNotificationSeenStatus(notificationId: ID!, seen: Boolean!): Notification

    # Messaging Mutations
    extend type Mutation {
      createConversation(recipientId: ID!, message: String): Conversation
      deleteConversation(conversationId: ID!): String
      deleteMessage(conversationId: ID!, messageId: ID!): Conversation
      markConversationAsRead(conversationId: ID!): Conversation
      sendMessage(conversationId: ID!, senderId: ID!, content: String!): Message
    }

    # LifeList Mutations
    extend type Mutation {
      addCollageToExperienceInLifeList(experienceId: ID!, collageId: ID!): [LifeListItem]
      addExperienceToLifeList(experienceId: ID!, list: String, collageIds: [ID]): [LifeListItem]
      removeCollageFromExperienceInLifeList(experienceId: ID!, collageId: ID!): [LifeListItem]
      removeExperienceFromLifeList(experienceId: ID!): [LifeListItem]
      updateExperienceStatusInLifeList(experienceId: ID!, newList: String): [LifeListItem]
    }

    # Collage Creation Mutations
    extend type Mutation {
      startCollageCreation(images: [Upload]): Collage
      addDescription(collageId: ID!, title: String, caption: String): Collage
      addExperiences(collageId: ID!, experienceIds: [ID]): Collage
      addSummary(collageId: ID!, summary: String): Collage
      addToLogbook(collageId: ID!): Collage
      setAudience(collageId: ID!, audience: [PrivacyGroupInput]): Collage
      setDate(collageId: ID!, date: Date): Collage
      setLocation(collageId: ID!, locations: [LocationInput]): Collage
      tagUsers(collageId: ID!, taggedUserIds: [ID]): Collage
      postCollage(collageId: ID!): Collage
    }

    # Collage Actions Mutations
    extend type Mutation {
      createComment(collageId: ID!, text: String!): Comment
      deleteComment(collageId: ID!, commentId: ID!): String
      editComment(collageId: ID!, commentId: ID!, newText: String!): Comment
      reportCollage(collageId: ID!, reason: String!): String
      reportComment(collageId: ID!, commentId: ID!, reason: String!): String
      repostCollage(collageId: ID!): String
      saveCollage(collageId: ID!): String
      unrepostCollage(collageId: ID!): String
      unsaveCollage(collageId: ID!): String
    }

    # Camera Mutations
    extend type Mutation {
      addShotsToAlbum(albumId: ID!, shotIds: [ID!]!): CameraAlbum
      createAlbum(title: String!, description: String): CameraAlbum
      deleteAlbum(albumId: ID!): String
      deleteShot(shotId: ID!): String
      editAlbum(albumId: ID!, title: String, description: String): CameraAlbum
      editShot(shotId: ID!, orientation: String, filter: Boolean): CameraShot
      removeShotsFromAlbum(albumId: ID!, shotIds: [ID!]!): CameraAlbum
      takeShot(filter: Boolean, shotOrientation: String): CameraShot
    }`;

export default typeDefs;
