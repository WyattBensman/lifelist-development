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


`;

export default typeDefs;
