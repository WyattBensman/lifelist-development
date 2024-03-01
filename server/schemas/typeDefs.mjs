const typeDefs = `
scalar Date
scalar Int
scalar Upload

# user schema
type User {
    _id: ID!
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
    followRequests: [FollowRequest]
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
    flowpageLinks: [FlowpageLink]
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

  type FollowRequest {
    userId: ID
    status: FollowRequestStatus
  }

  enum FollowRequestStatus {
    PENDING
    ACCEPTED
    REJECTED
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

  type FlowpageLink {
    type: FlowpageLinkType
    url: String
  }

  enum FlowpageLinkType {
    Instagram
    X
    Facebook
    Snapchat
    YouTube
    TikTok
    AppleMusic
    Spotify
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
    FOLLOW
    COLLAGE_REPOST
    COMMENT
    TAG
    MESSAGE
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
    date: Date
    startDate: Date
    finishDate: Date
    month: Month
    entries: [Entry]
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

  type Entry {
    title: String
    content: String
  }

  input EntryInput {
  title: String
  content: String
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

  input FlowpageLinkInput {
    type: String
    url: String
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
    getUserFollowRequest: [FollowRequest]
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
    setBasicInformation(userId: ID!, fullName: String!, gender: String!): Auth
    setProfilePictureAndBio(userId: ID!, profilePicture: Upload, bio: String): User
    createUser(
      fullName: String
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
    login(usernameOrEmailOrPhone: String!, password: String!): Auth
    deleteUser(userId: ID!): MutationResponse
    updateContact(email: String, phoneNumber: String, gender: String, birthday: String): UpdateContactResponse
    updatePassword(currentPassword: String!, newPassword: String!): MutationResponse
    updateProfile(profilePicture: Upload, fullName: String, username: String, bio: String): UpdateProfileResponse
    updateSettings(privacy: String, darkMode: Boolean, language: String, notifications: Boolean): UpdateSettingsResponse
    updateFlowpageLinks(flowpageLinks: [FlowpageLinkInput]): [FlowpageLink]
  }

  # User Relations Mutations
  type Mutation {
    sendFollowRequest(userIdToFollow: ID!): FollowRequestResponse
    unsendFollowRequest(userIdToUnfollow: ID!): User
    acceptFollowRequest(userIdToAccept: ID!): FollowRequestResponse
    denyFollowRequest(userIdToDeny: ID!): FollowRequestResponse
    followUser(userIdToFollow: ID!): MutationResponse
    unfollowUser(userIdToUnfollow: ID!): MutationResponse
    blockUser(userIdToBlock: ID!): MutationResponse
    unblockUser(userIdToUnblock: ID!): MutationResponse
  }

  # Privacy Group Mutations
  type Mutation {
    addUsersToPrivacyGroup(groupId: ID!, userIds: [ID!]!): PrivacyGroup
    createPrivacyGroup(groupName: String!, userIds: [ID!]): PrivacyGroup    
    deletePrivacyGroup(groupId: ID!): MutationResult
    editPrivacyGroup(groupId: ID!, newGroupName: String!): PrivacyGroup
    removeUsersFromPrivacyGroup(groupId: ID!, userIds: [ID!]!): PrivacyGroup
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
      startCollage(images: [Upload]): StartCollageReponse
      addDescription(collageId: ID!, title: String, caption: String): AddDescriptionReponse
      addEntries(collageId: ID!, entries: [EntryInput]): AddEntriesResponse
      addExperiences(collageId: ID!, experienceIds: [ID]): AddExperiencesResponse
      setAudience(collageId: ID!, audience: [PrivacyGroupInput]): CollageCreationResponse
      setLocation(collageId: ID!, locations: [LocationInput]): SetLocationResponse
      setDate(collageId: ID!, startDate: Date, finishDate: Date, month: MonthInput, date: Date): SetDateResponse
      tagUsers(collageId: ID!, taggedUserIds: [ID]): TagUsersResponse
      removeExperiences(collageId: ID!, experienceIds: [ID]!): AddExperiencesResponse
      untagUsers(collageId: ID!, userIdsToUntag: [ID]): TagUsersResponse
      addToLogbook(collageId: ID!): AddToLogBookResponse
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

    type MutationResponse {
      success: Boolean!
      message: String
      action: String
    }

    type MutationResult {
      message: String
    }

    type UpdateContactResponse {
      email: String
      phoneNumber: String
      gender: String
      birthday: String
    }

    type UpdateProfileResponse {
      profilePicture: String
      fullName: String
      username: String
      bio: String
    }

    type UpdateSettingsResponse {
      privacy: String
      darkMode: Boolean
      language: String
      notifications: Boolean
    }

    type FollowRequestResponse {
      success: Boolean
      status: FollowRequestStatus
      message: String
      followRequests: [FollowRequest!]
    }



    type CollageCreationResponse {
      success: Boolean
      message: String
      collageId: ID
    }

    type StartCollageReponse {
      success: Boolean
      message: String
      collageId: ID
      images: [String]
    }

    type AddDescriptionReponse {
      success: Boolean
      message: String
      collageId: ID
      title: String
      caption: String
    }

    type AddEntriesResponse {
      success: Boolean
      message: String
      collageId: ID
      entries: [Entry]
    }

    type AddExperiencesResponse {
      success: Boolean
      message: String
      collageId: ID
      experiences: [ExperienceType]
    }

    type ExperienceType {
      title: String
      image: String
      location: String
      category: String
    }

    type SetDateResponse {
      success: Boolean
      message: String
      collageId: ID
      startDate: Date
      finishDate: Date
      date: Date
      month: Month
    }

    type SetLocationResponse {
      success: Boolean
      message: String
      collageId: ID
      locations: [Location]
    }

    type TagUsersResponse {
      success: Boolean
      message: String
      collageId: ID
      taggedUsers: [User]
    }

    type AddToLogBookResponse {
      success: Boolean
      message: String
      collageId: ID
      logbook: [Collage]
    }

    input DateInput {
      startDate: Date
      finishDate: Date
      month: MonthInput
      date: Date
    }
    
    input MonthInput {
      name: String
      year: Int
    }
    



    `;

export default typeDefs;
