import { ConversationType, XboxMessage } from '.'
import { GatewayChannelGroupMessage, GatewayContentParts } from './ws'

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type RequestUrl = string | URL;

type MethodRequestConfig = {
  relyingParty?: string,
  contractVersion?: string,
  data?: unknown,
  headers?: HeadersInit,
};

type RequestConfig = MethodRequestConfig & {
  url: RequestUrl,
};

export interface APIGroup {
  timestamp: string;
  groupId: string;
  groupName: string;
  groupType: string;
  groupTypeMetadata: null;
  displayImageUrl: string;
  canInvite: boolean;
  owner: string;
  participants: string[];
  channels: APIChannelElement[];
}

export interface APIChannelElement {
  timestamp: string;
  id: string;
  voiceId: string;
  channelId: string;
  channelName: string;
  consumptionHorizon: string;
  directMentionHorizon: string;
  clearHorizon: string;
  ticketValid: boolean;
  lastMessage: APIGroupLastMessage;
  notificationOptions: string;
  isRead: boolean;
  voiceRoster: string[];
}


export interface APIGroupLastMessage {
  channel: GatewayChannelGroupMessage;
  payload: APIMessage;
  messageId: string;
  messageTime: string;
  flagIsDeleted: boolean;
}

export interface APIOneToOneConversation {
  timestamp: string;
  networkId: string;
  type: ConversationType.OneToOne;
  conversationId: string;
  participants: string[];
  readHorizon: string;
  deleteHorizon: string;
  isRead: boolean;
  folder: string;
  notificationOptions: string;
  messages: APIMessage[];
  continuationToken: null;
  directMentionHorizon: string;
  muted: boolean;
  voiceId: string;
  voiceRoster: string[];
}

export interface APIGroupConversation {
  timestamp: string;
  networkId: string;
  type: ConversationType.Group;
  conversationId: string;
  participants: string[];
  readHorizon: string;
  deleteHorizon: string;
  isRead: boolean;
  folder: string;
  notificationOptions: string;
  messages: APIMessage[];
  continuationToken: null;
  owner: string;
  name: string;
  displayImageUrl: string;
  directMentionHorizon: string;
  groupType: string;
  muted: boolean;
  voiceId: string;
  voiceRoster: string[];
}

export interface APIMessage {
  contentPayload: APIContentPayload;
  timestamp: string;
  lastUpdateTimestamp: string;
  type: string;
  networkId: string;
  conversationType: string;
  conversationId: string;
  sender: string;
  owner: number;
  messageId: string;
  clock: string;
  isDeleted: boolean;
  isServerUpdated: boolean;
}

export interface APIContentPayload {
  content: APIContent;
}

export interface APIContent {
  parts: GatewayContentParts[];
}

export type APIInboxConversation =
  | APIInboxConversationOneToOne
  | APIInboxConversationGroup

export interface APIInboxConversationBase {
  timestamp: string;
  networkId: string;
  type: ConversationType;
  conversationId: string;
  participants: string[];
  folder: string;
  readHorizon: string;
  deleteHorizon: string;
  lastMessage: APIMessage;
  notificationOptions: string;
  isRead: boolean;
  directMentionHorizon: string;
}

export interface APIInboxConversationOneToOne extends APIInboxConversationBase {
  type: ConversationType.OneToOne
}

export interface APIInboxConversationGroup extends APIInboxConversationBase {
  type: ConversationType.Group;
  groupType: string;
  owner: string;
  name: string;
  displayImageUrl: string;
}

export type RestGetAttachmentsTranscribeResponse = {
  transcription: string,
  confidence: string,
};

export type RestGetUploadAttachmentResponse = {
  uploadUri: string,
  attachmentId: string,
};

export type RestPostSendMessageResponse = {
  messageId: string,
  conversationId: string,
  nudgeUser: boolean,
}

export interface RestGetInboxResponse {
  folder: string;
  totalCount: number;
  unreadCount: number;
  conversations: APIInboxConversation[]
}

