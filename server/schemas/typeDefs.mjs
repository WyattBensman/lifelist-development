const typeDefs = `
scalar Date
scalar Int
scalar Upload

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
    lifeList: LifeList
    collages: [Collage]
    dailyCameraShots: DailyCameraShots
    cameraShots: [CameraShot]
    cameraAlbums: [CameraAlbum]
    repostedCollages: [Collage]
    taggedCollages: [Collage]
    savedCollages: [Collage]
    logbook: [Collage]
    archivedCollages: [Collage]
    conversations: [UserConversation]
    privacyGroups: [PrivacyGroup]
    blocked: [User]
    notifications: [Notification]
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
    userId: User
    status: FollowRequestStatus
  }

  enum FollowRequestStatus {
    PENDING
    ACCEPTED
    REJECTED
  }

  type LifeList {
    _id: ID!
    author: User
    experiences: [LifeListExperience]
  }

  type LifeListExperience {
    experience: Experience
    list: LifeListTypeEnum
    associatedCollages: [Collage]
  }
  
  enum LifeListTypeEnum {
    EXPERIENCED
    WISHLISTED
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
    author: User
    groupName: String
    users: [User]
  }

  type UserSettings {
    privacy: String
    darkMode: Boolean
    language: String
    notifications: Boolean
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
    content: String
    sentAt: Date
  }

  type Conversation {
    _id: ID!
    participants: [User]
    messages: [Message]
    lastMessage: Message
  }

  type UserConversation {
    conversation: ID
    isRead: Boolean!
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
    images: [String]
    coverImage: String
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
    saves: [User]
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

  type CollageSummary {
    entries: [Entry]
    experiences: [Experience]
  }

  # User Queries
  type Query {
    getUserProfileById(userId: ID!): User
    searchUsers(query: String!): [User]
    getFollowers(userId: ID!): [User]
    getFollowing(userId: ID!): [User]
    getUserCollages(userId: ID!): [Collage]
    getUserRepostedCollages(userId: ID!): [Collage]
    getUserTaggedCollages(userId: ID!): [Collage]
    getUserSavedCollages: [Collage]
    getUserLogbook: [Collage]
    getUserArchives: [Collage]
  }

  # Privacy Group Queries
  type Query {
    getPrivacyGroups: [PrivacyGroup]
    getSpecificPrivacyGroup(privacyGroupId: ID!): PrivacyGroup
  }

  # LifeList Queries
  type Query {
    getCurrentUserLifeList: LifeList
    getUserLifeList(userId: ID!): LifeList
    getExperiencedList(lifeListId: ID!): LifeList
    getWishListedList(lifeListId: ID!): LifeList
    getSingleExperience(lifeListId: ID!, experienceId: ID!): Experience
  }
  
  # Collage Queries
  type Query {
    getCollageById(collageId: ID!): Collage
    getCollageMedia(collageId: ID!): [String]
    getCollageSummary(collageId: ID!): CollageSummary
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
    getConversation(conversationId: ID!): Conversation
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
    createPrivacyGroup(groupName: String!, userIds: [ID]!): PrivacyGroup
    editPrivacyGroup(privacyGroupId: ID!, newGroupName: String!): PrivacyGroup
    addUsersToPrivacyGroup(privacyGroupId: ID!, userIds: [ID]!): PrivacyGroup
    removeUsersFromPrivacyGroup(privacyGroupId: ID!, userIds: [ID]!): PrivacyGroup
    deletePrivacyGroup(privacyGroupId: ID!): [PrivacyGroup]
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
    deleteNotification(notificationId: ID!): [Notification]
    markAllNotificationsAsSeen: MutationResponse
    }

    # Messaging Mutations
    type Mutation {
      createConversation(recipientId: ID!, message: String): Conversation
      sendMessage(conversationId: ID!, recipientId: ID, content: String): Conversation
      deleteMessage(conversationId: ID!, messageId: ID!): Conversation
      markConversationAsRead(conversationId: ID!): Conversation
      deleteConversation(conversationId: ID!): [Conversation]
    }
  
    # LifeList Mutations
    type Mutation {
      addExperiencesToLifeList(lifeListId: ID!, experiences: [ExperienceInput]): LifeList
      removeExperiencesFromLifeList(lifeListId: ID!, experienceIds: [ID]): LifeList
      updateExperienceListStatus(lifeListId: ID!, experienceId: ID!, newListStatus: String!): LifeList
      addCollagesToExperienceInLifeList(lifeListId: ID!, experienceId: ID!, collageIds: [ID]!): LifeList
      removeCollagesFromExperienceInLifeList(lifeListId: ID!, experienceId: ID!, collageIds: [ID]!): LifeList
    }

    # Collage Creation Mutations
    type Mutation {
      startCollage(images: [Upload]): StartCollageReponse
      addDescription(collageId: ID!, title: String, caption: String): AddDescriptionReponse
      addEntries(collageId: ID!, entries: [EntryInput]): AddEntriesResponse
      addExperiences(collageId: ID!, experienceIds: [ID]): AddExperiencesResponse
      setAudience(collageId: ID!, audience: [PrivacyGroupInput]): CollageCreationResponse
      setLocation(collageId: ID!, locations: [LocationInput]): SetLocationResponse
      setCoverImage(collageId: ID!, selectedImage: String!): SetCoverImageResponse
      setDate(collageId: ID!, startDate: Date, finishDate: Date, month: MonthInput, date: Date): SetDateResponse
      tagUsers(collageId: ID!, taggedUserIds: [ID]): TagUsersResponse
      removeExperiences(collageId: ID!, experienceIds: [ID]!): AddExperiencesResponse
      untagUsers(collageId: ID!, userIdsToUntag: [ID]): TagUsersResponse
      addToLogbook(collageId: ID!): AddToLogBookResponse
      postCollage(collageId: ID!): Collage
    }

    # Collage Actions Mutations
    type Mutation {
      createComment(collageId: ID!, text: String!): CommentResponse
      deleteComment(collageId: ID!, commentId: ID!): CommentResponse
      editComment(collageId: ID!, commentId: ID!, newText: String!): CommentResponse
      reportCollage(collageId: ID!, reason: String!): MutationResult
      reportComment(collageId: ID!, commentId: ID!, reason: String!): MutationResult
      repostCollage(collageId: ID!): MutationResponse
      saveCollage(collageId: ID!): MutationResponse
      unrepostCollage(collageId: ID!): MutationResponse
      unsaveCollage(collageId: ID!): MutationResponse
      deleteCollage(collageId: ID!): MutationResponse
      archiveCollage(collageId: ID!): MutationResponse
      unarchiveCollage(collageId: ID!): MutationResponse
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

    type SetCoverImageResponse {
      success: Boolean!
      message: String!
      collageId: ID
      selectedImage: String
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

    type CommentResponse {
      success: Boolean!
      message: String!
      comments: [Comment]
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

    input ExperienceInput {
      experience: ID!
      list: String!
    }
    
    

    `;

export default typeDefs;
