import React from "react";

interface Props {
  users: any[];
  setSelectedUser: (user: any) => void;
}

const ChatList: React.FC<Props> = ({ users, setSelectedUser }) => {
  return (
    <div className="flex flex-col h-full bg-white">

      {/* Search Bar */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300"
        />
      </div>

      {/* Divider */}
      <hr className="border-t border-blue-200 my-2" />

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">

        {users.map((user, index) => (
          <div key={index}>

            <div
              onClick={() => setSelectedUser(user)}
              className="flex items-center p-4 cursor-pointer hover:bg-blue-50 transition"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3" />

              {/* User Info */}
              <div>
                <div className="font-semibold text-blue-900">
                  {user.name}
                </div>

                <div className="text-sm text-gray-500">
                  Click to start chat
                </div>
              </div>

            </div>

            {/* Divider between users */}
            <hr className="border-t border-blue-200 mx-4" />

          </div>
        ))}

      </div>

    </div>
  );
};

export default ChatList;