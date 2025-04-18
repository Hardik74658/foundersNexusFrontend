import { CometChat } from '@cometchat/chat-sdk-javascript';
import { appID, region, authKey } from '../../cometchatConfig';

export const initCometChat = async () => {
  if (CometChat.isInitialized && CometChat.isInitialized()) {
    console.log("CometChat is already initialized");
    return Promise.resolve();
  }

  const appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .build();

  return CometChat.init(appID, appSetting);
};

export const registerUserWithCometChat = async (uid, name, avatar) => {
  const user = new CometChat.User(uid);
  user.setName(name);
  if (avatar) user.setAvatar(avatar);

  try {
    await CometChat.createUser(user, authKey);
    console.log('✅ CometChat user created:', uid);
  } catch (error) {
    if (error.code === 'ERR_UID_ALREADY_EXISTS') {
      console.log('⚠️ CometChat user already exists:', uid);
    } else {
      console.error('❌ Error creating CometChat user:', error);
    }
  }
};

export const loginCometChatUser = async (uid) => {
  try {
    // Check if already logged in
    const loggedInUser = await CometChat.getLoggedinUser();
    if (loggedInUser && loggedInUser.getUid() === uid) {
      console.log('✅ User already logged into CometChat:', uid);
      return loggedInUser;
    }
    
    const user = await CometChat.login(uid, authKey);
    console.log('✅ User logged into CometChat:', user.getUid());
    return user;
  } catch (error) {
    console.error('❌ Error logging into CometChat:', error);
    throw error;
  }
};

export const initAndLoginCometChat = async ({ id, name, profilePicture }) => {
  await initCometChat();
  await registerUserWithCometChat(id, name, profilePicture);
  await loginCometChatUser(id);
};
