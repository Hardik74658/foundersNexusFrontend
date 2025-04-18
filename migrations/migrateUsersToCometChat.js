const axios = require('axios');
const fs = require('fs');
require('dotenv').config(); // If you use environment variables

// CometChat configuration - store these in environment variables for production
const COMETCHAT_APP_ID = '272738e1c3d1b4aa'; // Replace with your App ID
const COMETCHAT_REGION = 'in'; // Replace with your region
const COMETCHAT_REST_API_KEY = '37f1bad27f18415e2e06894a9bf8e5f6194cb74d'; // Replace with your REST API key

/**
 * Creates a single user in CometChat
 * @param {Object} user - User object containing _id, fullName, email, profilePicture
 */
async function createCometChatUser(user) {
  try {
    const response = await axios.post(
      `https://${COMETCHAT_APP_ID}.api-${COMETCHAT_REGION}.cometchat.io/v3/users`,
      {
        uid: user._id,
        name: user.fullName || 'User',
        avatar: user.profilePicture || '',
        email: user.email || ''
      },
      {
        headers: {
          'apiKey': COMETCHAT_REST_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    console.log(`✅ Created CometChat user: ${user._id} (${user.fullName})`);
    return response.data;
  } catch (error) {
    // If user already exists, consider it a success
    if (error.response && error.response.status === 409) {
      console.log(`User already exists in CometChat: ${user._id} (${user.fullName})`);
      return { success: true, message: 'User already exists' };
    }
    console.error(`❌ Failed to create CometChat user: ${user._id}`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * Migrates multiple users to CometChat with throttling to avoid rate limits
 * @param {Array} users - Array of user objects
 */
async function migrateUsersToCometChat(users) {
  console.log(`Starting migration of ${users.length} users to CometChat...`);
  const results = { success: [], failed: [] };
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Process users with a delay between each to avoid rate limits
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    try {
      await createCometChatUser(user);
      results.success.push(user._id);
    } catch (error) {
      results.failed.push({ id: user._id, error: error.message });
    }
    
    // Add a small delay between requests (50ms) to prevent overwhelming the API
    if (i < users.length - 1) await delay(50);
    
    // Log progress periodically
    if ((i + 1) % 10 === 0 || i === users.length - 1) {
      console.log(`Progress: ${i + 1}/${users.length} users processed`);
    }
  }
  
  // Save failed users to a file for retry
  if (results.failed.length > 0) {
    fs.writeFileSync('failed_cometchat_users.json', JSON.stringify(results.failed, null, 2));
    console.log(`Migration completed with ${results.failed.length} failures. See failed_cometchat_users.json`);
  } else {
    console.log(`✅ Migration successfully completed for all ${results.success.length} users`);
  }
  
  return results;
}

/**
 * Main function to execute the migration
 * This would typically be called from an API endpoint or command line script
 */
async function runMigration() {
  try {
    // 1. Get all users from your database
    // Replace this with actual code to get users from your database
    const allUsers = await fetchAllUsersFromDatabase();
    
    // 2. Migrate them to CometChat
    const results = await migrateUsersToCometChat(allUsers);
    
    // 3. Output results
    console.log(`Migration completed. Success: ${results.success.length}, Failed: ${results.failed.length}`);
    return results;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

/**
 * Example function to fetch users from your database
 * Replace with your actual database query
 */
async function fetchAllUsersFromDatabase() {
  // Replace this with your actual database code
  // For example, if using MongoDB:
  // const users = await User.find({}).lean();
  
  try {
    const response = await axios.get('http://localhost:8000/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// If running as a script directly
if (require.main === module) {
  runMigration()
    .then(() => console.log('Migration script completed'))
    .catch(err => console.error('Migration script failed:', err))
    .finally(() => process.exit());
}

// Export functions for use in other files
module.exports = {
  createCometChatUser,
  migrateUsersToCometChat,
  runMigration
};
