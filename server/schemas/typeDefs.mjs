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
    logbook: [Collage]
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
    pending
    accepted
    rejected
  }

  type LifeListItem {
    experience: Experience
    list: LifeListTypeEnum
    associatedCollages: [Collage]
  }
  
  enum LifeListTypeEnum {
    experienced
    wishlisted
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
    title: String
    image: String
    location: String
    coordinates: Coordinates
    category: ExperienceCategory
    collages: [Collage]
  }
  
  enum ExperienceCategory {
    Attractions
    Destinations
    Events
    Courses
    Venues
    Festivals
    Hikes and Trails
    Resorts
    Concerts
    Artists
  }

  type Collage {
    _id: ID!
    author: User
    createdAt: Date
    images: [String]!
    title: String
    caption: String
    startDate: Date
    finishDate: Date
    month: Month
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

  type Month {
    name: String
    year: Int
  }

  input MonthInput {
    name: String
    year: Int
  }
  
  
  type Location {
    name: String!
    coordinates: Coordinates!
  }
  
  type Coordinates {
    latitude: Float!
    longitude: Float!
  }
  
  type Comment {
    _id: ID!
    author: User
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

  input PrivacyGroupInput {
    groupId: ID!
  }
  
  input LocationInput {
    name: String!
    coordinates: CoordinatesInput!
  }
  
  input CoordinatesInput {
    latitude: Float
    longitude: Float
  }

  type MutationResult {
    message: String
  }

  # User Queries
  type Query {
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
  type Query {
    getCollageById(collageId: ID!): Collage
    getCollageMedia(collageId: ID!): [String]
    getCollageSummary(collageId: ID!): String
    getCollageComments(collageId: ID!): [Comment]
    getCollageTaggedUsers(collageId: ID!): [User]
  }

  # Camera Queries
  type Query {
    getAllCameraAlbums: [CameraAlbum]
    getCameraAlbum(albumId: ID!): CameraAlbum
    getAllCameraShots: [CameraShot]
    getCameraShot(shotId: ID!): CameraShot
  }
  
  # Messaging Queries
  type Query {
    getUserConversations: [Conversation]
    getConversationMessages(conversationId: ID!): [Message]
    getUnreadMessagesCount: Int
  }

  # Notification Queries
  type Query {
    getUserNotifications: [Notification]
    getUserFollowRequest: [FollowerRequest]
  }

  # Experience Queries
  type Query {
    getExperience(experienceId: ID!): Experience
  }

  # User Regristration Mutations
  type Mutation {
    initializeRegristration(email: String, phoneNumber: String, birthday: Date): User
    verification(userId: ID!, verificationCode: String!): User
    resendVerificationCode(userId: ID!): User
    setUsernameAndPassword(userId: ID!, username: String!, password: String!): User
    setBasicInformation(userId: ID!, fName: String!, lName: String!, gender: String!): Auth
    setProfilePictureAndBio(userId: ID!, profilePicture: Upload, bio: String): User
    createUser(
      fName: String
      lName: String
      email: String
      phoneNumber: String
      password: String
      username: String
      gender: String
      birthday: String
    ): User
  } 

  # User Actions Mutations
  type Mutation {
    deleteUser(userId: ID!): MutationResult
    login(usernameOrEmailOrPhone: String!, password: String!): Auth
    updateUserContact(userId: ID!, email: String, phoneNumber: String, gender: String): User
    updateUserPassword(userId: ID!, currentPassword: String!, newPassword: String!): User
    updateUserProfile(userId: ID!, profilePicture: Upload, fName: String!, lName: String!, username: String!, bio: String): User
    updateUserSettings(userId: ID!, privacy: String, darkMode: Boolean, language: String, notifications: Boolean): User
  }

  # User Relations Mutations
  type Mutation {
    sendFollowRequest(userIdToFollow: ID!): User
    acceptFollowRequest(userIdToAccept: ID!): User
    denyFollowRequest(userIdToDeny: ID!): User
    followUser(userIdToFollow: ID!): User
    unfollowUser(userIdToUnfollow: ID!): User
    blockUser(userIdToBlock: ID!): User
    unblockUser(userIdToUnblock: ID!): User
  }

  # Privacy Group Mutations
  type Mutation {
    addUsersToPrivacyGroup(userId: ID!, groupId: ID!, userToAddId: ID!): PrivacyGroup
    createPrivacyGroup(userId: ID!, groupName: String!): PrivacyGroup
    deletePrivacyGroup(userId: ID!, groupId: ID!): String
    editPrivacyGroup(userId: ID!, groupId: ID!, newGroupName: String!): PrivacyGroup
    removeUsersFromPrivacyGroup(userId: ID!, groupId: ID!, userToRemoveId: ID!): PrivacyGroup
  }

  # Notification Mutations
  type Mutation {
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
    }

    # Messaging Mutations
    type Mutation {
      createConversation(recipientId: ID!, message: String): Conversation
      deleteConversation(conversationId: ID!): MutationResult
      deleteMessage(conversationId: ID!, messageId: ID!): Conversation
      markConversationAsRead(conversationId: ID!): Conversation
      sendMessage(conversationId: ID!, content: String!): Conversation
    }

    # LifeList Mutations
    type Mutation {
      addCollageToExperienceInLifeList(experienceId: ID!, collageId: ID!): [LifeListItem]
      addExperienceToLifeList(experienceId: ID!, list: String!, collageIds: [ID]): [LifeListItem]
      removeCollageFromExperienceInLifeList(experienceId: ID!, collageId: ID!): [LifeListItem]
      removeExperienceFromLifeList(experienceId: ID!): [LifeListItem]
      updateExperienceStatusInLifeList(experienceId: ID!, newList: String): [LifeListItem]
    }

    # Collage Creation Mutations
    type Mutation {
      startCollageCreation(images: [Upload]): Collage
      addDescription(collageId: ID!, title: String, caption: String): Collage
      addExperiences(collageId: ID!, experienceIds: [ID]): Collage
      removeExperiences(collageId: ID!, experienceIds: [ID]!): Collage
      addSummary(collageId: ID!, summary: String): Collage
      addToLogbook(collageId: ID!): Collage
      setAudience(collageId: ID!, audience: [PrivacyGroupInput]): Collage
      setLocation(collageId: ID!, locations: [LocationInput]): Collage
      setDate(collageId: ID!, startDate: Date, finishDate: Date, month: MonthInput): Collage
      tagUsers(collageId: ID!, taggedUserIds: [ID]): Collage
      untagUsers(collageId: ID!, userIdsToUntag: [ID]): Collage
      postCollage(collageId: ID!): Collage
    }

    # Collage Actions Mutations
    type Mutation {
      createComment(collageId: ID!, text: String!): Comment
      deleteComment(collageId: ID!, commentId: ID!): MutationResult
      editComment(collageId: ID!, commentId: ID!, newText: String!): Comment
      reportCollage(collageId: ID!, reason: String!): MutationResult
      reportComment(collageId: ID!, commentId: ID!, reason: String!): MutationResult
      repostCollage(collageId: ID!): MutationResult
      saveCollage(collageId: ID!): MutationResult
      unrepostCollage(collageId: ID!): MutationResult
      unsaveCollage(collageId: ID!): MutationResult
      deleteCollage(collageId: ID!): String
      archiveCollage(collageId: ID!): Collage
      unarchiveCollage(collageId: ID!): Collage
    }

    # Camera Mutations
    type Mutation {
      addShotsToAlbum(albumId: ID!, shotIds: [ID!]!): CameraAlbum
      createAlbum(title: String!, description: String): CameraAlbum
      deleteAlbum(albumId: ID!): String
      deleteShot(shotId: ID!): String
      editAlbum(albumId: ID!, title: String, description: String): CameraAlbum
      editShot(shotId: ID!, orientation: String, filter: Boolean): CameraShot
      removeShotsFromAlbum(albumId: ID!, shotIds: [ID!]!): CameraAlbum
      takeShot(filter: Boolean, shotOrientation: String): CameraShot
    }
    



    `;

export default typeDefs;
