import React from 'react';

// Default user data for demonstration (replace with actual props in your app)
const defaultUserData = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  password: "********", // Not displayed
  age: 30,
  profilePicture: "https://vojislavd.com/ta-template-demo/assets/img/profile.jpg",
  bio: "A passionate developer.",
  location: "San Francisco, CA",
  roleId: "Developer",
  followers: [
    { name: "Jane Smith", profilePicture: "https://vojislavd.com/ta-template-demo/assets/img/connections/connection1.jpg" },
    { name: "Mike Johnson", profilePicture: "https://vojislavd.com/ta-template-demo/assets/img/connections/connection1.jpg" },
  ],
  following: [
    { name: "Alice Brown", profilePicture: "https://vojislavd.com/ta-template-demo/assets/img/connections/connection1.jpg" },
    { name: "Bob Green", profilePicture: "https://vojislavd.com/ta-template-demo/assets/img/connections/connection1.jpg" },
  ],
  posts: [
    { title: "First Post", content: "This is my first post." },
    { title: "Second Post", content: "This is my second post." },
  ],
  currentStartup: "Tech Innovate",
};

// ProfileHeader: Displays profile picture, name, role, and location (no buttons)
function ProfileHeader({ user }) {
  return (
    <div className="bg-white rounded-lg shadow-xl pb-8 relative">
      <div className="w-full h-[250px]">
        <img src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg" className="w-full h-full rounded-tl-lg rounded-tr-lg" alt="Background" />
      </div>
      <div className="flex flex-col items-center -mt-20">
        <img
          src={user.profilePicture || "https://via.placeholder.com/150"}
          className="w-40 h-40 border-4 border-white rounded-full object-cover"
          alt="Profile"
        />
        <div className="flex items-center space-x-2 mt-2">
          <p className="text-2xl font-semibold">{user.fullName}</p>
        </div>
        <p className="text-gray-700">{user.roleId}</p>
        <p className="text-sm text-gray-500">{user.location}</p>
      </div>
    </div>
  );
}

// PersonalInfo: Displays user details
function PersonalInfo({ user }) {
  const infoItems = [
    { label: "Full Name", value: user.fullName },
    { label: "Email", value: user.email },
    { label: "Age", value: user.age || "N/A" },
    { label: "Location", value: user.location },
    { label: "Role", value: user.roleId },
    { label: "Current Startup", value: user.currentStartup || "N/A" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <h4 className="text-xl text-gray-900 font-bold">Personal Info</h4>
      <ul className="mt-2 text-gray-700">
        {infoItems.map((item, index) => (
          <li key={index} className="flex border-y py-2">
            <span className="font-bold w-24">{item.label}:</span>
            <span className="text-gray-700">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// AboutSection: Displays the bio
function AboutSection({ bio }) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <h4 className="text-xl text-gray-900 font-bold">About</h4>
      <p className="mt-2 text-gray-700">{bio || "No bio provided."}</p>
    </div>
  );
}

// ActivityLog: Placeholder for activities (customize as needed)
function ActivityLog() {
  const activities = [
    { id: 1, description: "Updated profile picture", date: "2023-10-01" },
    { id: 2, description: "Posted a new update", date: "2023-10-02" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 mt-4">
      <h4 className="text-xl text-gray-900 font-bold">Activity Log</h4>
      <ul className="mt-2 space-y-2">
        {activities.map((activity) => (
          <li key={activity.id} className="text-gray-700">
            {activity.description} - <span className="text-gray-500">{activity.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// UserCard: Reusable component for followers/followings
function UserCard({ user }) {
  return (
    <div className="flex flex-col items-center justify-center text-gray-800">
      <img
        src={user.profilePicture || "https://via.placeholder.com/50"}
        className="w-16 h-16 rounded-full object-cover"
        alt={user.name}
      />
      <p className="text-center font-bold text-sm mt-1">{user.name}</p>
    </div>
  );
}

// FollowersSection: Displays followers list
function FollowersSection({ followers }) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 mt-4">
      <h4 className="text-xl text-gray-900 font-bold">Followers ({followers.length})</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mt-8">
        {followers.map((follower, index) => (
          <UserCard key={index} user={follower} />
        ))}
      </div>
    </div>
  );
}

// FollowingsSection: Displays following list
function FollowingsSection({ following }) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 mt-4">
      <h4 className="text-xl text-gray-900 font-bold">Following ({following.length})</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mt-8">
        {following.map((followee, index) => (
          <UserCard key={index} user={followee} />
        ))}
      </div>
    </div>
  );
}

// PostCard: Reusable component for posts
function PostCard({ post }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h5 className="text-lg font-bold">{post.title}</h5>
      <p className="text-gray-700">{post.content}</p>
    </div>
  );
}

// PostsSection: Displays user's posts
function PostsSection({ posts }) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 mt-4">
      <h4 className="text-xl text-gray-900 font-bold">My Posts</h4>
      <div className="space-y-4 mt-4">
        {posts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </div>
    </div>
  );
}

// Main ProfilePage component
function OwnProfile({ user = defaultUserData }) {
  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <ProfileHeader user={user} />
      <div className="my-4 flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
        <div className="w-full flex flex-col 2xl:w-1/3">
          <PersonalInfo user={user} />
          <ActivityLog />
        </div>
        <div className="flex flex-col w-full 2xl:w-2/3">
          <AboutSection bio={user.bio} />
          <FollowersSection followers={user.followers} />
          <FollowingsSection following={user.following} />
          <PostsSection posts={user.posts} />
        </div>
      </div>
    </div>
  );
}

export default OwnProfile;