export type RestGetConversationResponse =
  APIOneToOneConversation
  | APIGroupConversation

export interface RestGetProfileResponse {
  people: RestGetProfilePersonResponse[];
  recommendationSummary: null;
  friendFinderState: null;
  accountLinkDetails: null;
}

export interface RestGetProfilePersonResponse {
  xuid: string;
  isFavorite: boolean;
  isFollowingCaller: boolean;
  isFollowedByCaller: boolean;
  isIdentityShared: boolean;
  addedDateTimeUtc: null;
  displayName: string;
  realName: string;
  displayPicRaw: string;
  showUserAsAvatar: string;
  gamertag: string;
  gamerScore: string;
  modernGamertag: string;
  modernGamertagSuffix: string;
  uniqueModernGamertag: string;
  xboxOneRep: string;
  presenceState: string;
  presenceText: string;
  presenceDevices: null;
  isBroadcasting: boolean;
  isCloaked: boolean;
  isQuarantined: boolean;
  isXbox360Gamerpic: boolean;
  lastSeenDateTimeUtc: null;
  suggestion: null;
  recommendation: null;
  search: null;
  titleHistory: null;
  multiplayerSummary: null;
  recentPlayer: null;
  follower: null;
  preferredColor: {
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor: string;
  };
  presenceDetails: unknown[];
  titlePresence: null;
  titleSummaries: null;
  presenceTitleIds: null;
  detail: {
    accountTier: string;
    bio: string;
    isVerified: boolean;
    location: string;
    tenure: string;
    watermarks: string[];
    blocked: boolean;
    mute: boolean;
    followerCount: number;
    followingCount: number;
    hasGamePass: boolean;
  };
  communityManagerTitles: null;
  socialManager: null;
  broadcast: null;
  avatar: {
    updateTimeOffset: string;
    spritesheetMetadata: string;
  };
  linkedAccounts: {
    networkName: string;
    displayName: string;
    showOnProfile: boolean;
    isFamilyFriendly: boolean;
    deeplink: string;
  }[];
  colorTheme: string;
  preferredFlag: string;
  preferredPlatforms: unknown[];
}

export type RestGetChatAuthResponse = {
  AuthKey: string
}

export interface RestGetGroupsResponse {
  groups: APIGroup[];
}

export interface RestGetGroupResponse {
  group: APIGroup;
}

export interface RestGetProfileSettingsResponse {
  profileUsers: {
    id: string;
    hostId: string;
    settings: unknown[];
    isSponsoredUser: boolean;
  }[];
}

export class Rest {

  public client: XboxMessage

  constructor(client: XboxMessage) {

    this.client = client

  }

  async post<T>(url: RequestUrl, config: MethodRequestConfig = {}): Promise<T> {
    return this.request('POST', { url, ...config })
  }

  async put<T>(url: RequestUrl, config: MethodRequestConfig = {}): Promise<T> {
    return this.request('PUT', { url, ...config })
  }

  async get<T>(url: RequestUrl, config: MethodRequestConfig = {}): Promise<T> {
    return this.request('GET', { url, ...config })
  }

  async delete<T>(url: RequestUrl, config: MethodRequestConfig = {}): Promise<T> {
    return this.request('DELETE', { url, ...config })
  }

  async getAuthKey(xuid: string) {
    const res = await this.get<RestGetChatAuthResponse>(`https://chat.xboxlive.com/users/xuid(${xuid})/chat/auth`)
    return res.AuthKey
  }

  async getXuid(gamertag: string) {
    const response = await this.get<RestGetProfileSettingsResponse>(`https://profile.xboxlive.com/users/gt(${gamertag})/profile/settings`)
      .then(e => e.profileUsers[0].id)

    return response
  }

  /**
   * Get a user's profile
   * @param identifier The XUID or Gamertag of the user
   * @returns The user's profile
  */
  async getProfile(xuid: string) {
    const response = await this.get<RestGetProfileResponse>(`https://peoplehub.xboxlive.com/users/me/people/xuids(${xuid})/decoration/detail,preferredColor,presenceDetail,avatar`)
      .then(e => e.people[0])

    return response
  }

