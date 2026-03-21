import React from "react";

interface Props {
  users: any[];
  setSelectedUser: (user: any) => void;
}

const ChatList: React.FC<Props> = ({ users, setSelectedUser }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full p-2 border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300"
        />
      </div>
      <hr className="border-t border-blue-200 my-2" />

      <div className="flex-1 overflow-y-auto">
        {users.map((user, index) => {
          const currentMatchId = user.matchId || user.id;
          
          //  Uses the pre-calculated displayName from ChatPage
          const displayName = user.displayName; 
          const initial = displayName ? displayName.charAt(0).toUpperCase() : "U";

          return (
            <div key={currentMatchId || index}>
              <div
                onClick={() => setSelectedUser(user)}
                className="flex items-center p-4 cursor-pointer hover:bg-blue-50 transition"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-3 shrink-0">
                   {initial}
                </div>
                <div className="overflow-hidden">
                  <div className="font-semibold text-blue-900 truncate">
                    {displayName}
                  </div>
                  <div className="text-sm text-gray-500">Click to start chat</div>
                </div>
              </div>
              <hr className="border-t border-blue-200 mx-4" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;