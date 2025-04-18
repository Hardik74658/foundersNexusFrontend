import { Subject } from 'rxjs';

/**
 * Mock implementation of UI event subjects for handling various UI-related actions
 */
export class CometChatUIEvents {
  static ccShowPanel = new Subject<any>();
  static ccHidePanel = new Subject<any>();
  static ccOpenChat = new Subject<any>();
  static ccCloseSidePanel = new Subject<any>();
  static ccActiveChatChanged = new Subject<any>();
  static ccMouseEvent = new Subject<any>();
}

/**
 * Mock implementation of Call event subjects
 */
export class CometChatCallEvents {
  static ccOutgoingCall = new Subject<any>();
  static ccIncomingCall = new Subject<any>();
  static ccCallEnded = new Subject<any>();
  static ccCallRejected = new Subject<any>();
  static ccCallAccepted = new Subject<any>();
}

/**
 * Mock implementation of Conversation event subjects
 */
export class CometChatConversationEvents {
  static ccConversationDeleted = new Subject<any>();
  static ccConversationRead = new Subject<any>();
}

/**
 * Mock implementation of Group event subjects
 */
export class CometChatGroupEvents {
  static ccGroupLeft = new Subject<any>();
  static ccGroupDeleted = new Subject<any>();
  static ccGroupMemberAdded = new Subject<any>();
  static ccGroupMemberKicked = new Subject<any>();
  static ccGroupMemberBanned = new Subject<any>();
  static ccGroupMemberScopeChanged = new Subject<any>();
  static ccOwnershipChanged = new Subject<any>();
  static ccGroupMemberJoined = new Subject<any>();
}

/**
 * Mock implementation of Message event subjects
 */
export class CometChatMessageEvents {
  static ccMessageDeleted = new Subject<any>();
  static ccMessageEdited = new Subject<any>();
  static ccMessageSent = new Subject<any>();
  static ccMessageRead = new Subject<any>();
}

/**
 * Mock implementation of User event subjects
 */
export class CometChatUserEvents {
  static ccUserBlocked = new Subject<any>();
  static ccUserUnblocked = new Subject<any>();
}