  async getProfiles(xuids: string[]) {
    const response = await this.post<RestGetProfileResponse>('https://peoplehub.xboxlive.com/users/me/people/batch/decoration/detail,preferredColor,presenceDetail,avatar', { data: { xuids } })

    return response.people
  }

  async getConversations(inbox = 'primary') {
    return this.get<RestGetInboxResponse>(`https://xblmessaging.xboxlive.com/network/xbox/users/me/inbox/${inbox}`)
  }

  async getConversation(conversationType: 'OneToOne' | 'Group', conversationId: string) {
    const url = new URL(`https://xblmessaging.xboxlive.com/network/xbox/users/me/conversations/${conversationType}/${conversationId}`)

    url.searchParams.set('maxItems', '10000')

    return this.get<RestGetConversationResponse>(url)
  }

  async getGroups() {
    return this.get<RestGetGroupsResponse>('https://xblmessaging.xboxlive.com/network/xbox/users/me/groups', { contractVersion: '1' })
  }

  async getGroup(id: string) {
    return this.get<RestGetGroupResponse>(`https://xblmessaging.xboxlive.com/network/xbox/users/me/groups/${id}/summary`, { contractVersion: '1' })
  }

  async getUploadUrl(fileType: 'png' | 'jpg' | 'wav' | 'silk' | 'gif' | 'aac') {
    return this.get<RestGetUploadAttachmentResponse>(`https://xblmessaging.xboxlive.com/network/xbox/users/me/upload/${fileType}`)
  }

  async transcribeVoiceMessage(attachmentId: string) {
    return this.get<RestGetAttachmentsTranscribeResponse>(`https://attachments.xboxlive.com/attachments/${attachmentId}/transcribe`)
  }

  async sendMessageToPlayer(xuid: string, body: object) {
    return this.post<RestPostSendMessageResponse>(`https://xblmessaging.xboxlive.com/network/xbox/users/me/conversations/users/xuid(${xuid})`,
      {
        data: body,
        contractVersion: '1',
      })
  }

  async sendMessageToGroup(groupId: string, channelId: string, body: object) {
    return this.post<RestPostSendMessageResponse>(`https://xblmessaging.xboxlive.com/network/xbox/users/me/groups/${groupId}/channels/${channelId}/messages`,
      {
        data: body,
      })
  }

  async markMessageAsRead(messageId: string, conversationId: string, conversationType: 'OneToOne' | 'Group') {
    return this.put('https://xblmessaging.xboxlive.com/network/xbox/users/me/conversations/horizon', {
      data: {
        conversations: [
          {
            horizonType: 'Read',
            horizon: messageId,
            conversationId,
            conversationType,
          },
        ],
      },
    })
  }

  private async request<T>(method: RequestMethod, config: RequestConfig): Promise<T> {

    const relyingParty = config.relyingParty || 'http://xboxlive.com'

    const auth = await this.client.authflow.getXboxToken(relyingParty)

    const headers = new Headers(config.headers)

    headers.set('authorization', `XBL3.0 x=${auth.userHash};${auth.XSTSToken}`)
    headers.set('x-xbl-contract-version', config.contractVersion || '2')
    headers.set('accept-language', 'en-US')
    headers.set('x-xbl-clientseqnum', `${this.client.ws.sequenceId}`)

    const body = typeof config.data === 'undefined' ? undefined : JSON.stringify(config.data)

    if (body && !headers.has('content-type')) headers.set('content-type', 'application/json')

    const response = await fetch(config.url, {
      method,
      headers,
      body,
    })

    const responseBody = await response.text()

    if (!response.ok) {
      const message = responseBody
        ? `Request failed with status ${response.status} ${response.statusText}: ${responseBody}`
        : `Request failed with status ${response.status} ${response.statusText}`

      throw new Error(message)
    }

    if (!responseBody) return undefined as T

    return JSON.parse(responseBody) as T

  }

}